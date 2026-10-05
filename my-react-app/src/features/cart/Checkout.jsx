import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import FloneNavbar from "../../components/layout/Navbar";
import { createOrder } from "../../services/orderService";
// NOTE: adjust this import path to match wherever your cart slice actually lives


const colors = {
  plum: "#3b2a3a",
  navy: "#151875",
  lavender: "#e7defa",
  lavenderDeep: "#d9caf3",
  paper: "#fbfaf9",
  line: "#e6e3e8",
  ink: "#1c1c22",
  muted: "#78737f",
  ok: "#1f9254",
};

// Field is now a controlled input: it forwards name/value/onChange to the
// actual <input>, which was the main reason typed data never reached state.
function Field({ label, id, name, type = "text", placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 12.5,
          fontWeight: 600,
          color: colors.muted,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 14.5,
          border: `1.5px solid ${colors.line}`,
          borderRadius: 8,
          background: "#fff",
          color: colors.ink,
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = colors.navy)}
        onBlur={(e) => (e.target.style.borderColor = colors.line)}
      />
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2
      style={{
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 700,
        color: colors.muted,
        margin: "0 0 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {children}
      <span style={{ flex: 1, height: 1, background: colors.line }} />
    </h2>
  );
}

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", sub: "Pay with cash when your order arrives" },
  { id: "upi", label: "UPI", sub: "Pay instantly via any UPI app" },
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay accepted" },
];

