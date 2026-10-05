import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Upload, X, Trash2 } from "lucide-react";
import api from "../../services/axios";
import { getSliders } from "../../services/sliderService";
import { createSlider } from "../../services/sliderService";
import { deleteSlider } from "../../services/sliderService";
import { getSliderById } from "../../services/sliderService";
/* ------------------------------------------------------------------ */
/*  Real backend connection                                            */
/*  Base URL: configured through VITE_API_URL                           */
/*  Endpoints: /api/sliders (GET, POST), /api/sliders/:id (DELETE)     */
/*  Image upload: /api/upload (same pattern as AddProductPanel)        */
/*                                                                      */
/*  Slider schema (from backend):                                      */
/*    { title, subtitle, image, buttonLink, isActive }                 */
/* ------------------------------------------------------------------ */


const uploadFile = async (file) => {
  if (!file) return "";
  const fd = new FormData();
  fd.append("image", file);
  const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data.path;
};

/* ------------------------------------------------------------------ */
/*  Icon set                                                           */
/* ------------------------------------------------------------------ */
const Icon = {
  plus: <Plus size={16} />,
  edit: Pencil,
  trash: <Trash2 size={15} />,
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

const UploadBox = ({ label, sub, fileName, multiple = false, maxFiles, onChange }) => {
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
        accept="image/*"
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

/* ------------------------------------------------------------------ */
/*  Confirm delete modal                                              */
/* ------------------------------------------------------------------ */
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Delete slide</h3>
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
/*  Add slide form (inline panel, not a modal)                        */
/* ------------------------------------------------------------------ */
const AddSlideForm = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [buttonText,Setbuttontext]=useState("")
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Title is required."); return; }
    if (!image) { setError("Slide image is required."); return; }

    try {
      setSaving(true);
      const imagePath = await uploadFile(image);
      const payload = {
        title,
        subtitle,
        image: imagePath,
        buttonText,
        buttonLink,
        isActive,
      };
      const res = await createSlider(payload);
      onCreated(res.data);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while saving the slide.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="New slide" icon={Icon.edit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Title"><Input type="text" placeholder="e.g. Summer Offer 2026 Collection" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Subtitle"><Input type="text" placeholder="e.g. Smart Products" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Button link"><Input type="text" placeholder="/shop" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} /></Field>
        <Field label="Button text"><Input type="text" placeholder="button text" value={buttonText} onChange={(e) => Setbuttontext(e.target.value)} /></Field>
        <div className="flex items-end pb-2.5">
          <Toggle checked={isActive} onChange={setIsActive} label="Slide active" />
        </div>
      </div>
      <div className="mb-4">
        <UploadBox label="Slide image" sub="Click to upload" fileName={image?.name} onChange={(f) => setImage(f)} />
      </div>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">{error}</p>}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} disabled={saving} className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50">Cancel</button>
        <button type="button" onClick={handleSubmit} disabled={saving} className="px-5 py-2 rounded-xl bg-[#7b3fe4] text-white text-sm font-medium hover:bg-[#6830c8] transition-colors disabled:opacity-50">{saving ? "Saving…" : "Save slide"}</button>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/*  SlidersPanel — list, add, delete — connected to real backend       */
/* ------------------------------------------------------------------ */
export const SlidersPanels = () => {
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await getSliders();
      setSlider(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = (newSlide) => {
    setSlider((prev) => [...prev, newSlide]);
    setShowAddForm(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteSlider(deleteTarget._id);
      setSlider((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Hero sliders ({slider.length})</h2>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#7b3fe4] text-white text-sm font-medium rounded-xl hover:bg-[#6830c8] transition-colors">
            {Icon.plus} Add new slide
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 mb-6">Loading sliders…</p>
      ) : slider.length === 0 && !showAddForm ? (
        <p className="text-sm text-gray-400 mb-6">No sliders yet. Add your first one below.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {slider.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
              <div
                className="h-24 bg-gray-100 flex items-center justify-center bg-cover bg-center"
                style={s.image ? { backgroundImage: `url(${s.image})` } : undefined}
              >
                {!s.image && <span className="text-xs text-gray-400">No image</span>}
              </div>
              <div className="px-3 py-2.5">
                <p className="text-xs font-medium text-gray-800 leading-tight truncate">{s.title}</p>
                {s.subtitle && <p className="text-xs text-gray-400 truncate">{s.subtitle}</p>}
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={s.isActive ? "green" : "gray"}>{s.isActive ? "Active" : "Inactive"}</Badge>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    {Icon.trash}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
{console.log(slider)}
      {showAddForm && (
        <AddSlideForm onClose={() => setShowAddForm(false)} onCreated={handleCreated} />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={`"${deleteTarget?.title}"`}
        loading={deleting}
      />
    </div>
  );
};
