import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, X, FileText, UploadCloud, Eye } from "lucide-react";

/* Adjust these import lines to wherever your API service actually lives —
   same place `createBlog` comes from in AddBlogPanel.
   getAllBlogs()      -> GET    /blogs      -> returns the list for the table
   getBlogById(id)    -> GET    /blogs/:id  -> returns one post
   updateBlog(id, p)  -> PUT    /blogs/:id  -> saves changes
   deleteBlog(id)     -> DELETE /blogs/:id  -> removes the post              */
import { getBlogs, getBlogById, updateBlog, deleteBlog } from "../../services/blogService";
import api from "../../services/axios"; // same axios instance used for /upload

/* Card, Field, Input, Select, Toggle, UploadBox are assumed to already be
   imported in this file the same way they are in AddBlogPanel — remove this
   comment once you've pointed them at the right path. */

/* ------------------------------------------------------------------ */
/*  Icon set used by {Icon.x}                                         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Icon set used by {Icon.x}                                         */
/* ------------------------------------------------------------------ */
const Icon = {
  plus: <Plus size={16} />,
  edit: <Pencil size={15} />,
  trash: <Trash2 size={15} />,
  blog: <FileText size={16} />,
  upload: <UploadCloud size={16} />,
  eye: <Eye size={16} />,
};
 
