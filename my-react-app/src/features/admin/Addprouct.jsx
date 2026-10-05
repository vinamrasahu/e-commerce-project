import React, { useState } from "react";
import api from "../../services/axios";
import {
  Plus,
  X,
  Package,
  DollarSign,
  TrendingUp,
  Upload,
  Eye,
  Star,
  MessageSquare,
} from "lucide-react";
import { createProduct } from "../../services/productService";

/* ------------------------------------------------------------------ */
/*  Icon set used by <Card icon={Icon.x} />                           */
/* ------------------------------------------------------------------ */
const Icon = {
  products: Package,
  dollar: DollarSign,
  trending: TrendingUp,
  upload: Upload,
  eye: Eye,
  reviews: MessageSquare,
};

/* ------------------------------------------------------------------ */
/*  Shared UI primitives                                              */
/* ------------------------------------------------------------------ */
const Card = ({ title, icon: IconComp, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center gap-2 mb-4">
      {IconComp && (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7b3fe4]/10 text-[#7b3fe4]">
          <IconComp size={16} />
        </span>
      )}
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
  </div>
);

const baseInputClasses =
  "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-colors";

const Input = ({ className = "", ...props }) => (
  <input className={`${baseInputClasses} ${className}`} {...props} />
);

const Select = ({ className = "", children, ...props }) => (
  <select className={`${baseInputClasses} bg-white ${className}`} {...props}>
    {children}
  </select>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea className={`${baseInputClasses} resize-none ${className}`} {...props} />
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
        checked ? "bg-[#7b3fe4]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </label>
);

const UploadBox = ({ label, sub, fileName, multiple = false, maxFiles, accept = "image/*", onChange }) => {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (multiple) {
      onChange(maxFiles ? files.slice(0, maxFiles) : files);
    } else {
      onChange(files[0]);
    }
  };

  return (
    <div>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />
      <label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#7b3fe4]/40 hover:bg-[#7b3fe4]/5 transition-colors px-4 py-6 cursor-pointer text-center"
      >
        <Upload size={18} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-400">{fileName || sub}</span>
      </label>
    </div>
  );
};

/* A row of 5 clickable stars for setting a 1-5 rating on a review draft. */
const StarRatingInput = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="p-0.5"
        aria-label={`Set rating to ${n}`}
      >
        <Star
          size={18}
          className={n <= value ? "fill-[#7b3fe4] text-[#7b3fe4]" : "text-gray-300"}
        />
      </button>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  AddProductPanel                                                    */
