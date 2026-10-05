import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import axios from "axios";

/* ------------------------------------------------------------------ */
/*  Real backend connection                                           */
/*  Base URL: http://localhost:5000/api                               */
/*  Endpoints: /api/products (GET, PUT /:id, DELETE /:id)             */
/*                                                                     */
/*  This replaces:                                                    */
/*    import { getProducts } from "../../services/productService";   */
/*    import api from "../../services/axios";                         */
/* ------------------------------------------------------------------ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const getProducts = () => api.get("/products");

const deleteProduct = (id) => api.delete(`/products/${id}`);

const updateProduct = (id, updatedProduct) => api.put(`/products/${id}`, updatedProduct);

/* ------------------------------------------------------------------ */
/*  Icon set used by {Icon.x}                                         */
/* ------------------------------------------------------------------ */
const Icon = {
  plus: <Plus size={16} />,
  edit: <Pencil size={15} />,
  trash: <Trash2 size={15} />,
};

/* ------------------------------------------------------------------ */
/*  Status -> badge color mapping                                     */
/* ------------------------------------------------------------------ */
const statusVariantProduct = {
  published: "green",
  draft: "gray",
  archived: "red",
};

const badgeVariants = {
  green: "bg-green-50 text-green-600",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-[#7b3fe4]",
};

const Badge = ({ variant = "gray", children }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
      badgeVariants[variant] || badgeVariants.gray
    }`}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Edit product modal                                                */
/* ------------------------------------------------------------------ */
const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [form, setForm] = useState(product || {});

  useEffect(() => {
    setForm(product || {});
  }, [product]);

  if (!isOpen || !product) return null;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateListField = (field, text) =>
    update(field, text.split(",").map((s) => s.trim()).filter(Boolean));

  const updateColor = (i, key, value) =>
    setForm((prev) => ({
      ...prev,
      colors: (prev.colors || []).map((c, idx) => (idx === i ? { ...c, [key]: value } : c)),
    }));
  const addColor = () =>
    setForm((prev) => ({ ...prev, colors: [...(prev.colors || []), { label: "", hex: "", value: "" }] }));
  const removeColor = (i) =>
    setForm((prev) => ({ ...prev, colors: (prev.colors || []).filter((_, idx) => idx !== i) }));

  const updateBadge = (i, key, value) =>
    setForm((prev) => ({
      ...prev,
      badges: (prev.badges || []).map((b, idx) => (idx === i ? { ...b, [key]: value } : b)),
    }));
  const addBadge = () =>
    setForm((prev) => ({ ...prev, badges: [...(prev.badges || []), { label: "", type: "" }] }));
  const removeBadge = (i) =>
    setForm((prev) => ({ ...prev, badges: (prev.badges || []).filter((_, idx) => idx !== i) }));

  const updateInfo = (i, key, value) =>
    setForm((prev) => ({
      ...prev,
      additionalInfo: (prev.additionalInfo || []).map((row, idx) =>
        idx === i ? { ...row, [key]: value } : row
      ),
    }));
  const addInfo = () =>
    setForm((prev) => ({ ...prev, additionalInfo: [...(prev.additionalInfo || []), { label: "", value: "" }] }));
  const removeInfo = (i) =>
    setForm((prev) => ({ ...prev, additionalInfo: (prev.additionalInfo || []).filter((_, idx) => idx !== i) }));

  const removeExistingImage = (path) =>
    setForm((prev) => ({ ...prev, images: (prev.images || []).filter((p) => p !== path) }));
  const removeExistingVideo = (path) =>
    setForm((prev) => ({ ...prev, videos: (prev.videos || []).filter((p) => p !== path) }));

  // Clears both the existing stored path and any newly-staged replacement
  // file, so removing the image can't be silently undone by a leftover
  // imageFile/hoverImageFile still sitting in state.
  const removeMainImage = () =>
    setForm((prev) => ({ ...prev, image: "", imageFile: null }));
  const removeHoverImage = () =>
    setForm((prev) => ({ ...prev, hoverImage: "", hoverImageFile: null }));

  const resolveUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//.test(path)) return path;
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-0 px-5 pt-5">
          <h3 className="text-sm font-semibold text-gray-800">Edit product</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select
                value={form.category || ""}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              >
                <option value="">Select category</option>
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
                <option>Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={(form.tags || []).join(", ")}
                onChange={(e) => updateListField("tags", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
              <input
                type="number"
                value={form.price ?? ""}
                onChange={(e) => update("price", Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sale price</label>
              <input
                type="number"
                value={form.salePrice ?? ""}
                onChange={(e) => update("salePrice", e.target.value === "" ? null : Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
              <input
                type="number"
                value={form.stock ?? ""}
                onChange={(e) => update("stock", Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Primary color</label>
              <input
                type="text"
                value={form.color || ""}
                onChange={(e) => update("color", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Primary size</label>
              <input
                type="text"
                value={form.size || ""}
                onChange={(e) => update("size", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Available sizes (comma separated)</label>
            <input
              type="text"
              value={(form.sizes || []).join(", ")}
              onChange={(e) => updateListField("sizes", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Colors</span>
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-1 text-xs text-[#7b3fe4] hover:text-[#6830c8] font-medium"
              >
                <Plus size={12} /> Add color
              </button>
            </div>
            <div className="space-y-2">
              {(form.colors || []).map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Name e.g. Black"
                    value={c.label || ""}
                    onChange={(e) => updateColor(i, "label", e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
                  />
                  <input
                    type="text"
                    placeholder="#2b2b2b"
                    value={c.hex || ""}
                    onChange={(e) => updateColor(i, "hex", e.target.value)}
                    className="w-28 shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
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
                    className="p-1.5 text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Badges</span>
              <button
                type="button"
                onClick={addBadge}
                className="flex items-center gap-1 text-xs text-[#7b3fe4] hover:text-[#6830c8] font-medium"
              >
                <Plus size={12} /> Add badge
              </button>
            </div>
            <div className="space-y-2">
              {(form.badges || []).map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label e.g. New"
                    value={b.label || ""}
                    onChange={(e) => updateBadge(i, "label", e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
                  />
                  <input
                    type="text"
                    placeholder="Type e.g. success"
                    value={b.type || ""}
                    onChange={(e) => updateBadge(i, "type", e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeBadge(i)}
                    className="p-1.5 text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Rating (0–5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating ?? 0}
              onChange={(e) => update("rating", Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Additional information</span>
              <button
                type="button"
                onClick={addInfo}
                className="flex items-center gap-1 text-xs text-[#7b3fe4] hover:text-[#6830c8] font-medium"
              >
                <Plus size={12} /> Add row
              </button>
            </div>
            <div className="space-y-2">
              {(form.additionalInfo || []).map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label e.g. Material"
                    value={row.label || ""}
                    onChange={(e) => updateInfo(i, "label", e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
                  />
                  <input
                    type="text"
                    placeholder="Value e.g. 100% cotton"
                    value={row.value || ""}
                    onChange={(e) => updateInfo(i, "value", e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeInfo(i)}
                    className="p-1.5 text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Main image</label>
              {form.image && (
                <div className="relative w-16 h-16 mb-2">
                  <img
                    src={resolveUrl(form.image)}
                    alt="Main"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-red-500"
                  >
                    <X size={11} />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => update("imageFile", e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#7b3fe4]/10 file:text-[#7b3fe4]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hover image</label>
              {form.hoverImage && (
                <div className="relative w-16 h-16 mb-2">
                  <img
                    src={resolveUrl(form.hoverImage)}
                    alt="Hover"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeHoverImage}
                    className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-red-500"
                  >
                    <X size={11} />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => update("hoverImageFile", e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#7b3fe4]/10 file:text-[#7b3fe4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Gallery images</label>
            {(form.images || []).length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-2">
                {form.images.map((path) => (
                  <li key={path} className="relative">
                    <img
                      src={resolveUrl(path)}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(path)}
                      className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-red-500"
                    >
                      <X size={11} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => update("newGalleryFiles", Array.from(e.target.files))}
              className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#7b3fe4]/10 file:text-[#7b3fe4]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Product videos</label>
            {(form.videos || []).length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-2">
                {form.videos.map((path) => (
                  <li
                    key={path}
                    className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1"
                  >
                    {path.split("/").pop()}
                    <button
                      type="button"
                      onClick={() => removeExistingVideo(path)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => update("newVideoFiles", Array.from(e.target.files))}
              className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#7b3fe4]/10 file:text-[#7b3fe4]"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Published — visible in storefront</span>
              <button
                type="button"
                onClick={() => update("isActive", !form.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                  form.isActive ? "bg-[#7b3fe4]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
                    form.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Featured — show on homepage</span>
              <button
                type="button"
                onClick={() => update("isFeatured", !form.isFeatured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                  form.isFeatured ? "bg-[#7b3fe4]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
                    form.isFeatured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8]"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Confirm delete modal                                              */
/* ------------------------------------------------------------------ */
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Delete product</h3>
        <p className="text-sm text-gray-500 mb-5">
          Are you sure you want to delete <span className="font-medium text-gray-700">{itemName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ProductsPanel — logic and JSX kept exactly as provided             */
/* ------------------------------------------------------------------ */
export const ProductsPanel = ({ setActive }) => {
    const [products, setProducts] = useState([]);;
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
  
    const handleDelete = async () => {
      try {
          await deleteProduct(deleteTarget._id);
  
          setProducts(prev =>
              prev.filter(product => product._id !== deleteTarget._id)
          );
  
          setDeleteTarget(null);
      } catch (err) {
          console.log(err);
      }
  };
  
  
    useEffect(() => {
      fetchProducts();
    }, []);
    
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
    
        console.log(res.data); // Array from MongoDB
    
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const handleSave = async (updatedProduct) => {
      try {
        const res = await updateProduct(updatedProduct._id, updatedProduct);
    
        setProducts((prev) =>
          prev.map((product) =>
            product._id === updatedProduct._id ? res.data : product
          )
        );
    
        setEditTarget(null);
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">All products ({products.length})</h2>
          <button onClick={() => setActive("add-product")} className="flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors">
            {Icon.plus} Add product
          </button>
        </div>
 
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Product","Category","Price","Stock","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">{p.emoji}</div>
                      <div><p className="font-medium text-gray-800">{p.name}</p><p className="text-xs text-gray-400">{p.sub}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-middle">{p.category}</td>
                  <td className="px-4 py-3 align-middle">
                    {p.salePrice
                      ? <span><span className="text-[#7b3fe4] font-semibold">${p.salePrice}</span> <span className="line-through text-gray-400 text-xs">${p.price}</span></span>
                      : <span>${p.price}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-middle">{p.stock}</td>
                  <td className="px-4 py-3 align-middle"><Badge variant={statusVariantProduct[p.status] || "gray"}>{p.status}</Badge></td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex gap-1">
                      <button onClick={() => setEditTarget(p)} className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors" title="Edit">{Icon.edit}</button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">{Icon.trash}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <EditProductModal isOpen={!!editTarget} onClose={() => setEditTarget(null)} product={editTarget} onSave={handleSave} />
        <ConfirmDeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.name} loading={deleting} />
      </>
    );
  };

export default ProductsPanel;