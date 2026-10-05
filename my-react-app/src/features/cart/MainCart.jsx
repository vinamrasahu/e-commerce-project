import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCart } from "./cartSlice";
import { Link } from "react-router-dom";
import { moveToWishlist } from "../../services/cartService";
import { getCart, updateCart, deleteCartItem } from "../../services/cartService";
import FloneNavbar from "../../components/layout/Navbar";
import FloneFooter from "../../components/layout/Footer/Footer";

import { setOrder } from "./orderSlice";
/* ---------- Icons ---------- */
const TrashIcon = () => (
  <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0v12a2 2 0 002 2h4a2 2 0 002-2V7" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
  </svg>
);

const BagIcon = () => (
  <svg className="w-[46px] h-[46px]" fill="none" stroke="#CFCFCF" strokeWidth="1.3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="9" rx="1.5" />
    <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

// Used for "Buy Now" so it doesn't look like a delete action
const CartIcon = () => (
  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const money = (n) => `₹${Number(n || 0).toFixed(2)}`;

/**
 * Normalizes a cart-item record coming back from the API into the flat
 * shape this component renders. Backends differ in whether product info
 * (name/price/image) is nested under `product` or flattened onto the
 * cart-item itself — this handles both. Adjust the field names below to
 * match your actual `getCart()` response if they differ.
 */
const normalizeItem = (raw) => {
  // Falls back to the raw object itself if product fields aren't nested
  // under product/productId (see the same issue on the Wishlist page).
  const product = raw.product || raw.productId || raw;

  const rawImgUrl =
    raw.image || product.image || product.thumbnail || null;
  // Some images come back without a leading slash (e.g. "uploads/x.jpg"),
  // which breaks `${host}${imgUrl}` concatenation — normalize it here.
  const imgUrl = rawImgUrl ? (rawImgUrl.startsWith("/") ? rawImgUrl : `/${rawImgUrl}`) : null;

  return {
    productId: product._id || product.id,
    id: raw._id || raw.id,
    sku: raw.sku || product.sku || null,
    name: raw.name || product.name || product.title || "Untitled item",
    color: raw.color || product.color || null,
    size: raw.size || raw.variant || null,
    price: Number(
      raw.salePrice ??
      product.salePrice ??
      raw.price ??
      product.price ??
      0
    ),
    
    compareAtPrice: Number(
      raw.price ??
      product.price ??
      0
    ),
    qty: Number(raw.qty ?? raw.quantity ?? 1),

    stock: product.stock,
    inStock: product.stock > 0,

    swatch: raw.swatch || product.swatch || "#E5E5E5",
    imgUrl,
  };
 
};

export default function FloneCartPage() {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (document.getElementById("jost-font-link")) return;
    const link = document.createElement("link");
    link.id = "jost-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCart();
      console.log(res.data);
      const raw = res?.data?.items || res?.data || [];
      const normalizedItems = Array.isArray(raw) ? raw.map(normalizeItem) : [];

      // Show everything, including out-of-stock items — those get a
      // disabled state and a "Move to Wishlist" action instead of being
      // silently removed from the bag.
      setItems(normalizedItems);
      dispatch(setCart(normalizedItems));
    } catch (err) {
      console.error(err);
      setError("We couldn't load your bag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: now respects each item's actual stock (falls back to 9 if stock
  // is missing/undefined) instead of a hardcoded max of 9 for everyone.
  // FIX: also dispatches the updated array to Redux so every other
  // component reading the cart (navbar count, checkout, etc.) stays in
  // sync with what's shown on this page — this was the source of the
  // "wrong price" bug, since Redux was only ever updated on initial load.
  const updateQty = async (id, delta) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;

    const max = target.stock > 0 ? target.stock : 9;
    const newQty = Math.max(1, Math.min(max, target.qty + delta));

    if (newQty === target.qty) return; // nothing changed (hit min/max)

    // Optimistic update
    const optimisticItems = items.map((it) =>
      it.id === id ? { ...it, qty: newQty } : it
    );
    setItems(optimisticItems);
    dispatch(setCart(optimisticItems));

    try {
      await updateCart(id, { qty: newQty });
    } catch (err) {
      console.error(err);
      // Roll back on failure
      const rolledBackItems = items.map((it) =>
        it.id === id ? { ...it, qty: target.qty } : it
      );
      setItems(rolledBackItems);
      dispatch(setCart(rolledBackItems));
      toast.error("Couldn't update quantity");
    }
  };

  const removeItem = async (id) => {
    const prevItems = items;
    const updatedItems = items.filter((it) => it.id !== id);
    setItems(updatedItems);
    dispatch(setCart(updatedItems));

    try {
      await deleteCartItem(id);
    } catch (err) {
      console.error(err);
      // Roll back on failure
      setItems(prevItems);
      dispatch(setCart(prevItems));
      toast.error("Couldn't remove item");
    }
  };

  // Lets the user explicitly move an out-of-stock item to their wishlist
  // via the cart-side endpoint (removes it from the cart on the backend).
  const handleMoveToWishlist = async (item) => {
    try {
      await moveToWishlist(item.id);
      toast.success("Moved to Wishlist");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const subtotal = useMemo(
    () => items.filter((it) => it.inStock).reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "FLONE10") {
      const d = +(subtotal * 0.1).toFixed(2);
      setDiscount(d);
      setPromoMsg({ ok: true, text: "10% off applied" });
    } else {
      setDiscount(0);
      setPromoMsg({ ok: false, text: "Code not recognized" });
    }
  };

  // If `singleItem` is passed (from a per-product "Buy Now" click), checkout
  // is scoped to just that item. Otherwise (the main "Checkout" button) it
  // uses the full cart. Shipping/discount are recalculated for whichever
  // set of items is actually being purchased, so a single-item buy doesn't
  // inherit the whole cart's promo discount or free-shipping threshold.
  const handleCheckout = (singleItem = null) => {
    const checkoutItems = singleItem ? [singleItem] : items.filter((it) => it.inStock);
    const checkoutSubtotal = checkoutItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const checkoutShipping = checkoutSubtotal > 150 || checkoutSubtotal === 0 ? 0 : 12;
    const checkoutDiscount = singleItem ? 0 : discount;
    const checkoutTotal = Math.max(0, checkoutSubtotal - checkoutDiscount + checkoutShipping);

    dispatch(
      setOrder({
        items: checkoutItems,
        summary: {
          subtotal: checkoutSubtotal,
          shipping: checkoutShipping,
          discount: checkoutDiscount,
          total: checkoutTotal,
        },
      })
    );
  };

  return (
    <>
      <FloneNavbar />

      <div className="min-h-screen bg-white" style={{ fontFamily: "'Jost', 'Inter', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-24">
          {/* Header */}
          <div className="mb-10">
            <p
              className="uppercase text-[#666666] mb-2"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em" }}
            ></p>
            <h1 style={{ fontSize: "40px", fontWeight: 300, letterSpacing: "-1px", color: "#111111", lineHeight: 1.1 }}>
              Your Bag
              {!loading && items.length > 0 && (
                <span style={{ fontSize: "18px", fontWeight: 400, color: "#999999", marginLeft: "12px" }}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </h1>
          </div>

          {loading ? (
            <div className="py-24 text-center border-t border-[#ECECEC]">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666666" }}>Loading your bag…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border-t border-[#ECECEC]">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#C0392B" }}>{error}</p>
              <button
                onClick={fetchCart}
                className="mt-6 px-8 py-3 border-2 border-[#111111] text-[#111111] transition-colors duration-150 hover:bg-[#111111] hover:text-white"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em" }}
              >
                RETRY
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border-t border-[#ECECEC]">
              <BagIcon />
              <p style={{ fontSize: "18px", fontWeight: 500, color: "#111111", marginTop: "20px" }}>
                Your bag is empty
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666666", marginTop: "6px" }}>
                Items you add will show up here.
              </p>

              <Link
                to="/shop"
                className="mt-8 inline-block px-8 py-3 border-2 border-[#111111] text-[#111111] transition-colors duration-150 hover:bg-[#111111] hover:text-white"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em" }}
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="border-t border-[#ECECEC]">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-5 py-7 border-b border-[#ECECEC]">
                      {/* Product image — shown in full via object-contain, never cropped */}
                      <div className="w-[110px] h-[140px] flex-shrink-0 rounded-md bg-[#F6F6F6] overflow-hidden">
                        {item.imgUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.imgUrl}`}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ background: "linear-gradient(160deg,#e8e8e8,#cfcfcf)" }}
                          />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link to={`/product/${item.productId}`}>
                              <h3
                                className="hover:text-[#A749FF] cursor-pointer transition-colors"
                                style={{
                                  fontSize: "17px",
                                  fontWeight: 500,
                                  color: "#111111",
                                }}
                              >
                                {item.name}
                              </h3>
                            </Link>

                            {/* Product detail row: color swatch, size, SKU, unit price. */}
                            <div
                              className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5"
                              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666666" }}
                            >
                              {item.color && (
                                <span className="flex items-center gap-1.5">
                                  <span
                                    className="w-3 h-3 rounded-full border border-[#DDDDDD]"
                                    style={{ backgroundColor: item.swatch }}
                                  />
                                  {item.color}
                                </span>
                              )}
                              {item.size && (
                                <>
                                  {item.color && <span className="text-[#DDDDDD]">|</span>}
                                  <span>Size {item.size}</span>
                                </>
                              )}
                              {item.sku && (
                                <>
                                  <span className="text-[#DDDDDD]">|</span>
                                  <span className="text-[#999999]">SKU {item.sku}</span>
                                </>
                              )}
                            </div>

                            <div
                              className="mt-1.5 flex items-center gap-2"
                              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
                            >
                              <span style={{ color: "#666666" }}>{money(item.price)} each</span>
                              {console.log("Price:", item.price)}
                              {console.log("Compare:", item.compareAtPrice)}
                              {item.compareAtPrice > item.price && (
                                <span style={{ color: "#B5B5B5", textDecoration: "line-through" }}>
                                  {money(item.compareAtPrice)}
                                </span>
                              )}
                              {!item.inStock && (
                                <span className="text-red-600 font-semibold">❌ Out of Stock</span>
                              )}
                            </div>
                          </div>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 500, color: "#111111", whiteSpace: "nowrap" }}>
                            {money(item.price * item.qty)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {item.inStock ? (
                            <div className="flex items-center border border-[#E0E0E0] rounded-full">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                disabled={item.qty <= 1}
                                className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#111111] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon />
                              </button>

                              <span
                                className="w-6 text-center"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "#111111",
                                }}
                              >
                                {item.qty}
                              </span>

                              <button
                                onClick={() => updateQty(item.id, 1)}
                                disabled={item.stock > 0 && item.qty >= item.stock}
                                className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#111111] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon />
                              </button>
                            </div>
                          ) : (
                            <span className="text-red-500 font-medium">This item is unavailable</span>
                          )}

                          {/* Buy Now: checks out ONLY this item, not the whole cart.
                              When out of stock, offer Move to Wishlist instead. */}
                          {item.inStock ? (
                            <Link to="/checkout">
                              <button
                                onClick={() => handleCheckout(item)}
                                className="flex items-center gap-1.5 text-[#999999] hover:text-[#A749FF] transition-colors"
                                style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em" }}
                              >
                                <CartIcon /> Buy Now
                              </button>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="flex items-center gap-1.5 text-[#999999] hover:text-[#A749FF] transition-colors"
                              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em" }}
                            >
                              <CartIcon /> Move to Wishlist
                            </button>
                          )}

                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1.5 text-[#999999] hover:text-[#A749FF] transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em" }}
                          >
                            <TrashIcon /> REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/shop"
                  className="inline-block mt-6 text-[#111111] hover:text-[#A749FF] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="border border-[#ECECEC] p-7">
                  <h2 style={{ fontSize: "18px", fontWeight: 500, color: "#111111", marginBottom: "20px" }}>
                    Order Summary
                  </h2>

                  <div className="flex flex-col gap-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                    <div className="flex justify-between">
                      <span style={{ color: "#666666" }}>Subtotal</span>
                      <span style={{ color: "#111111", fontWeight: 500 }}>{money(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: "#666666" }}>Discount</span>
                        <span style={{ color: "#A749FF", fontWeight: 500 }}>−{money(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span style={{ color: "#666666" }}>Shipping</span>
                      <span style={{ color: "#111111", fontWeight: 500 }}>
                        {shipping === 0 ? "Free" : money(shipping)}
                      </span>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="mt-5">
                    <div className="flex border border-[#E0E0E0] rounded-full overflow-hidden">
                      <input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Promo code"
                        className="flex-1 px-4 py-2.5 outline-none bg-transparent"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#111111" }}
                      />
                      <button
                        onClick={applyPromo}
                        className="px-5 text-[#111111] hover:text-[#A749FF] transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}
                      >
                        APPLY
                      </button>
                    </div>
                    {promoMsg && (
                      <p
                        className="mt-2"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          color: promoMsg.ok ? "#3E8E5A" : "#C0392B",
                        }}
                      >
                        {promoMsg.text}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#ECECEC] mt-6 pt-5 flex justify-between items-baseline">
                    <span style={{ fontSize: "15px", fontWeight: 500, color: "#111111" }}>Total</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 600, color: "#111111" }}>
                      {money(total)}
                    </span>
                  </div>

                  {/* Checkout: checks out the WHOLE cart */}
                  <Link to="/checkout">
                    <button
                      className="w-full mt-6 py-3.5 bg-[#111111] text-white transition-colors duration-150 hover:bg-[#A749FF]"
                      onClick={() => handleCheckout()}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                      }}
                    >
                      CHECKOUT
                    </button>
                  </Link>

                  <p
                    className="flex items-center justify-center gap-1.5 mt-4 text-[#999999]"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
                  >
                    <LockIcon /> Secure checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <FloneFooter />
    </>
  );
} 