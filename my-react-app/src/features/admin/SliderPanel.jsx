import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Upload } from "lucide-react";
import { createSlider } from "../../services/sliderService";
import { getSliders } from "../../services/sliderService";
import { useNavigate } from "react-router-dom";
import { deleteSlider } from "../../services/sliderService";
/* ------------------------------------------------------------------ */
/*  Icon set used by {Icon.x} / <Card icon={Icon.x} />                */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/*  Icon set used by {Icon.x} / <Card icon={Icon.x} />                */
/* ------------------------------------------------------------------ */
const Icon = {
  plus: <Plus size={16} />,
  edit: Pencil,
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

  const handleFiles = async (file) => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("image", file);
    const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.path;
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
/*  SlidersPanel — connected to backend, with safe empty-state handling */
/* ------------------------------------------------------------------ */
export const SlidersPanel = () => {
    const navigate = useNavigate();

  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [active0, setActive0] = useState(true);
  const [slideImage, setSlideImage] = useState(null);

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

  const handleDelete = async () => {
    try {
      await deleteSlider(slider[selected]._id);
  
      alert("Slider deleted successfully");
  
      fetchSliders();
  
      setSelected(0);
    } catch (err) {
      console.log(err);
      alert("Failed to delete slider");
    }
  };
  const current = slider[selected];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Hero sliders</h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 mb-6">Loading sliders…</p>
      ) : slider.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">No sliders yet. Add your first one below.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {slider.map((s, i) => (
            <div key={s._id || i} onClick={() => setSelected(i)} className={`bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${selected === i ? "border-[#7b3fe4] shadow-md shadow-purple-100" : "border-gray-100 hover:border-gray-200"}`}>
              <div className={`h-24 bg-gradient-to-br ${s.bg} flex items-center justify-center`}>
                <div className="text-center px-3"><div className="text-2xl mb-1">{s.emoji}</div><p className="text-xs font-medium text-gray-700 leading-tight">{s.title}</p></div>
              </div>
              <div className="px-3 py-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Slide {i + 1}</span>
                <Badge variant="green">Active</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {current && (
        <Card title={`Editing: Slide ${selected + 1}`} icon={Icon.edit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Headline"><Input type="text" defaultValue={current.title} key={selected} /></Field>
            <Field label="Subheading"><Input type="text" placeholder="Optional subtitle…" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="CTA button text"><Input type="text" defaultValue={current.cta} key={`cta-${selected}`} /></Field>
            <Field label="CTA link"><Input type="text" defaultValue="/sale" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <UploadBox label="Background image" sub="Upload or replace" fileName={slideImage?.name} onChange={(f) => setSlideImage(f)} />
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
      )}

<div className="mt-4 flex gap-3">

<button
  onClick={() => navigate("/add-slider")}
  className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl py-5 flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:border-[#7b3fe4] hover:text-[#7b3fe4] hover:bg-purple-50/40 transition-all"
>
  {Icon.plus} Add New Slide
</button>

<button
  onClick={handleDelete}
  className="px-6 rounded-2xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"
>
  Delete Slide
</button>

</div>
      
    </div>
  );
};

export default SlidersPanel;