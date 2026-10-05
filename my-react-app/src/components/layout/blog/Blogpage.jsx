import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../../../../assset/blogdata";
import { Search, MessageCircle, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaWhatsapp,
} from "react-icons/fa";
import FloneNavbar from "../Navbar";
import FloneFooter from "../Footer/Footer";

/* Share icons shown on each card. Add/remove entries here to change what
   shows up — every card pulls from this single list. */
const SHARE_ICONS = [
  { Icon: FaFacebookF, bg: "bg-[#3b5998]", label: "Facebook" },
  { Icon: FaTwitter, bg: "bg-[#38b6ff]", label: "Twitter" },
  { Icon: FaInstagram, bg: "bg-gradient-to-tr from-[#f9a03f] via-[#e63980] to-[#a238ff]", label: "Instagram" },
  { Icon: FaLinkedinIn, bg: "bg-[#0a66c2]", label: "LinkedIn" },
  { Icon: FaPinterestP, bg: "bg-[#e60023]", label: "Pinterest" },
  { Icon: FaWhatsapp, bg: "bg-[#25d366]", label: "WhatsApp" },
];

const PAGE_SIZE = 6;

/* =========================================================================
   BREADCRUMB BAR — light gray strip, centered "HOME / <page>" trail
   ========================================================================= */
