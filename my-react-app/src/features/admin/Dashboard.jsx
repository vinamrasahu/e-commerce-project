import { useState, useRef,useEffect } from "react";
import api from "../../services/axios";
import { AddProductPanel } from "./Addprouct";
import { createProduct } from "../../services/productService";
import { deleteProduct } from "../../services/productService";
import { getProducts } from "../../services/productService";
import { BlogsPanel } from "./BlogsPanel";
import { updateProduct } from "../../services/productService";
import { SlidersPanel } from "./SliderPanel";
import { ProductsPanel } from "./ProductPanel";
import { createBlog } from "../../services/blogService";
import { Plus, X } from "lucide-react";
import {UserSessionsPage} from "./LoginSessions";
import AdminOrdersPage from "./order";

/* ============================================================
   ICONS
   ============================================================ */
const Icon = {
  dashboard: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>),
  products: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10" /></svg>),
  plus: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>),
  blog: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-8h-6M7 9h1m-1 4h4" /></svg>),
  slider: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /><path strokeLinecap="round" d="M8 12h8M5 9l-2 3 2 3M19 9l2 3-2 3" /></svg>),
  orders: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></svg>),
  settings: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>),
  edit: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>),
  trash: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>),
  eye: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
  bell: (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>),
  search: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>),
  upload: (<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>),
  chevronLeft: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>),
  chevronRight: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>),
  menu: (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>),
  trending: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>),
  dollar: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>),
  users: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>),
  bag: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" /></svg>),
  arrowUp: (<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>),
  arrowDown: (<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>),
  slideshow: (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="13" rx="2" /><path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>),
  warning: (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>),
};

/* ============================================================
   BADGE
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
   TOGGLE
   ============================================================ */
const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[#7b3fe4]" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

/* ============================================================
   UPLOAD BOX
   ============================================================ */
const UploadBox = ({ label, sub, multiple = false, onChange, fileName, maxFiles }) => {
  const inputRef = useRef(null);
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (multiple) {
      onChange?.(typeof maxFiles === "number" ? files.slice(0, maxFiles) : files);
    } else {
      onChange?.(files[0]);
    }
    e.target.value = "";
  };
  return (
    <div role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7b3fe4] hover:bg-purple-50/40 transition-all group">
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleFiles} className="hidden" />
      <span className="text-gray-300 group-hover:text-[#7b3fe4] transition-colors">{Icon.upload}</span>
      <p className="text-sm font-medium text-gray-500 group-hover:text-[#7b3fe4] text-center px-2">{fileName || label}</p>
      {sub && !fileName && <p className="text-xs text-gray-400">{sub}</p>}
      {fileName && <p className="text-xs text-[#7b3fe4]">Click to change</p>}
    </div>
  );
};

/* ============================================================
   CONFIRM DELETE MODAL
   ============================================================ */
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <span className="text-red-500">{Icon.warning}</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete {itemName}?</h3>
        <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone. The item will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
            {loading ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
};




/* ============================================================
   FORM PRIMITIVES
   ============================================================ */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);
