import { useState } from "react";
import { createProduct } from "../../services/productService";
import { Plus, X } from "lucide-react";
/* ============================================================
   ICONS  (inline SVG, no external deps)
   ============================================================ */
const Icon = {
  dashboard: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  products: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  ),
  blog: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-8h-6M7 9h1m-1 4h4" />
    </svg>
  ),
  slider: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path strokeLinecap="round" d="M8 12h8M5 9l-2 3 2 3M19 9l2 3-2 3" />
    </svg>
  ),
  orders: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  ),
  upload: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  trending: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  dollar: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  users: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  bag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  arrowUp: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  x: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  slideshow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="13" rx="2" /><path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
};

/* ============================================================
   BADGE COMPONENT
   ============================================================ */
const Badge = ({ variant = "green", children }) => {
  const variants = {
    green: "bg-green-50 text-green-700 border border-green-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    red: "bg-red-50 text-red-700 border border-red-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

/* ============================================================
   TOGGLE SWITCH
   ============================================================ */
const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[#7b3fe4]" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

/* ============================================================
   UPLOAD BOX
   ============================================================ */
const UploadBox = ({ label, sub }) => (
  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7b3fe4] hover:bg-purple-50/40 transition-all group">
    <span className="text-gray-300 group-hover:text-[#7b3fe4] transition-colors">{Icon.upload}</span>
    <p className="text-sm font-medium text-gray-500 group-hover:text-[#7b3fe4]">{label}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);

/* ============================================================
   STAT CARD
   ============================================================ */
const StatCard = ({ icon, label, value, sub, up }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#7b3fe4]">{icon}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
    <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? Icon.arrowUp : Icon.arrowDown}
      <span>{sub}</span>
    </div>
  </div>
);

/* ============================================================
   FORM FIELD
   ============================================================ */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-all"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-all appearance-none"
  >
    {children}
  </select>
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-all resize-none"
  />
);

/* ============================================================
   SECTION CARD
   ============================================================ */
const Card = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-5 ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
        <span className="text-[#7b3fe4]">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

/* ============================================================
   TABLE WRAPPER
   ============================================================ */