function Breadcrumb({ trail }) {
  return (
    <div className="w-full bg-[#f7f7f7] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-center gap-2">
        {trail.map((item, i) => (
          <span key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">/</span>}
            {item.to ? (
              <Link
                to={item.to}
                className="text-xs sm:text-sm font-semibold tracking-wide text-gray-500 hover:text-[#7b3fe4] transition-colors uppercase"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#2b2b2b] uppercase">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Derive the Categories list (name + count) straight from the blogs coming
   back from useBlogs(), instead of hardcoding it. */
function buildCategories(blogs) {
  const counts = {};
  blogs.forEach((b) => {
    if (!b.category) return;
    counts[b.category] = (counts[b.category] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

/* Same idea for Tags — a de-duplicated list of every tag used across posts. */
function buildTags(blogs) {
  const set = new Set();
  blogs.forEach((b) => (b.tags || []).forEach((t) => set.add(t)));
  return Array.from(set);
}

/* =========================================================================
   BLOG CARD — image on top, meta row, title, excerpt, read more / share
   ========================================================================= */
function BlogCard({ blog }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-[#f5f5f5]">
      <img
 src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${blog.heroImage}`}
  alt={blog.title}

          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      <div className="flex flex-col px-5 pt-5 pb-5">
        {(blog.date || blog.comments != null) && (
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wide text-[#f5a623] mb-3">
            {blog.date && <span>{blog.date}</span>}
            {blog.date && blog.comments != null && <span className="text-gray-300">•</span>}
            {blog.comments != null && (
              <span className="inline-flex items-center gap-1 text-gray-400 font-normal">
                <MessageCircle size={14} className="text-gray-400" />
                {blog.comments}
              </span>
            )}
          </div>
        )}

        <Link to={`/blog/${blog._id}`}>
          <h3
            className={`text-lg font-semibold leading-snug mb-2 transition-colors ${
              hovered ? "text-[#7b3fe4]" : "text-[#2b2b2b]"
            }`}
          >
            {blog.title}
          </h3>
        </Link>

        {blog.excerpt && (
          <p className="text-sm text-gray-400 leading-relaxed mb-5">{blog.excerpt}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <Link
            to={`/blog/${blog._id}`}
            className="text-sm font-semibold text-[#2b2b2b] hover:text-[#7b3fe4] transition-colors"
          >
            Read More
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-1">Share:</span>
            {SHARE_ICONS.map(({ Icon, bg, label }) => (
              <button
                key={label}
                aria-label={`Share on ${label}`}
                className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center text-white hover:opacity-80 transition-opacity`}
              >
                <Icon size={11} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================================
   SIDEBAR
   ========================================================================= */
function Sidebar({ search, setSearch, activeCategories, toggleCategory, activeTags, toggleTag, recent, categories, tags }) {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-10">
      <div>
        <h4 className="text-base font-bold text-[#2b2b2b] mb-4">Search</h4>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search here..."
            className="w-full border border-gray-200 rounded-none py-2.5 pl-4 pr-10 text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-[#7b3fe4]"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      <div>
        <h4 className="text-base font-bold text-[#2b2b2b] mb-4">Recent Projects</h4>
        <div className="flex flex-col gap-4">
          {recent.map((r) => (
            <Link key={r._id} to={`/blog/${r._id}`} className="flex items-center gap-3 group">
            <img
  src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${r.heroImage}`}
                alt={r.title}
                className="w-14 h-14 object-cover shrink-0"
              />
              <div>
                {r.category && (
                  <span className="text-[11px] font-bold tracking-wide text-[#7b3fe4] uppercase">
                    {r.category}
                  </span>
                )}
                <p className="text-sm font-medium text-[#2b2b2b] leading-snug group-hover:text-[#7b3fe4] transition-colors">
                  {r.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-base font-bold text-[#2b2b2b] mb-4">Categories</h4>
        <div className="flex flex-col gap-3">
          {categories.length === 0 && (
            <p className="text-sm text-gray-400">No categories yet.</p>
          )}
          {categories.map((c) => (
            <label key={c.name} className="flex items-center justify-between cursor-pointer group">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={activeCategories.includes(c.name)}
                  onChange={() => toggleCategory(c.name)}
                  className="w-4 h-4 accent-[#7b3fe4]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#2b2b2b] transition-colors">
                  {c.name}
                </span>
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                {c.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-base font-bold text-[#2b2b2b] mb-4">Tag</h4>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && (
            <p className="text-sm text-gray-400">No tags yet.</p>
          )}
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeTags.includes(t)
                  ? "bg-[#7b3fe4] text-white border-[#7b3fe4]"
                  : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* =========================================================================
   PAGINATION
   ========================================================================= */
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-14">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#7b3fe4] hover:text-[#7b3fe4] disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            page === n
              ? "bg-[#7b3fe4] text-white"
              : "border border-gray-200 text-gray-500 hover:border-[#7b3fe4] hover:text-[#7b3fe4]"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#7b3fe4] hover:text-[#7b3fe4] disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */
export default function BlogPage({ title = "Our Blog", breadcrumbLabel = "Blog Standard" }) {
  const blogsData = useBlogs();
  const blogs = blogsData || [];

  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [page, setPage] = useState(1);
  const [showTop, setShowTop] = useState(false);

  const toggleCategory = (name) => {
    setPage(1);
    setActiveCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const toggleTag = (tag) => {
    setPage(1);
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const categories = useMemo(() => buildCategories(blogs), [blogs]);
  const tags = useMemo(() => buildTags(blogs), [blogs]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch = (b.title || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(b.category);
      const matchesTags =
        activeTags.length === 0 || activeTags.some((t) => (b.tags || []).includes(t));
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [blogs, search, activeCategories, activeTags]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!blogsData || blogsData.length === 0) {
    return (
      <>
        <Breadcrumb trail={[{ label: "Home", to: "/" }, { label: breadcrumbLabel }]} />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
          <p className="text-center text-gray-400 text-sm">Loading blogs…</p>
        </section>
      </>
    );
  }

  return (
    <>
        <FloneNavbar/>
      <Breadcrumb trail={[{ label: "Home", to: "/" }, { label: breadcrumbLabel }]} />
  
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
    
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
        <Sidebar
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          activeCategories={activeCategories}
          toggleCategory={toggleCategory}
          activeTags={activeTags}
          toggleTag={toggleTag}
          recent={blogs.slice(0, 1)}
          categories={categories}
          tags={tags}
        />

        <div className="flex-1 w-full">
          {pageItems.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              No posts match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
              {pageItems.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-11 h-11 rounded-full bg-[#7b3fe4] text-white flex items-center justify-center shadow-lg hover:bg-[#6a2fd0] transition-colors"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </section>
    <FloneFooter/>
    </>
  );
}