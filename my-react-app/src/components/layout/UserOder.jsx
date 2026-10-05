import { useState, useEffect } from "react";
import { getMyOrders } from "../../services/orderService";

const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 13H5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
  </svg>
);

const TABS = ["All", "Ordered", "Delivered"];

// ---- helpers to normalize the schema safely -------------------------
// `product` may arrive as a populated object ({ _id, name, image, ... })
// or as a bare ObjectId string if the API didn't populate it.
const getProductName = (product) =>
  (product && typeof product === "object" && product.name) || "Product unavailable";

const getProductImage = (product) => {
    if (!product || typeof product !== "object") return null;
  
    const image = product.image || product.images?.[0];
  
    if (!image) return null;
  
    // If already a full URL
    if (image.startsWith("http")) {
      return image;
    }
  
    // Add backend URL
    return `${import.meta.env.VITE_API_URL.replace("/api", "")}${image}`;
  };
const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatAddress = (addr) => {
  if (!addr) return "No shipping address on file";
  const { address, city, postalCode, country } = addr;
  return [address, city, postalCode, country].filter(Boolean).join(", ");
};

function StatusBadge({ status }) {
  const isDelivered = status === "Delivered";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
        isDelivered ? "bg-emerald-50 text-emerald-700" : "bg-[#EFE9FA] text-[#5B3F96]"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isDelivered ? "bg-emerald-600" : "bg-[#5B3F96]"}`} />
      {status}
    </span>
  );
}

function Tracker({ status }) {
  const delivered = status === "Delivered";
  return (
    <div className="px-6 pt-5 pb-1">
      <div className="flex items-center">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5B3F96]" />
          <span className="text-[11px] font-semibold text-[#432C73] mt-2">Ordered</span>
        </div>
        <div className={`flex-1 h-0.5 mx-1 -mt-4 ${delivered ? "bg-[#5B3F96]" : "bg-[#E7E2F1]"}`} />
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={`w-2.5 h-2.5 rounded-full border-2 ${
              delivered ? "bg-[#5B3F96] border-[#5B3F96]" : "bg-white border-[#E7E2F1]"
            }`}
          />
          <span className={`text-[11px] mt-2 ${delivered ? "font-semibold text-[#432C73]" : "text-gray-400"}`}>
            Delivered
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <article className="bg-white border border-[#E7E2F1] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap px-6 py-4 bg-[#FAF9FC] border-b border-[#E7E2F1]">
        <div className="flex gap-7 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">Order</div>
            <div className="text-sm font-bold font-mono">#{String(order._id).slice(-8).toUpperCase()}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">Placed on</div>
            <div className="text-sm font-semibold">{formatDate(order.createdAt)}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">Items</div>
            <div className="text-sm font-semibold">
              {order.items.length} product{order.items.length > 1 ? "s" : ""}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">Payment</div>
            <div className="text-sm font-semibold">{order.paymentMethod}</div>
          </div>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      {/* Tracker */}
      <Tracker status={order.orderStatus} />

      {/* Line items */}
      <div className="px-6 pt-3">
        {order.items.map((item, idx) => (
          <div
            key={item.product?._id || item.product || idx}
            className={`flex items-center gap-4 py-3 ${
              idx !== order.items.length - 1 ? "border-b border-[#F1EEF8]" : ""
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-[#E3DCF7] flex items-center justify-center flex-shrink-0 overflow-hidden text-[#432C73]">
              {getProductImage(item.product) ? (
                <img
                  src={getProductImage(item.product)}
                  alt={getProductName(item.product)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PackageIcon />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{getProductName(item.product)}</p>
            </div>
            <div className="text-sm text-gray-500 w-16 text-center flex-shrink-0">
  Qty {item.quantity || 1}
</div>

<div className="text-sm font-bold w-20 text-right flex-shrink-0">
  ₹{(item.price * (item.quantity || 1)).toFixed(2)}
</div>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      <div className="px-6 pt-3">
        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Shipping to</div>
        <p className="text-sm text-gray-700">{formatAddress(order.shippingAddress)}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 flex-wrap px-6 py-4 mt-2">
        <div className="text-sm text-gray-500">
          Order total <strong className="text-base text-gray-900 ml-1">₹{order.totalPrice.toFixed(2)}</strong>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-[#F0EEF7] text-gray-800 hover:bg-[#E3DCF7] hover:text-[#432C73] transition-colors">
            View invoice
          </button>
          <button className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-[#5B3F96] text-white hover:bg-[#432C73] transition-colors">
            {order.orderStatus === "Delivered" ? "Buy again" : "Track order"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMyOrders();
        
        // The backend response shape can vary depending on how the service
        // function returns it (raw axios response vs. res.data, and whether
        // it wraps the array in { orders }, { data: { orders } }, or returns
        // the array directly). Handle all of them instead of assuming one —
        // a shape mismatch here is the most common reason orders silently
        // fail to show up even though the request succeeded.
        const list =
          Array.isArray(data) ? data :
          Array.isArray(data?.orders) ? data.orders :
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data?.data?.orders) ? data.data.orders :
          null;

        if (list === null) {
          console.warn(
            "getMyOrders() response didn't match any expected shape. Raw response:",
            data
          );
        }

        if (!cancelled) setOrders(list || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (!cancelled) setError(err.response?.data?.message || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.orderStatus === activeTab;
    const matchesQuery =
      query.trim() === "" ||
      String(order._id).toLowerCase().includes(query.toLowerCase()) ||
      order.items.some((item) => getProductName(item.product).toLowerCase().includes(query.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  const countFor = (tab) =>
    tab === "All" ? orders.length : orders.filter((o) => o.orderStatus === tab).length;

  return (
    <div className="min-h-screen bg-[#FBFAF8] font-sans">
      {/* Page header */}
      <section className="bg-[#E3DCF7] px-6 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-xs font-semibold text-[#432C73]/75 mb-2">
              Account <span className="opacity-50 mx-1.5">/</span> Order History
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Orders</h1>
            <p className="text-sm text-[#432C73]/75 mt-2">Track shipments and review past purchases.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#C9BBEF] rounded-full px-4 py-2.5 min-w-[260px]">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order number or product"
              className="text-sm outline-none flex-1 bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-9 pb-20">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#E7E2F1] mb-7 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#5B3F96] text-[#432C73]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
              <span
                className={`ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === tab ? "bg-[#E3DCF7] text-[#432C73]" : "bg-gray-100 text-gray-500"
                }`}
              >
                {countFor(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* States: loading / error / empty / list */}
        {loading && (
          <div className="flex flex-col gap-5">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 rounded-2xl bg-white border border-[#E7E2F1] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-sm text-red-600 font-medium mb-1">Couldn't load your orders.</p>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-5">
            {filtered.length > 0 ? (
              filtered.map((order) => <OrderCard key={order._id} order={order} />)
            ) : (
              <div className="text-center py-16 text-gray-500 text-sm">
                {orders.length === 0 ? "You haven't placed any orders yet." : "No orders match your search."}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}