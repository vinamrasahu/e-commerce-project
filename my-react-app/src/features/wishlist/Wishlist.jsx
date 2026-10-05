import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHeart, IoHeartOutline, IoBagAddOutline, IoCheckmark, IoNotificationsOutline } from "react-icons/io5";
import { getLikes, removeLike } from "../../services/likeService";
import { addToCart } from "../../services/cartService";
import FloneNavbar from "../../components/layout/Navbar";
import FloneFooter from "../../components/layout/Footer/Footer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
const money = (n) => `₹${Number(n || 0).toFixed(2)}`;
import { createNotification } from "../notification/notificationThunk";
/**
 * Normalizes a liked-item record from the API. Backends differ in
 * whether product info lives nested under `product` or flattened onto
 * the record itself — this handles both. Adjust field names to match
 * your actual `getLikes()` response if they differ.
 */
const normalizeItem = (raw) => {
  // Your API returns the product fields flat on the item itself (no nested
  // `product`/`productId` object) — fall back to `raw` so stock, name,
  // price etc. are actually found instead of silently reading from {}.
  const product = raw.product || raw.productId || raw;
  const rawImgUrl = raw.image || product.image || product.thumbnail || null;
  // Some images come back without a leading slash (e.g. "uploads/x.jpg"),
  // which breaks `${host}${imgUrl}` concatenation — normalize it here.
  const imgUrl = rawImgUrl ? (rawImgUrl.startsWith("/") ? rawImgUrl : `/${rawImgUrl}`) : null;
  return {
    id: raw._id || raw.id || product._id || product.id,
    productId: product._id || product.id || raw.productId || raw._id || raw.id,
    name: raw.name || product.name || product.title || "Untitled item",
    color: raw.color || product.color || null,
    size: raw.size || product.size || null,
    swatch: raw.swatch || product.swatch || "#E5E5E5",
    price: Number(raw.price ?? product.price ?? 0),
    compareAtPrice: Number(raw.compareAtPrice ?? product.compareAtPrice ?? 0) || null,
    stock: product.stock,
inStock: product.stock > 0,
    imgUrl,
  };
};

