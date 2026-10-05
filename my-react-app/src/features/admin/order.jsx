import { useState, useEffect } from "react";
import { getOrders } from "../../services/orderService";

const colors = {
  plum: "#3b2a3a",
  navy: "#151875",
  lavender: "#e7defa",
  paper: "#fbfaf9",
  line: "#e6e3e8",
  ink: "#1c1c22",
  muted: "#78737f",
  ok: "#1f9254",
  warn: "#b7791f",
  danger: "#c0392b",
};

const STATUS_COLORS = {
  Pending: colors.warn,
  Shipped: colors.navy,
  Delivered: colors.ok,
  Cancelled: colors.danger,
};

const fmt = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`;
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return (
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
};

/**
 * Normalizes a raw order record from the backend into the flat shape this
 * page renders. This is based on the payload your CheckoutPage sends:
 *   { items: [{ product, quantity, price, size, color }], shippingAddress: {...},
 *     totalPrice, paymentMethod }
 * plus whatever Mongo/Express adds: _id, createdAt, status, user.
 *
 * ADJUST THE FIELD NAMES BELOW if your actual API response differs —
 * console.log the raw response (already done in the effect below) and
 * compare against this function.
 */
const normalizeOrder = (raw) => {
  const shipping = raw.shippingAddress || {};
  const user = raw.user || {};

  const userName =
    raw.userName ||
    [shipping.firstName, shipping.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "Unknown customer";

  const items = (raw.items || []).map((item, idx) => {
    // `product` may be a populated object or just an ObjectId string
    const product = typeof item.product === "object" && item.product !== null ? item.product : {};
    return {
      id: item._id || product._id || String(idx),
      name: item.name || product.name || product.title || "Item",
      qty: item.quantity ?? item.qty ?? 1,
      price: Number(item.price ?? product.price ?? 0),
      size: item.size || null,
      color: item.color || null,
    };
  });

  return {
    id: raw._id || raw.id,
    userName,
    email: shipping.email || user.email || "—",
    phone: shipping.phone || user.phone || "—",
    status: raw.status || raw.orderStatus || "Pending",
    total: Number(raw.totalPrice ?? raw.total ?? 0),
    placedAt: raw.createdAt || raw.placedAt,
    paymentMethod: raw.paymentMethod || "—",
    address: {
      line1: shipping.address || "—",
      city: shipping.city || "",
      state: shipping.state || "",
      pincode: shipping.pincode || "",
    },
    items,
  };
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || colors.muted;
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: c,
        background: `${c}17`,
        padding: "4px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const selectedOrder = orders.find((o) => o.id === selectedId) || null;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const res = await getOrders();

      // Handle whichever shape your API wraps the list in
      const raw = res?.data?.orders || res?.data || res?.orders || res || [];
      const list = Array.isArray(raw) ? raw : [];

      console.log("Raw orders from backend:", list);
      setOrders(list.map(normalizeOrder));
    } catch (err) {
      console.error(err);
      setError("We couldn't load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: colors.paper, color: colors.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
        {!selectedOrder ? (
          <>
            {/* ---- List view ---- */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                Orders
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
                {loading ? "Loading…" : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
              </h1>
            </div>

            <div style={{ border: `1px solid ${colors.line}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: colors.muted, fontSize: 14 }}>
                  Loading orders…
                </div>
              ) : error ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ color: colors.danger, fontSize: 14, marginBottom: 14 }}>{error}</div>
                  <button
                    onClick={fetchOrders}
                    style={{
                      border: `1.5px solid ${colors.navy}`,
                      color: colors.navy,
                      background: "transparent",
                      borderRadius: 8,
                      padding: "8px 18px",
                      fontWeight: 700,
                      fontSize: 12.5,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    RETRY
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: colors.muted, fontSize: 14 }}>
                  No orders yet.
                </div>
              ) : (
                orders.map((order, idx) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "18px 20px",
                      border: "none",
                      borderTop: idx === 0 ? "none" : `1px solid ${colors.line}`,
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = colors.lavender)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: colors.ink }}>{order.userName}</div>
                      <div style={{ fontSize: 12.5, color: colors.muted, marginTop: 3 }}>
                        {order.id} · {fmtDate(order.placedAt)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                      <StatusBadge status={order.status} />
                      <div style={{ fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: "right" }}>{fmt(order.total)}</div>
                      <span style={{ color: colors.muted, fontSize: 18 }}>›</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* ---- Detail view ---- */}
            <button
              onClick={() => setSelectedId(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "none",
                background: "transparent",
                color: colors.navy,
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
                padding: 0,
                marginBottom: 24,
                fontFamily: "inherit",
              }}
            >
              ← Back to all orders
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>{selectedOrder.id}</h1>
                <div style={{ fontSize: 13, color: colors.muted, marginTop: 6 }}>{fmtDate(selectedOrder.placedAt)}</div>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }} className="detail-grid">
              <div style={{ border: `1px solid ${colors.line}`, borderRadius: 12, padding: 20, background: "#fff" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  Customer
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedOrder.userName}</div>
                <div style={{ fontSize: 13.5, color: colors.muted, marginTop: 6 }}>{selectedOrder.email}</div>
                <div style={{ fontSize: 13.5, color: colors.muted, marginTop: 2 }}>{selectedOrder.phone}</div>
              </div>

              <div style={{ border: `1px solid ${colors.line}`, borderRadius: 12, padding: 20, background: "#fff" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  Shipping address
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  {selectedOrder.address.line1}
                  <br />
                  {selectedOrder.address.city}
                  {selectedOrder.address.city && selectedOrder.address.state ? ", " : ""}
                  {selectedOrder.address.state}
                  <br />
                  {selectedOrder.address.pincode}
                </div>
              </div>
            </div>

            <div style={{ border: `1px solid ${colors.line}`, borderRadius: 12, background: "#fff", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.line}`, fontSize: 12, fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Items
              </div>
              {selectedOrder.items.length === 0 ? (
                <div style={{ padding: 20, color: colors.muted, fontSize: 13.5 }}>No item details available.</div>
              ) : (
                selectedOrder.items.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderTop: idx === 0 ? "none" : `1px solid ${colors.line}`,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{item.name}</div>
                      <div style={{ fontSize: 12.5, color: colors.muted, marginTop: 3 }}>
                        Qty {item.qty}
                        {item.size ? ` · Size ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{fmt(item.price * item.qty)}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ border: `1px solid ${colors.line}`, borderRadius: 12, padding: 20, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13.5, color: colors.muted }}>Paid via {selectedOrder.paymentMethod}</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{fmt(selectedOrder.total)}</div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}