const Table = ({ heads, rows }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-100">
          {heads.map((h) => (
            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-gray-700 align-middle">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ============================================================
   NAV ITEM
   ============================================================ */
const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
      active
        ? "bg-[#7b3fe4] text-white shadow-md shadow-purple-200"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <span className={`flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
      {icon}
    </span>
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
        {badge}
      </span>
    )}
  </button>
);

/* ============================================================
   PANELS
   ============================================================ */

/* --- DASHBOARD --- */
const DashboardPanel = ({ setActive }) => {
  const products = [
    ["#5041", "Emma W.", <Badge variant="green">Delivered</Badge>, "$124", "Jun 23"],
    ["#5040", "James K.", <Badge variant="amber">Shipping</Badge>, "$89", "Jun 22"],
    ["#5039", "Priya S.", <Badge variant="blue">Processing</Badge>, "$210", "Jun 22"],
    ["#5038", "Luca M.", <Badge variant="red">Cancelled</Badge>, "$55", "Jun 21"],
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Icon.bag} label="Total orders" value="1,284" sub="12% this month" up />
        <StatCard icon={Icon.dollar} label="Revenue" value="$48,320" sub="8.4% this month" up />
        <StatCard icon={Icon.products} label="Products" value="96" sub="4 added this week" up />
        <StatCard icon={Icon.users} label="Customers" value="3,741" sub="2% this week" up={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Recent orders</h2>
            <button onClick={() => setActive("orders")} className="text-xs text-[#7b3fe4] hover:underline font-medium">View all →</button>
          </div>
          <Table
            heads={["Order", "Customer", "Status", "Amount", "Date"]}
            rows={products}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Recent activity</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {[
              { icon: Icon.plus, bg: "bg-purple-50 text-[#7b3fe4]", text: <><span className="font-medium">Crew coat</span> added to catalog</>, time: "2 min ago" },
              { icon: Icon.orders, bg: "bg-green-50 text-green-600", text: <>Order <span className="font-medium">#5041</span> marked delivered</>, time: "14 min ago" },
              { icon: Icon.blog, bg: "bg-amber-50 text-amber-600", text: <><span className="font-medium">"Style guide"</span> post published</>, time: "1 hr ago" },
              { icon: Icon.slider, bg: "bg-blue-50 text-blue-600", text: <>Summer slider <span className="font-medium">updated</span></>, time: "3 hr ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-gray-50/60 transition-colors">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${a.bg}`}>{a.icon}</span>
                <div>
                  <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- PRODUCTS LIST --- */
const ProductsPanel = ({ setActive }) => {
  const rows = [
    [
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">🧥</div>
        <div><p className="font-medium text-gray-800 text-sm">Crew ventile coat</p><p className="text-xs text-gray-400">Men / Jackets</p></div>
      </div>,
      "Men", "$50.00", "24", <Badge variant="green">Active</Badge>,
      <div className="flex gap-2">
        <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button>
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button>
      </div>
    ],
    [
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">🧣</div>
        <div><p className="font-medium text-gray-800 text-sm">Trench winter coat</p><p className="text-xs text-gray-400">Women / Coats</p></div>
      </div>,
      "Women",
      <span><span className="text-[#7b3fe4] font-semibold">$30.00</span> <span className="line-through text-gray-400 text-xs">$60</span></span>,
      "8", <Badge variant="amber">Sale</Badge>,
      <div className="flex gap-2">
        <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button>
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button>
      </div>
    ],
    [
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">👗</div>
        <div><p className="font-medium text-gray-800 text-sm">Summer linen dress</p><p className="text-xs text-gray-400">Women / Dresses</p></div>
      </div>,
      "Women", "$75.00", "0", <Badge variant="red">Out of stock</Badge>,
      <div className="flex gap-2">
        <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button>
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button>
      </div>
    ],
    [
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">👕</div>
        <div><p className="font-medium text-gray-800 text-sm">Classic oxford shirt</p><p className="text-xs text-gray-400">Men / Shirts</p></div>
      </div>,
      "Men", "$45.00", "32", <Badge variant="green">Active</Badge>,
      <div className="flex gap-2">
        <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button>
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button>
      </div>
    ],
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">All products (96)</h2>
        <button onClick={() => setActive("add-product")} className="flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors">
          {Icon.plus} Add product
        </button>
      </div>
      <Table heads={["Product", "Category", "Price", "Stock", "Status", "Actions"]} rows={rows} />
    </div>
  );
};

/* --- ADD PRODUCT --- */
const AddProductPanel = () => {
  // Visibility
  const [published, setPublished] = useState(true); // -> isActive
  const [featured, setFeatured] = useState(false); // -> isFeatured
 
  // Basic info
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState(""); // comma-separated -> tags[]
  const [description, setDescription] = useState("");
 
  // Pricing & stock
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
 
  // Images — these hold raw File objects from <input type="file">
  const [image, setImage] = useState(null); // main image (required in schema)
  const [hoverImage, setHoverImage] = useState(null); // optional second image
  const [galleryImages, setGalleryImages] = useState([]); // images[]
 
  const [uploading, setUploading] = useState(false);
 
  // Variants
  const [sizes, setSizes] = useState(""); // comma-separated -> sizes[]
  const [colors, setColors] = useState([{ label: "", hex: "" }]); // -> colors[]
  const [badges, setBadges] = useState([{ label: "", type: "" }]); // -> badges[]
 
  const updateColor = (index, field, value) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };
 
  const addColor = () => setColors((prev) => [...prev, { label: "", hex: "" }]);
 
  const removeColor = (index) =>
    setColors((prev) => prev.filter((_, i) => i !== index));
 
  const updateBadge = (index, field, value) => {
    setBadges((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };
 
  const addBadge = () => setBadges((prev) => [...prev, { label: "", type: "" }]);
 
  const removeBadge = (index) =>
    setBadges((prev) => prev.filter((_, i) => i !== index));
 
  // ---- Image upload helpers -------------------------------------------
  // These send the actual File to the backend, which saves it into
  // /public/uploads and returns the path string, e.g. "/uploads/169...jpg".
  // That string is what gets stored on the Product document (schema expects String).
 
  const uploadFile = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.path; // e.g. "/uploads/169999-photo.jpg"
  };
 
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return [];
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await axios.post("/api/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.paths; // e.g. ["/uploads/a.jpg", "/uploads/b.jpg"]
  };
 
  // ---- Payload + submit -------------------------------------------------
 
  const buildPayload = (status, imagePath, hoverImagePath, galleryPaths) => ({
    name,
    description,
    price: Number(price) || 0,
    salePrice: salePrice === "" ? null : Number(salePrice),
    image: imagePath, // string path, not the File object
    hoverImage: hoverImagePath || "",
    images: galleryPaths,
    category,
    colors: colors
      .filter((c) => c.label || c.hex)
      .map((c) => ({
        value: c.label.toLowerCase().replace(/\s+/g, "-"),
        label: c.label,
        hex: c.hex,
      })),
    sizes: sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    badges: badges.filter((b) => b.label || b.type),
    tags: tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    stock: Number(stock) || 0,
    isFeatured: featured,
    isActive: status === "publish" ? published : false,
  });
 
  const handleSubmit = async (status) => {
    if (!image) {
      console.log("Main image is required");
      return;
    }
 
    try {
      setUploading(true);
 
      // 1. Upload files first, get back string paths
      const imagePath = await uploadFile(image);
      const hoverImagePath = await uploadFile(hoverImage);
      const galleryPaths = await uploadFiles(galleryImages);
 
      // 2. Build the payload using those string paths (not File objects)
      const payload = buildPayload(status, imagePath, hoverImagePath, galleryPaths);
 
      console.log(payload);
 
      // 3. Send the product to your API
      const res = await createProduct(payload);
 
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };
 
  return (
    <div className="space-y-4">
      <Card title="Basic information" icon={Icon.products}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Product name">
            <Input
              type="text"
              placeholder="e.g. Crew ventile coat one"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
              <option>Accessories</option>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Tags">
            <Input
              type="text"
              placeholder="e.g. jacket, winter, fashion"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Description">
          <Textarea
            rows={3}
            placeholder="Write a short product description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </Card>
 
      <Card title="Pricing & stock" icon={Icon.dollar}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Regular price (₹)">
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>
          <Field label="Sale price (₹)">
            <Input
              type="number"
              placeholder="0.00"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </Field>
          <Field label="Stock qty">
            <Input
              type="number"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Field>
        </div>
      </Card>
 
      <Card title="Variants" icon={Icon.trending}>
        <Field label="Available sizes">
          <Input
            type="text"
            placeholder="e.g. S, M, L, XL"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
          />
        </Field>
 
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Colors</span>
            <button
              type="button"
              onClick={addColor}
              className="flex items-center gap-1 text-sm text-[#7b3fe4] hover:text-[#6830c8] font-medium"
            >
              <Plus size={14} /> Add color
            </button>
          </div>
          <div className="space-y-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Name e.g. Black"
                  value={c.label}
                  onChange={(e) => updateColor(i, "label", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder="#2b2b2b"
                  value={c.hex}
                  onChange={(e) => updateColor(i, "hex", e.target.value)}
                  className="w-32"
                />
                {c.hex && (
                  <span
                    className="w-8 h-8 rounded-lg border border-gray-200 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="p-2 text-gray-400 hover:text-red-500 shrink-0"
                  aria-label="Remove color"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
 
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Badges</span>
            <button
              type="button"
              onClick={addBadge}
              className="flex items-center gap-1 text-sm text-[#7b3fe4] hover:text-[#6830c8] font-medium"
            >
              <Plus size={14} /> Add badge
            </button>
          </div>
          <div className="space-y-2">
            {badges.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Label e.g. New"
                  value={b.label}
                  onChange={(e) => updateBadge(i, "label", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder="Type e.g. success"
                  value={b.type}
                  onChange={(e) => updateBadge(i, "type", e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeBadge(i)}
                  className="p-2 text-gray-400 hover:text-red-500 shrink-0"
                  aria-label="Remove badge"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
 
      <Card title="Product images" icon={Icon.upload}>
        <div className="grid grid-cols-2 gap-4">
          <UploadBox
            label="Main image"
            sub="Click to upload"
            onChange={(file) => setImage(file)}
          />
          <UploadBox
            label="Hover image"
            sub="Shown on card hover"
            onChange={(file) => setHoverImage(file)}
          />
        </div>
        <div className="mt-4">
          <UploadBox
            label="Gallery images"
            sub="Upload up to 5"
            multiple
            onChange={(files) => setGalleryImages(files)}
          />
        </div>
      </Card>
 
      <Card title="Visibility" icon={Icon.eye}>
        <div className="space-y-4 mb-5">
          <Toggle
            checked={published}
            onChange={setPublished}
            label="Published — visible in storefront"
          />
          <Toggle
            checked={featured}
            onChange={setFeatured}
            label="Featured — show on homepage"
          />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button
            type="button"
            disabled={uploading}
            onClick={() => handleSubmit("draft")}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => handleSubmit("publish")}
            className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Publish product"}
          </button>
        </div>
      </Card>
    </div>
  );
};

/* --- BLOG LIST --- */
const BlogsPanel = ({ setActive }) => {
  const rows = [
    ["Style guide for winter 2026", "Admin", <Badge variant="purple">Fashion</Badge>, "Jun 20", <Badge variant="green">Published</Badge>,
      <div className="flex gap-2"><button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button><button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button></div>],
    ["How to layer clothes properly", "Admin", <Badge variant="blue">Lifestyle</Badge>, "Jun 14", <Badge variant="amber">Draft</Badge>,
      <div className="flex gap-2"><button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button><button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button></div>],
    ["Top 5 coats this season", "Admin", <Badge variant="purple">Fashion</Badge>, "Jun 9", <Badge variant="green">Published</Badge>,
      <div className="flex gap-2"><button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.edit}</button><button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">{Icon.trash}</button></div>],
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Blog posts</h2>
        <button onClick={() => setActive("add-blog")} className="flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors">
          {Icon.plus} Write post
        </button>
      </div>
      <Table heads={["Title", "Author", "Category", "Date", "Status", "Actions"]} rows={rows} />
    </div>
  );
};

/* --- ADD BLOG --- */
const AddBlogPanel = () => {
  const [publish, setPublish] = useState(true);
  const [comments, setComments] = useState(false);
  return (
    <div className="space-y-4">
      <Card title="Post content" icon={Icon.blog}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <Field label="Post title"><Input type="text" placeholder="e.g. Style guide for winter 2026" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Category">
            <Select><option value="">Select category</option><option>Fashion</option><option>Lifestyle</option><option>Trends</option><option>Tips</option></Select>
          </Field>
          <Field label="Tags"><Input type="text" placeholder="e.g. fashion, style, winter" /></Field>
        </div>
        <div className="mb-4">
          <Field label="Excerpt / meta description"><Input type="text" placeholder="Short summary shown in search results…" /></Field>
        </div>
        <Field label="Body content"><Textarea rows={5} placeholder="Write your full blog post here…" /></Field>
      </Card>

      <Card title="Featured image" icon={Icon.upload}>
        <UploadBox label="Featured banner image" sub="Click to upload — recommended 1200×600px" />
      </Card>

      <Card title="Publish settings" icon={Icon.eye}>
        <div className="space-y-4 mb-5">
          <Toggle checked={publish} onChange={setPublish} label="Publish immediately" />
          <Toggle checked={comments} onChange={setComments} label="Allow comments" />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">Save as draft</button>
          <button className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors">Publish post</button>
        </div>
      </Card>
    </div>
  );
};

/* --- SLIDERS --- */
const SlidersPanel = () => {
  const [selected, setSelected] = useState(0);
  const [active0, setActive0] = useState(true);
  const slides = [
    { title: "Summer sale — up to 50% off", cta: "Shop now", bg: "from-purple-100 to-purple-50", emoji: "🛍️", status: "active" },
    { title: "New winter arrivals", cta: "Explore collection", bg: "from-amber-100 to-orange-50", emoji: "🧥", status: "active" },
    { title: "Members get 10% off always", cta: "Join now", bg: "from-green-100 to-emerald-50", emoji: "✨", status: "paused" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Hero sliders</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {slides.map((s, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            className={`bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${selected === i ? "border-[#7b3fe4] shadow-md shadow-purple-100" : "border-gray-100 hover:border-gray-200"}`}
          >
            <div className={`h-24 bg-gradient-to-br ${s.bg} flex items-center justify-center`}>
              <div className="text-center px-3">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{s.title}</p>
              </div>
            </div>
            <div className="px-3 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Slide {i + 1}</span>
              <div className="flex items-center gap-2">
                <button className="text-gray-300 hover:text-gray-500 transition-colors">{Icon.chevronLeft}</button>
                <button className="text-gray-300 hover:text-gray-500 transition-colors">{Icon.chevronRight}</button>
                <Badge variant={s.status === "active" ? "green" : "amber"}>{s.status === "active" ? "Active" : "Paused"}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card title={`Editing: Slide ${selected + 1}`} icon={Icon.edit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Headline"><Input type="text" defaultValue={slides[selected].title} key={selected} /></Field>
          <Field label="Subheading"><Input type="text" placeholder="Optional subtitle…" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="CTA button text"><Input type="text" defaultValue={slides[selected].cta} key={`cta-${selected}`} /></Field>
          <Field label="CTA link"><Input type="text" defaultValue="/sale" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <UploadBox label="Background image" sub="Upload or replace" />
          <div className="space-y-3">
            <Field label="Overlay opacity (%)"><Input type="number" defaultValue="25" min="0" max="100" /></Field>
            <Toggle checked={active0} onChange={setActive0} label="Slide active" />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">Discard</button>
          <button className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors">Save slide</button>
        </div>
      </Card>

      <div className="mt-4">
        <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-5 flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:border-[#7b3fe4] hover:text-[#7b3fe4] hover:bg-purple-50/40 transition-all">
          {Icon.plus} Add new slide
        </button>
      </div>
    </div>
  );
};

/* --- ORDERS --- */
const OrdersPanel = () => {
  const rows = [
    ["#5041", "Emma Watson", "2", "$124", "Jun 23", <Badge variant="green">Delivered</Badge>, <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.eye}</button>],
    ["#5040", "James Kirk", "1", "$89", "Jun 22", <Badge variant="amber">Shipping</Badge>, <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.eye}</button>],
    ["#5039", "Priya Sharma", "3", "$210", "Jun 22", <Badge variant="blue">Processing</Badge>, <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.eye}</button>],
    ["#5038", "Luca Moretti", "1", "$55", "Jun 21", <Badge variant="red">Cancelled</Badge>, <button className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors">{Icon.eye}</button>],
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">All orders</h2>
      </div>
      <Table heads={["Order", "Customer", "Items", "Total", "Date", "Status", "View"]} rows={rows} />
    </div>
  );
};

/* --- SETTINGS --- */
const SettingsPanel = () => {
  const [t1, setT1] = useState(true);
  const [t2, setT2] = useState(true);
  const [t3, setT3] = useState(false);
  return (
    <div className="space-y-4">
      <Card title="Store details" icon={Icon.settings}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Store name"><Input type="text" defaultValue="ShopAdmin" /></Field>
          <Field label="Support email"><Input type="email" defaultValue="support@shop.com" /></Field>
        </div>
        <Field label="Store URL"><Input type="text" defaultValue="https://myshop.com" /></Field>
      </Card>
      <Card title="Notifications" icon={Icon.bell}>
        <div className="space-y-4 mb-5">
          <Toggle checked={t1} onChange={setT1} label="New order email alerts" />
          <Toggle checked={t2} onChange={setT2} label="Low stock warnings" />
          <Toggle checked={t3} onChange={setT3} label="Customer review notifications" />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors">Save settings</button>
        </div>
      </Card>
    </div>
  );
};

/* ============================================================
   SIDEBAR NAV CONFIG
   ============================================================ */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Icon.dashboard, section: "Overview" },
  { id: "products", label: "Products", icon: Icon.products, section: "Catalog", badge: "96" },
  { id: "add-product", label: "Add product", icon: Icon.plus, section: null },
  { id: "blogs", label: "Blog posts", icon: Icon.blog, section: "Content" },
  { id: "add-blog", label: "Write post", icon: Icon.edit, section: null },
  { id: "sliders", label: "Sliders", icon: Icon.slideshow, section: null },
  { id: "orders", label: "Orders", icon: Icon.orders, section: "Store", badge: "3" },
  { id: "settings", label: "Settings", icon: Icon.settings, section: null },
];

const TITLES = {
  dashboard: "Dashboard", products: "Products", "add-product": "Add product",
  blogs: "Blog posts", "add-blog": "Write post", sliders: "Sliders",
  orders: "Orders", settings: "Settings",
};

/* ============================================================
   ROOT COMPONENT
   ============================================================ */
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const panelMap = {
    dashboard: <DashboardPanel setActive={setActive} />,
    products: <ProductsPanel setActive={setActive} />,
    "add-product": <AddProductPanel />,
    blogs: <BlogsPanel setActive={setActive} />,
    "add-blog": <AddBlogPanel />,
    sliders: <SlidersPanel />,
    orders: <OrdersPanel />,
    settings: <SettingsPanel />,
  };

  let prevSection = null;

  return (
    <div className="flex h-screen bg-[#f8f7fc] font-sans overflow-hidden">

      {/* ---- SIDEBAR ---- */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#7b3fe4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">F</div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none">Flone.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Admin panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV.map((item) => {
            const showSection = item.section && item.section !== prevSection;
            if (item.section) prevSection = item.section;
            return (
              <div key={item.id}>
                {showSection && (
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1.5">{item.section}</p>
                )}
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  active={active === item.id}
                  badge={item.badge}
                  onClick={() => setActive(item.id)}
                />
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#7b3fe4] text-xs font-bold flex-shrink-0">AD</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">Super admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---- MAIN ---- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {Icon.menu}
          </button>

          <h1 className="text-base font-semibold text-gray-900 flex-1">{TITLES[active]}</h1>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
            {Icon.search}
            <span>Search…</span>
          </div>

          {/* Bell */}
          <button className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Notifications">
            {Icon.bell}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Quick add */}
          <button
            onClick={() => setActive("add-product")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors"
          >
            {Icon.plus} <span>Add product</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {panelMap[active]}
        </main>
      </div>
    </div>
  );
}