export default function WishlistPage() {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movingId, setMovingId] = useState(null);
  const [movedIds, setMovedIds] = useState(new Set());
  const [notifyingId, setNotifyingId] = useState(null);
  const [notifiedIds, setNotifiedIds] = useState(new Set());

  useEffect(() => {
    if (document.getElementById("jost-font-link")) return;
    const link = document.createElement("link");
    link.id = "jost-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLikes();
      const raw = res?.data?.products || [];
      setItems(Array.isArray(raw) ? raw.map(normalizeItem) : []);
    } catch (err) {
      console.error(err);
      setError("We couldn't load your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item) => {
    const prevItems = items;
    setItems((prev) => prev.filter((it) => it.id !== item.id));
    try {
      await removeLike(item.productId);
    } catch (err) {
      console.error(err);
      // Roll back on failure
      setItems(prevItems);
    }
  };

  const moveToBag = async (item) => {
    setMovingId(item.id);
    try {
      await addToCart({ productId: item.productId, qty: 1 });
      setMovedIds((prev) => new Set(prev).add(item.id));
      // Give the "Added" confirmation a moment on screen, then drop it
      // from the wishlist.
      setTimeout(async () => {
        setItems((prev) => prev.filter((it) => it.id !== item.id));
        try {
          await removeLike(item.productId);
        } catch (err) {
          console.error(err);
        }
      }, 900);
    } catch (err) {
      console.error(err);
    } finally {
      setMovingId(null);
    }
  };

  // Out-of-stock items don't leave the wishlist anymore — they just get
  // flagged for a back-in-stock alert. The full list of these lives on
  // the dedicated Waitlist page.
  const handleAddToWaitlist = async (item) => {
    setNotifyingId(item.id);
    try {
      await dispatch(createNotification(item.productId)).unwrap();
      setNotifiedIds((prev) => new Set(prev).add(item.id));
      toast.success("Added to your waitlist — we'll email you when it's back");
    } catch (err) {
      console.error(err);
      toast.error(typeof err === "string" ? err : "Something went wrong");
    } finally {
      setNotifyingId(null);
    }
  };

  const outOfStockCount = items.filter((it) => !it.inStock).length;

  return (
    <>
<FloneNavbar/>
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Jost', 'Inter', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-14 pb-24">
        {/* Header */}
        <div className="mb-10">
          <p
            className="uppercase text-[#666666] mb-2"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em" }}
          >
            Saved For Later
          </p>
          <h1 style={{ fontSize: "40px", fontWeight: 300, letterSpacing: "-1px", color: "#111111", lineHeight: 1.1 }}>
            Your Wishlist
            {!loading && items.length > 0 && (
              <span style={{ fontSize: "18px", fontWeight: 400, color: "#999999", marginLeft: "12px" }}>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </h1>
          {!loading && outOfStockCount > 0 && (
            <Link
              to="/waitlist"
              className="inline-block mt-3 text-[#111111] hover:text-[#A749FF] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              View your Waitlist ({outOfStockCount}) →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-24 text-center border-t border-[#ECECEC]">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666666" }}>Loading your wishlist…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-t border-[#ECECEC]">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#C0392B" }}>{error}</p>
            <button
              onClick={fetchWishlist}
              className="mt-6 px-8 py-3 border-2 border-[#111111] text-[#111111] transition-colors duration-150 hover:bg-[#111111] hover:text-white"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em" }}
            >
              RETRY
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-t border-[#ECECEC]">
            <IoHeartOutline className="w-[46px] h-[46px] text-[#CFCFCF]" />
            <p style={{ fontSize: "18px", fontWeight: 500, color: "#111111", marginTop: "20px" }}>
              Your wishlist is empty
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666666", marginTop: "6px" }}>
              Save items you love and they'll show up here.
            </p>
            <Link
              to="/shop"
              className="mt-8 px-8 py-3 border-2 border-[#111111] text-[#111111] transition-colors duration-150 hover:bg-[#111111] hover:text-white"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em" }}
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          // Single column — one product per row, full-width card.
          <div className="border-t border-[#ECECEC] flex flex-col">
            {items.map((item) => {
              const justMoved = movedIds.has(item.id);
              const isNotified = notifiedIds.has(item.id);
              return (
                <div key={item.id} className="flex gap-6 py-7 border-b border-[#ECECEC]">
                  {/* Product image, shown in full via object-contain */}
                  <div className="relative w-[140px] h-[175px] flex-shrink-0 rounded-md bg-[#F6F6F6] overflow-hidden">
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
                    <button
                      onClick={() => removeItem(item)}
                      aria-label="Remove from wishlist"
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-[#A749FF] hover:bg-white transition-colors shadow-sm"
                    >
                      <IoHeart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 style={{ fontSize: "19px", fontWeight: 500, color: "#111111" }}>{item.name}</h3>

                        <div
                          className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5"
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
                        </div>

                        {!item.inStock && (
                          <p
                            className="mt-2"
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#C0392B", fontWeight: 500 }}
                          >
                            Out of stock
                          </p>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-2 flex-shrink-0"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                      >
                        <span style={{ color: "#111111", fontWeight: 500 }}>{money(item.price)}</span>
                        {item.compareAtPrice > item.price && (
                          <span style={{ color: "#B5B5B5", textDecoration: "line-through" }}>
                            {money(item.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 gap-3">
                    {item.inStock ? (
                      <button
                        onClick={() => moveToBag(item)}
                        disabled={movingId === item.id || justMoved}
                        className="flex items-center gap-1.5 px-8 py-2.5 rounded-full bg-[#111111] text-white transition-colors duration-150 hover:bg-[#A749FF] disabled:opacity-60"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em" }}
                      >
                        {justMoved ? (
                          <>
                            <IoCheckmark className="w-4 h-4" /> ADDED
                          </>
                        ) : (
                          <>
                            <IoBagAddOutline className="w-4 h-4" />
                            {movingId === item.id ? "MOVING…" : "MOVE TO BAG"}
                          </>
                        )}
                      </button>
                    ) : isNotified ? (
                      <span
                        className="flex items-center gap-1.5 px-8 py-2.5 rounded-full border-2 border-[#3E8E5A] text-[#3E8E5A]"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em" }}
                      >
                        <IoCheckmark className="w-4 h-4" /> ON WAITLIST
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToWaitlist(item)}
                        disabled={notifyingId === item.id}
                        className="flex items-center gap-1.5 px-8 py-2.5 rounded-full border-2 border-[#111111] text-[#111111] transition-colors duration-150 hover:bg-[#111111] hover:text-white disabled:opacity-60"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em" }}
                      >
                        <IoNotificationsOutline className="w-4 h-4" />
                        {notifyingId === item.id ? "SAVING…" : "ADD TO WAITLIST"}
                      </button>
                    )}

                      <button
                        onClick={() => removeItem(item)}
                        className="text-[#999999] hover:text-[#A749FF] transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em" }}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    <FloneFooter/>
    </>
  );
}