const Input = ({ className = "", ...props }) => (
  <input {...props} className={`w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-all ${className}`} />
);
const Select = ({ children, className = "", ...props }) => (
  <select {...props} className={`w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-all appearance-none ${className}`}>{children}</select>
);
const Textarea = ({ className = "", ...props }) => (
  <textarea {...props} className={`w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-all resize-none ${className}`} />
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
   CARD
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
   NAV ITEM
   ============================================================ */
const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? "bg-[#7b3fe4] text-white shadow-md shadow-purple-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
    <span className={`flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>{badge}</span>}
  </button>
);

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
const DashboardPanel = ({ setActive }) => (
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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">{["Order","Customer","Status","Amount","Date"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {[["#5041","Emma W.",<Badge variant="green">Delivered</Badge>,"$124","Jun 23"],["#5040","James K.",<Badge variant="amber">Shipping</Badge>,"$89","Jun 22"],["#5039","Priya S.",<Badge variant="blue">Processing</Badge>,"$210","Jun 22"],["#5038","Luca M.",<Badge variant="red">Cancelled</Badge>,"$55","Jun 21"]].map((row,i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  {row.map((cell,j) => <td key={j} className="px-4 py-3 text-gray-700 align-middle">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <div><p className="text-sm text-gray-700 leading-snug">{a.text}</p><p className="text-xs text-gray-400 mt-0.5">{a.time}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);





const statusVariantProduct = { Active: "green", Sale: "amber", "Out of stock": "red", Draft: "gray" };


/* ============================================================
   ADD BLOG PANEL
   ============================================================ */
   const AddBlogPanel = () => {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [heroImage, setHeroImage] = useState(null);
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState([{ text: "", type: "body" }]);
    const [tags, setTags] = useState("");
    const [author, setAuthor] = useState("Admin");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isPublished, setIsPublished] = useState(true);
  
    // ✅ Auto-generate slug from title
    const handleTitleChange = (val) => {
      setTitle(val);
      setSlug(
        val.toLowerCase().trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    };
  
    // ✅ Content block handlers — all using `content` state
    const addBlock = () => setContent([...content, { text: "", type: "body" }]);
  
    const updateBlock = (i, key, val) => {
      const updated = [...content];
      updated[i] = { ...updated[i], [key]: val };
      setContent(updated);
    };
  
    const removeBlock = (i) => setContent(content.filter((_, idx) => idx !== i));
    const uploadFile = async (file) => {
      if (!file) return "";
    
      const formData = new FormData();
      formData.append("image", file);
    
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    
      return res.data.path;
    };
    // ✅ Submit handler
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const imagePath = await uploadFile(heroImage);
        console.log(heroImage);
        const payload = {
          title,
          slug,
          category,
          heroImage: imagePath,
          shortDescription,
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          author,
          isFeatured,
          isPublished,
        };
    
        console.log(payload);
    
        await createBlog(payload);
    
        alert("Blog Added Successfully");
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <div className="space-y-4">
  
        {/* Post Content */}
        <Card title="Post content" icon={Icon.blog}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Field label="Post title">
              <Input
                type="text"
                placeholder="e.g. Style guide for winter 2026"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Field>
          </div>
  
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Field label="Slug">
              <Input
                type="text"
                placeholder="auto-generated from title"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Field>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* ✅ category wired */}
            <Field label="Category">
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                <option>Fashion</option>
                <option>Lifestyle</option>
                <option>Trends</option>
                <option>Tips</option>
              </Select>
            </Field>
            {/* ✅ tags wired */}
            <Field label="Tags">
              <Input
                type="text"
                placeholder="e.g. fashion, style, winter"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Field>
          </div>
  
          {/* ✅ author wired */}
          <div className="mb-4">
            <Field label="Author">
              <Input
                type="text"
                placeholder="e.g. Admin"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Field>
          </div>
  
          {/* ✅ shortDescription wired */}
          <div className="mb-4">
            <Field label="Excerpt / meta description">
              <Input
                type="text"
                placeholder="Short summary shown in search results…"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </Field>
          </div>
        </Card>
  
        {/* Content Blocks — ✅ all using `content` state */}
        <Card title="Body content" icon={Icon.blog}>
          <div className="space-y-3">
            {content.map((block, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between gap-3">
                  <select
                    value={block.type}
                    onChange={(e) => updateBlock(i, "type", e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
                  >
                    <option value="body">Body</option>
                    <option value="quote">Quote</option>
                  </select>
  
                  {content.length > 1 && (
                    <button
                      onClick={() => removeBlock(i)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
  
                <textarea
                  rows={block.type === "quote" ? 2 : 4}
                  value={block.text}
                  onChange={(e) => updateBlock(i, "text", e.target.value)}
                  placeholder={block.type === "quote" ? "Enter a quote…" : "Write your content here…"}
                  className={`w-full text-sm rounded-lg border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 ${
                    block.type === "quote"
                      ? "italic text-gray-500 bg-purple-50 border-purple-200"
                      : "bg-white"
                  }`}
                />
              </div>
            ))}
          </div>
  
          <button
            onClick={addBlock}
            className="mt-3 text-sm text-[#7b3fe4] hover:underline font-medium"
          >
            + Add block
          </button>
        </Card>
  
        {/* Featured Image — ✅ heroImage state */}
        <Card title="Featured image" icon={Icon.upload}>
          <UploadBox
            label="Featured banner image"
            sub="Recommended 1200×600px"
            fileName={heroImage?.name}
            onChange={(f) => setHeroImage(f)}
          />
        </Card>
  
        {/* Publish Settings — ✅ correct state names */}
        <Card title="Publish settings" icon={Icon.eye}>
          <div className="space-y-4 mb-5">
            <Toggle checked={isPublished} onChange={setIsPublished} label="Publish immediately" />
            <Toggle checked={isFeatured} onChange={setIsFeatured} label="Mark as featured" />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Save as draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors"
            >
              Publish post
            </button>
          </div>
        </Card>
  
      </div>
    );
  };

  
/* ============================================================
   ORDERS PANEL  — with edit + delete
   ============================================================ */
// const INITIAL_ORDERS = [
//   { id: "#5041", customer: "Emma Watson", items: "2", amount: "$124", date: "Jun 23", status: "Delivered" },
//   { id: "#5040", customer: "James Kirk", items: "1", amount: "$89", date: "Jun 22", status: "Shipping" },
//   { id: "#5039", customer: "Priya Sharma", items: "3", amount: "$210", date: "Jun 22", status: "Processing" },
//   { id: "#5038", customer: "Luca Moretti", items: "1", amount: "$55", date: "Jun 21", status: "Cancelled" },
// ];

const statusVariantOrder = { Delivered: "green", Shipping: "amber", Processing: "blue", Cancelled: "red" };

// const OrdersPanel = () => {
//   const [orders, setOrders] = useState(INITIAL_ORDERS);
//   const [editTarget, setEditTarget] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       // TODO: await api.delete(`/orders/${deleteTarget.id}`)
//       await new Promise((r) => setTimeout(r, 600));
//       setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
//       setDeleteTarget(null);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleSave = (updated) => {
//     setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-sm font-semibold text-gray-800">All orders ({orders.length})</h2>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-100">
//               {["Order","Customer","Items","Total","Date","Status","Actions"].map(h => (
//                 <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((o) => (
//               <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
//                 <td className="px-4 py-3 text-gray-800 font-medium align-middle">{o.id}</td>
//                 <td className="px-4 py-3 text-gray-700 align-middle">{o.customer}</td>
//                 <td className="px-4 py-3 text-gray-700 align-middle">{o.items}</td>
//                 <td className="px-4 py-3 text-gray-700 align-middle">{o.amount}</td>
//                 <td className="px-4 py-3 text-gray-700 align-middle">{o.date}</td>
//                 <td className="px-4 py-3 align-middle"><Badge variant={statusVariantOrder[o.status] || "gray"}>{o.status}</Badge></td>
//                 <td className="px-4 py-3 align-middle">
//                   <div className="flex gap-1">
//                     <button onClick={() => setEditTarget(o)} className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors" title="Edit order">{Icon.edit}</button>
//                     <button onClick={() => setDeleteTarget(o)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete order">{Icon.trash}</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <EditOrderModal isOpen={!!editTarget} onClose={() => setEditTarget(null)} order={editTarget} onSave={handleSave} />
//       <ConfirmDeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={`order ${deleteTarget?.id}`} loading={deleting} />
//     </>
//   );
// };



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
   NAV CONFIG
   ============================================================ */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Icon.dashboard, section: "Overview" },
  { id: "products", label: "Products", icon: Icon.products, section: "Catalog", badge: "96" },
  {
    id: "login",
    label: "Login Sessions",
    icon: Icon.users,
    section: "Users",
  },  
 
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
   ROOT
   ============================================================ */
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const panelMap = {
    dashboard: <DashboardPanel setActive={setActive} />,
    products: <ProductsPanel setActive={setActive} />,
    login: <UserSessionsPage setActive={setActive} /> ,
    "add-product": <AddProductPanel />,
    blogs: <BlogsPanel setActive={setActive} />,
      "add-blog": <AddBlogPanel />,
    sliders: <SlidersPanel />,
  
    settings: <SettingsPanel />,
    orders:<AdminOrdersPage/>
  };

  let prevSection = null;

  return (
    <div className="flex h-screen bg-[#f8f7fc] font-sans overflow-hidden">
      <aside className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#7b3fe4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">F</div>
          <div><p className="font-bold text-gray-900 text-sm leading-none">Flone.</p><p className="text-[10px] text-gray-400 mt-0.5">Admin panel</p></div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV.map((item) => {
            const showSection = item.section && item.section !== prevSection;
            if (item.section) prevSection = item.section;
            return (
              <div key={item.id}>
                {showSection && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1.5">{item.section}</p>}
                <NavItem icon={item.icon} label={item.label} active={active === item.id} badge={item.badge} onClick={() => setActive(item.id)} />
              </div>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#7b3fe4] text-xs font-bold flex-shrink-0">AD</div>
            <div className="min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">Admin</p><p className="text-xs text-gray-400 truncate">Super admin</p></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors" aria-label="Toggle sidebar">{Icon.menu}</button>
          <h1 className="text-base font-semibold text-gray-900 flex-1">{TITLES[active]}</h1>
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">{Icon.search}<span>Search…</span></div>
          <button className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Notifications">{Icon.bell}<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span></button>
          {/* <button onClick={() => setActive("add-product")} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors">{Icon.plus} <span>Add product</span></button> */}
        </header>
        <main className="flex-1 overflow-y-auto p-5">{panelMap[active]}</main>
      </div>
    </div>
  );
}