/* ------------------------------------------------------------------ */
export const AddProductPanel = () => {
  const [published, setPublished] = useState(true);
  const [videos, setVideos] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState([{ label: "", hex: "" }]);
  const [badges, setBadges] = useState([{ label: "", type: "" }]);
  // Optional seed reviews the admin can attach when creating the product
  // (matches reviewSchema: author, rating 1-5, comment). Rows with no
  // author/comment filled in are dropped before submit.
  const [reviews, setReviews] = useState([{ author: "", rating: 5, comment: "" }]);

  const updateColor = (i, f, v) => setColors((prev) => prev.map((c, idx) => idx === i ? { ...c, [f]: v } : c));
  const updateBadge = (i, f, v) => setBadges((prev) => prev.map((b, idx) => idx === i ? { ...b, [f]: v } : b));
  const updateReview = (i, f, v) => setReviews((prev) => prev.map((r, idx) => idx === i ? { ...r, [f]: v } : r));

  const uploadFile = async (file) => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("image", file);
    const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.path;
  };

  const uploadFiles = async (files) => {
    if (!files?.length) return [];
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    const res = await api.post("/upload-multiple", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.paths;
  };

  // Uses the same shared `api` axios instance (with baseURL + auth already
  // configured) instead of a raw axios call to localhost, so it works in
  // every environment and stays consistent with uploadFile/uploadFiles.
  const uploadVideos = async (files) => {
    if (!files?.length) return [];
    const fd = new FormData();
    files.forEach((video) => fd.append("videos", video));
    const res = await api.post("/upload-videos", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.paths;
  };

  const handleSubmit = async (status) => {
    setFormError("");
    if (!image) { setFormError("Main image is required."); return; }
    try {
      setUploading(true);
      const imagePath = await uploadFile(image);
      const hoverImagePath = await uploadFile(hoverImage);
      const galleryPaths = await uploadFiles(galleryImages);
      const videoPaths = await uploadVideos(videos);

      // Only keep review rows the admin actually filled in.
      const cleanReviews = reviews
        .filter((r) => r.author.trim() && r.comment.trim())
        .map((r) => ({
          author: r.author.trim(),
          rating: Number(r.rating) || 5,
          comment: r.comment.trim(),
        }));

      const payload = {
        name, description, price: Number(price) || 0,
        salePrice: salePrice === "" ? null : Number(salePrice),
        image: imagePath, hoverImage: hoverImagePath || "", images: galleryPaths,
        videos: videoPaths,
        category,
        colors: colors.filter((c) => c.label || c.hex).map((c) => ({ value: c.label.toLowerCase().replace(/\s+/g, "-"), label: c.label, hex: c.hex })),
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        badges: badges.filter((b) => b.label || b.type),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        reviews: cleanReviews,
        stock: Number(stock) || 0, isFeatured: featured,
        isActive: status === "publish" ? published : false,
      };
      const res = await createProduct(payload);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setFormError("Something went wrong while saving the product.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Basic information" icon={Icon.products}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Product name"><Input type="text" placeholder="e.g. Crew ventile coat" value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Category"><Select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Select category</option><option>Men</option><option>Women</option><option>Kids</option><option>Accessories</option></Select></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Tags"><Input type="text" placeholder="e.g. jacket, winter" value={tags} onChange={(e) => setTags(e.target.value)} /></Field>
        </div>
        <Field label="Description"><Textarea rows={3} placeholder="Write a short product description…" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      </Card>

      <Card title="Pricing & stock" icon={Icon.dollar}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Regular price ($)"><Input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          <Field label="Sale price ($)"><Input type="number" placeholder="0.00" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} /></Field>
          <Field label="Stock qty"><Input type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Variants" icon={Icon.trending}>
        <Field label="Available sizes"><Input type="text" placeholder="e.g. S, M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} /></Field>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Colors</span>
            <button type="button" onClick={() => setColors((p) => [...p, { label: "", hex: "" }])} className="flex items-center gap-1 text-sm text-[#7b3fe4] hover:text-[#6830c8] font-medium"><Plus size={14} /> Add color</button>
          </div>
          <div className="space-y-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input type="text" placeholder="Name e.g. Black" value={c.label} onChange={(e) => updateColor(i, "label", e.target.value)} className="flex-1" />
                <Input type="text" placeholder="#2b2b2b" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className="w-32" />
                {c.hex && <span className="w-8 h-8 rounded-lg border border-gray-200 shrink-0" style={{ backgroundColor: c.hex }} />}
                <button type="button" onClick={() => setColors((p) => p.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 shrink-0"><X size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Badges</span>
            <button type="button" onClick={() => setBadges((p) => [...p, { label: "", type: "" }])} className="flex items-center gap-1 text-sm text-[#7b3fe4] hover:text-[#6830c8] font-medium"><Plus size={14} /> Add badge</button>
          </div>
          <div className="space-y-2">
            {badges.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input type="text" placeholder="Label e.g. New" value={b.label} onChange={(e) => updateBadge(i, "label", e.target.value)} className="flex-1" />
                <Input type="text" placeholder="Type e.g. success" value={b.type} onChange={(e) => updateBadge(i, "type", e.target.value)} className="flex-1" />
                <button type="button" onClick={() => setBadges((p) => p.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 shrink-0"><X size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Product images" icon={Icon.upload}>
        <div className="grid grid-cols-2 gap-4">
          <UploadBox label="Main image" sub="Click to upload" fileName={image?.name} onChange={(f) => setImage(f)} />
          <UploadBox label="Hover image" sub="Shown on card hover" fileName={hoverImage?.name} onChange={(f) => setHoverImage(f)} />
        </div>
        <div className="mt-4">
          <UploadBox label="Gallery images" sub="Upload up to 5" multiple maxFiles={5} fileName={galleryImages.length > 0 ? `${galleryImages.length} image${galleryImages.length > 1 ? "s" : ""} selected` : ""} onChange={(files) => setGalleryImages(files)} />
          {galleryImages.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {galleryImages.map((f, i) => <li key={i} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">{f.name}</li>)}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <UploadBox
            label="Product videos"
            sub="Upload up to 5 videos"
            accept="video/*"
            multiple
            maxFiles={5}
            fileName={
              videos.length > 0
                ? `${videos.length} video${videos.length > 1 ? "s" : ""} selected`
                : ""
            }
            onChange={(files) => setVideos(files)}
          />

          {videos.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {videos.map((video, index) => (
                <li
                  key={index}
                  className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1"
                >
                  {video.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card title="Reviews" icon={Icon.reviews}>
        <p className="text-xs text-gray-400 mb-3">
          Optional — add starter reviews for this product. Rows left blank are ignored.
        </p>
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      type="text"
                      placeholder="Reviewer name"
                      value={r.author}
                      onChange={(e) => updateReview(i, "author", e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 shrink-0">Rating</span>
                      <StarRatingInput
                        value={r.rating}
                        onChange={(n) => updateReview(i, "rating", n)}
                      />
                    </div>
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="What did they say about the product?"
                    value={r.comment}
                    onChange={(e) => updateReview(i, "comment", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setReviews((p) => p.filter((_, idx) => idx !== i))}
                  className="p-2 text-gray-400 hover:text-red-500 shrink-0"
                  aria-label="Remove review"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setReviews((p) => [...p, { author: "", rating: 5, comment: "" }])}
          className="mt-3 flex items-center gap-1 text-sm text-[#7b3fe4] hover:text-[#6830c8] font-medium"
        >
          <Plus size={14} /> Add review
        </button>
      </Card>

      <Card title="Visibility" icon={Icon.eye}>
        <div className="space-y-4 mb-5">
          <Toggle checked={published} onChange={setPublished} label="Published — visible in storefront" />
          <Toggle checked={featured} onChange={setFeatured} label="Featured — show on homepage" />
        </div>
        {formError && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">{formError}</p>}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button type="button" disabled={uploading} onClick={() => handleSubmit("draft")} className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50">Save as draft</button>
          <button type="button" disabled={uploading} onClick={() => handleSubmit("publish")} className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors disabled:opacity-50">{uploading ? "Uploading…" : "Publish product"}</button>
        </div>
      </Card>
    </div>
  );
};