/* ------------------------------------------------------------------ */
/*  Badge — variant -> color mapping                                  */
/* ------------------------------------------------------------------ */
const badgeVariants = {
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-[#7b3fe4]",
};
 
const Badge = ({ variant = "gray", children }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      badgeVariants[variant] || badgeVariants.gray
    }`}
  >
    {children}
  </span>
);
 
/* ------------------------------------------------------------------ */
/*  Form primitives — Card, Field, Input, Select, Toggle, UploadBox.  */
/*  If your project already has these in a shared UI kit, delete this */
/*  block and import them the same way AddBlogPanel does instead.     */
/* ------------------------------------------------------------------ */
const Card = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
    {(title || icon) && (
      <div className="flex items-center gap-2 mb-5 text-gray-800">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
    )}
    {children}
  </div>
);
 
const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs font-medium text-gray-500 mb-1.5">{label}</span>
    {children}
  </label>
);
 
const Input = (props) => (
  <input
    {...props}
    className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
  />
);
 
const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30"
  >
    {children}
  </select>
);
 
const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-600">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-colors relative ${
        checked ? "bg-[#7b3fe4]" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  </label>
);
 
const UploadBox = ({ label, sub, fileName, onChange }) => (
  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-[#7b3fe4]/50 transition-colors">
    <UploadCloud size={22} className="text-gray-400" />
    <span className="text-sm font-medium text-gray-600">{label}</span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
    {fileName && <span className="text-xs text-[#7b3fe4] font-medium">{fileName}</span>}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
    />
  </label>
);
 
/* ------------------------------------------------------------------ */
/*  EditBlogPanel — the actual form. Loads the post, saves, deletes.  */
/*  Props:                                                            */
/*  - blogId    (required) id of the post being edited                */
/*  - onUpdated (optional) called with the saved post after a save    */
/*  - onDeleted (optional) called with blogId after a delete          */
/* ------------------------------------------------------------------ */
const EditBlogPanel = ({ blogId, onUpdated, onDeleted }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
 
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [heroImage, setHeroImage] = useState(null); // new file, only if user replaces it
  const [existingHeroImage, setExistingHeroImage] = useState(""); // path already saved on the post
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState([{ text: "", type: "body" }]);
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
 
  /* Load the existing post once, and every time blogId changes */
  useEffect(() => {
    if (!blogId) return;
    let cancelled = false;
 
    const load = async () => {
      setLoading(true);
      try {
        const res = await getBlogById(blogId);
        const blog = res?.data ?? res; // handles either { data: {...} } or a raw object
 
        if (cancelled) return;
 
        setTitle(blog.title || "");
        setSlug(blog.slug || "");
        setCategory(blog.category || "");
        setExistingHeroImage(blog.heroImage || "");
        setShortDescription(blog.shortDescription || "");
        setContent(blog.content?.length ? blog.content : [{ text: "", type: "body" }]);
        setTags((blog.tags || []).join(", "));
        setAuthor(blog.author || "Admin");
        setIsFeatured(!!blog.isFeatured);
        setIsPublished(blog.isPublished !== false);
      } catch (error) {
        console.log(error);
        alert("Could not load this post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
 
    load();
    return () => {
      cancelled = true;
    };
  }, [blogId]);
 
  const handleTitleChange = (val) => {
    setTitle(val);
    setSlug(
      val.toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };
 
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
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.path;
  };
 
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only re-upload if the user picked a new file — otherwise keep the
      // image path that's already saved on the post.
      const imagePath = heroImage ? await uploadFile(heroImage) : existingHeroImage;
 
      const payload = {
        title,
        slug,
        category,
        heroImage: imagePath,
        shortDescription,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        author,
        isFeatured,
        isPublished,
      };
 
      const res = await updateBlog(blogId, payload);
 
      onUpdated?.(res?.data ?? { _id: blogId, ...payload });
    } catch (error) {
      console.log(error);
      alert("Could not update this post.");
    } finally {
      setSaving(false);
    }
  };
 
  /* Actually deletes on the server, then tells the parent to drop the row —
     no full page reload needed. */
  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this post? This can't be undone.");
    if (!confirmed) return;
 
    setDeleting(true);
    try {
      await deleteBlog(blogId);
      onDeleted?.(blogId);
    } catch (error) {
      console.log(error);
      alert("Could not delete this post.");
    } finally {
      setDeleting(false);
    }
  };
 
  if (loading) {
    return <p className="text-sm text-gray-400 py-10 text-center">Loading post…</p>;
  }
 
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
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              <option>Fashion</option>
              <option>Lifestyle</option>
              <option>Trends</option>
              <option>Tips</option>
            </Select>
          </Field>
          <Field label="Tags">
            <Input
              type="text"
              placeholder="e.g. fashion, style, winter"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Field>
        </div>
 
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
 
      {/* Content Blocks */}
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
 
      {/* Featured Image */}
      <Card title="Featured image" icon={Icon.upload}>
        <UploadBox
          label="Featured banner image"
          sub="Recommended 1200×600px"
          fileName={heroImage?.name || existingHeroImage?.split("/").pop()}
          onChange={(f) => setHeroImage(f)}
        />
        {existingHeroImage && !heroImage && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-2">Current image</p>
            <img
              src={existingHeroImage}
              alt="Current hero"
              className="w-40 h-24 object-cover rounded-lg border border-gray-100"
            />
          </div>
        )}
      </Card>
 
      {/* Publish Settings + Save / Delete */}
      <Card title="Publish settings" icon={Icon.eye}>
        <div className="space-y-4 mb-5">
          <Toggle checked={isPublished} onChange={setIsPublished} label="Publish immediately" />
          <Toggle checked={isFeatured} onChange={setIsFeatured} label="Mark as featured" />
        </div>
        <div className="flex gap-3 justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2 rounded-xl border border-red-200 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete post"}
          </button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </Card>
    </div>
  );
};
 
/* ------------------------------------------------------------------ */
/*  Standalone delete button — for a table row, independent of the    */
/*  edit form. Not used by BlogsPanel below (it has its own confirm   */
/*  modal flow) but handy if you ever want an inline delete elsewhere.*/
/* ------------------------------------------------------------------ */
function DeleteBlogButton({ blogId, onDeleted, className = "" }) {
  const [deleting, setDeleting] = useState(false);
 
  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this post? This can't be undone.");
    if (!confirmed) return;
 
    setDeleting(true);
    try {
      await deleteBlog(blogId);
      onDeleted?.(blogId);
    } catch (error) {
      console.log(error);
      alert("Could not delete this post.");
    } finally {
      setDeleting(false);
    }
  };
 
  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className={`text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50 ${className}`}
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
 
/* ------------------------------------------------------------------ */
/*  EditBlogModal — wraps EditBlogPanel in an overlay so BlogsPanel    */
/*  can open it from the table's edit icon.                           */
/*  Props: isOpen, onClose, post ({_id, ...}), onSave(updatedBlog)     */
/* ------------------------------------------------------------------ */
const EditBlogModal = ({ isOpen, onClose, post, onSave }) => {
  if (!isOpen || !post) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-800">Edit post</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
 
        <EditBlogPanel
          blogId={post._id}
          onUpdated={(updated) => {
            onSave(updated);
            onClose();
          }}
          onDeleted={(id) => {
            onSave({ _id: id, __deleted: true });
            onClose();
          }}
        />
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
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Delete post</h3>
        <p className="text-sm text-gray-500 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-700">{itemName}</span>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
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
/*  BlogsPanel — real data, real update, real delete. The table       */
/*  updates the moment the server confirms, no reload needed.         */
/* ------------------------------------------------------------------ */
 export const BlogsPanel = ({ setActive }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
 
  useEffect(() => {
    let cancelled = false;
 
    const load = async () => {
      setLoading(true);
      try {
        const res = await getBlogs();
        const list = res?.data ?? res ?? [];
        if (!cancelled) setPosts(list);
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
 
    load();
    return () => {
      cancelled = true;
    };
  }, []);
 
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget._id);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
      alert("Could not delete this post.");
    } finally {
      setDeleting(false);
    }
  };
 
  /* Called from EditBlogModal after a save or an in-form delete. */
  const handleSave = (updated) => {
    setPosts((prev) =>
      updated.__deleted
        ? prev.filter((p) => p._id !== updated._id)
        : prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p))
    );
  };
 
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Blog posts ({posts.length})</h2>
        <button
          onClick={() => setActive("add-blog")}
          className="flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors"
        >
          {Icon.plus} Write post
        </button>
      </div>
 
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Title", "Author", "Category", "Date", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Loading posts…
                </td>
              </tr>
            )}
 
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No posts yet.
                </td>
              </tr>
            )}
 
            {!loading &&
              posts.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800 font-medium align-middle max-w-[200px] truncate">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-middle">{p.author}</td>
                  <td className="px-4 py-3 align-middle">
                    <Badge variant="purple">{p.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-middle">
                    {p.date || new Date(p.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <Badge variant={p.isPublished ? "green" : "amber"}>
                      {p.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditTarget(p)}
                        className="p-1.5 text-gray-400 hover:text-[#7b3fe4] hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        {Icon.edit}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        {Icon.trash}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
 
      <EditBlogModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        post={editTarget}
        onSave={handleSave}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={`"${deleteTarget?.title}"`}
        loading={deleting}
      />
    </>
  );
};
 