const REQUIRED_FIELDS = [
  ["email", "Email"],
  ["firstName", "First name"],
  ["lastName", "Last name"],
  ["phone", "Phone"],
  ["address", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["pincode", "Pincode"],
];

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  const order = useSelector((state) => state.order.order);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const items = order?.items ?? [];
  const summary = order?.summary ?? { subtotal: 0, shipping: 0, discount: 0, total: 0 };
  const { subtotal = 0, shipping = 0, discount = 0, total = 0 } = summary;

  const fmt = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear the error for this field as the user fixes it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach(([key, label]) => {
      if (!form[key] || !form[key].trim()) {
        newErrors[key] = `${label} is required`;
      }
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (form.pincode && !/^\d{4,10}$/.test(form.pincode)) {
      newErrors.pincode = "Enter a valid pincode";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return; // guard against double submits

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setIsPlacingOrder(true);
    try {
     
      const orderItems = cartItems.map((item) => ({
        product: item.productId || item.product?._id || item.product || item._id,
        quantity: item.qty || item.quantity || 1,
        price: item.price,
        size: item.size,
        color: item.color || null,
      }));
      
      console.log(orderItems);
      console.log("===== ORDER ITEMS =====");
      console.log(JSON.stringify(orderItems, null, 2));
      
      const orderData = {
        items: orderItems,
        shippingAddress: form,
        totalPrice: total,
        paymentMethod: selectedPayment,
      };
      await createOrder(orderData, token);

      // dispatch(clearCart());
      console.log("Token:", token);
      console.log("Cart Items:", cartItems);
      console.log("Order Items:", orderItems);
      console.log("Shipping Address:", form);
      console.log("Order Data:", orderData);
  
    
      alert("Order placed successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: colors.paper, color: colors.ink, minHeight: "100%" }}>
      <div style={{ height: 8, background: colors.plum }} />

      <FloneNavbar />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 48,
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 56,
        }}
        className="checkout-grid"
      >
        <div>
          <section style={{ marginBottom: 40 }}>
            <SectionHeading>Contact</SectionHeading>
            <Field
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.email}</div>}
          </section>

          <section style={{ marginBottom: 40 }}>
            <SectionHeading>Shipping address</SectionHeading>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Field label="First name" id="fname" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
                {errors.firstName && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.firstName}</div>}
              </div>
              <div>
                <Field label="Last name" id="lname" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
                {errors.lastName && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.lastName}</div>}
              </div>
            </div>

            <Field label="Phone" id="phone" name="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} />
            {errors.phone && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.phone}</div>}

            <Field label="Address" id="address" name="address" placeholder="House no., street, area" value={form.address} onChange={handleChange} />
            {errors.address && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.address}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Field label="City" id="city" name="city" placeholder="City" value={form.city} onChange={handleChange} />
                {errors.city && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.city}</div>}
              </div>
              <div>
                <Field label="State" id="state" name="state" placeholder="State" value={form.state} onChange={handleChange} />
                {errors.state && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.state}</div>}
              </div>
            </div>

            <Field label="Pincode" id="pincode" name="pincode" placeholder="000000" value={form.pincode} onChange={handleChange} />
            {errors.pincode && <div style={{ color: "crimson", fontSize: 12, marginTop: -10, marginBottom: 12 }}>{errors.pincode}</div>}
          </section>

          <section style={{ marginBottom: 40 }}>
            <SectionHeading>Payment method</SectionHeading>
            {paymentMethods.map((method) => {
              const selected = selectedPayment === method.id;
              return (
                <label
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    border: `1.5px solid ${selected ? colors.navy : colors.line}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    marginBottom: 10,
                    cursor: "pointer",
                    background: selected ? "#f7f5fd" : "#fff",
                    transition: "border-color .15s, background .15s",
                  }}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={selected}
                    onChange={() => setSelectedPayment(method.id)}
                    style={{ accentColor: colors.navy, width: 16, height: 16 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{method.label}</div>
                    <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{method.sub}</div>
                  </div>
                </label>
              );
            })}
          </section>
        </div>

        <div>
          <div
            style={{
              background: colors.lavender,
              borderRadius: 16,
              padding: "28px 26px",
              position: "sticky",
              top: 24,
            }}
          >
            <h2
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: colors.plum,
                margin: "0 0 20px",
              }}
            >
              Order summary
            </h2>

            {items.length === 0 && (
              <div style={{ fontSize: 13.5, color: colors.muted, padding: "8px 0 16px" }}>Your cart is empty.</div>
            )}

            {items.map((item, idx) => {
              const qty = item.qty ?? item.quantity ?? 1;
              const unitPrice = item.price ?? item.unitPrice ?? 0;
              const lineTotal = item.lineTotal ?? unitPrice * qty;
              return (
                <div
                  key={item.id ?? idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(59,42,58,0.12)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: colors.muted, marginTop: 3 }}>Qty {qty}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap" }}>{fmt(lineTotal)}</div>
                </div>
              );
            })}

            <div style={{ paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.muted, padding: "6px 0" }}>
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.muted, padding: "6px 0" }}>
                  <span>Discount</span>
                  <span style={{ color: colors.ok, fontWeight: 600 }}>-{fmt(discount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: colors.muted, padding: "6px 0" }}>
                <span>Shipping</span>
                <span style={{ color: colors.ok, fontWeight: 600 }}>{shipping === 0 ? "Free" : fmt(shipping)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: colors.ink,
                  fontWeight: 800,
                  fontSize: 18,
                  borderTop: "1.5px solid rgba(59,42,58,0.18)",
                  marginTop: 8,
                  paddingTop: 14,
                }}
              >
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              style={{
                width: "100%",
                marginTop: 22,
                padding: 16,
                border: "none",
                borderRadius: 10,
                background: isPlacingOrder ? colors.muted : colors.navy,
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.01em",
                cursor: isPlacingOrder ? "not-allowed" : "pointer",
              }}
              onMouseDown={(e) => !isPlacingOrder && (e.currentTarget.style.transform = "scale(0.985)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isPlacingOrder ? "Placing order..." : "Place order"}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                marginTop: 14,
                fontSize: 12,
                color: colors.plum,
                opacity: 0.8,
                fontWeight: 500,
              }}
            >
              <Lock size={13} strokeWidth={2} />
              Secure checkout
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            padding: 24px 20px !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}