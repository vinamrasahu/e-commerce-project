import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
 import { getBlogById } from "../../../services/blogService";
import FloneNavbar from "../Navbar";

/* =========================================================================
   ICONS — inline SVG, no external icon library
   ========================================================================= */
const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
  </svg>
);
const ChevronUpIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" />
  </svg>
);
const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7h2.4l.4-2.7h-2.8V9.4c0-.8.2-1.3 1.4-1.3h1.5V5.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.3-3.8 3.8v2h-2.5v2.7h2.5v7h3.2z" />
  </svg>
);
const TwitterIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.6.8-2.6 1-.7-.8-1.8-1.3-2.9-1.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9-3.3-.2-6.2-1.8-8.2-4.2-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.8-.5 0 1.9 1.4 3.6 3.2 4-.4.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.8-5.1 1.8-.3 0-.7 0-1-.1 1.8 1.2 4 1.8 6.3 1.8 7.5 0 11.6-6.3 11.6-11.7v-.5c.8-.5 1.5-1.3 2-2.1z" />
  </svg>
);
const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
};

/* =========================================================================
   BREADCRUMB
   ========================================================================= */
function Breadcrumb({ label }) {
  return (
    <div className="bg-gray-100 border-b border-gray-200 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700">
          <span className="uppercase">Home</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="uppercase text-gray-800">{label}</span>
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   HERO IMAGE
   ========================================================================= */
function HeroImage({ src, alt }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mt-10">
      <img
  src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${src}`}
  alt={alt}
  className="w-full h-[420px] object-cover"
/>
      </div>
    </div>
  );
}

/* =========================================================================
   SIDEBAR — search, recent projects, categories, tags
   ========================================================================= */
function SearchBox() {
  const [value, setValue] = useState("");
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-gray-200">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search here..."
          className="flex-1 px-4 py-3 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
        />
        <span className="px-3 self-stretch flex items-center border-l border-gray-200">
          <button type="submit" aria-label="Search" className="text-purple-600 hover:text-purple-700">
            <SearchIcon size={16} />
          </button>
        </span>
      </form>
    </div>
  );
}

function RecentProjects({ projects }) {
  if (!projects?.length) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="flex gap-3">
            <a href={p.href} className="shrink-0">
              <img src={p.thumbnailUrl} alt={p.title} className="w-16 h-16 object-cover bg-gray-100" />
            </a>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-wide text-purple-600 uppercase">
                {p.category}
              </p>
              <a
                href={p.href}
                className="block text-sm text-gray-800 leading-snug hover:text-purple-600 line-clamp-2"
              >
                {p.title}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoriesList({ categories }) {
  if (!categories?.length) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <ul className="space-y-3">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span>{c.name}</span>
            </label>
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
              {c.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TagsList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tag</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t.id}
            type="button"
            className="px-4 py-2 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-purple-600 hover:text-white transition-colors"
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ post }) {
  return (
    <aside className="space-y-10">
      <SearchBox />
      <RecentProjects projects={post.recentProjects} />
      <CategoriesList categories={post.categories} />
      <TagsList tags={post.tags} />
    </aside>
  );
}

/* =========================================================================
   POST CONTENT
   ========================================================================= */
function PostMeta({ date, time }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase mb-3">
      {date} <span className="mx-1 text-gray-300">/</span> {time}
    </p>
  );
}

function PostContent({ blocks }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) =>
        block.variant === "quote" ? (
          <p
            key={i}
            className="italic font-medium text-gray-900 text-lg leading-relaxed border-l-4 border-purple-200 pl-4"
          >
            {block.text}
          </p>
        ) : (
          <p key={i} className="text-gray-600 leading-relaxed">
            {block.text}
          </p>
        )
      )}
    </div>
  );
}

function PostFooter({ postTags, shareLinks }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pb-8">
      <p className="text-sm text-gray-700">
        {postTags.map((tag, i) => (
          <span key={tag}>
            <a href="#" className="text-purple-600 hover:underline">
              {tag}
            </a>
            {i < postTags.length - 1 && <span className="text-gray-700">, </span>}
          </span>
        ))}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Share:</span>
        {shareLinks.map((link) => {
          const Icon = SOCIAL_ICONS[link.platform] ?? FacebookIcon;
          return (
            <a
              key={link.platform}
              href={link.href}
              aria-label={link.platform}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
            >
              <Icon size={14} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   COMMENTS
   ========================================================================= */
function CommentItem({ comment }) {
  const formattedDate = new Date(comment.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="flex gap-4">
      <img
        src={comment.avatarUrl}
        alt={comment.name}
        className="w-16 h-16 rounded-full object-cover shrink-0 grayscale"
      />
      <div>
        <h4 className="font-semibold text-gray-900">{comment.name}</h4>
        <p className="text-xs text-gray-400 mb-2">{formattedDate}</p>
        <p className="text-gray-600 leading-relaxed mb-3">{comment.message}</p>
        <button
          type="button"
          className="text-xs font-medium text-gray-700 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-100 transition-colors"
        >
          Reply
        </button>
      </div>
    </div>
  );
}

function CommentsList({ comments }) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <h3 className="text-lg font-bold text-gray-900 uppercase mb-8 tracking-wide">
        Comments : {String(comments.length).padStart(2, "0")}
      </h3>
      <div className="space-y-8">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}

function CommentForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="border-t border-gray-200 pt-10 mt-10">
      <h3 className="text-lg font-bold text-gray-900 uppercase mb-6 tracking-wide">
        Post a Comment
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-purple-400"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-purple-400"
          />
        </div>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows={6}
          className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-purple-400 resize-y"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}

/* =========================================================================
   BACK TO TOP
   ========================================================================= */
function BackToTop() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window?.scrollTo?.({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-colors"
    >
      <ChevronUpIcon size={20} />
    </button>
  );
}

/* =========================================================================
   DEFAULT / PLACEHOLDER POST
   Swap for a single post fetched from your backend, e.g. GET /api/posts/:id
   ========================================================================= */

/* =========================================================================
   MAIN BLOG POST PAGE
   ========================================================================= */
   export default function BlogPostPage({ onCommentSubmit }) {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchBlog();
    }, [id]);
  
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogById(id);
        console.log(res.data);
        setBlog(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    // ✅ Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      );
    }
  
    // ✅ Not found
    if (!blog) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-400 text-sm">Blog not found.</p>
        </div>
      );
    }
  
    // ✅ Format date from backend createdAt
    const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  
    return (
      <div className="min-h-screen bg-white">
        {/* ✅ All data now from `blog` (backend), not static `post` */}
        <FloneNavbar/>
        <Breadcrumb label="Blog Details" />
     
    
     
        <HeroImage src={blog.heroImage} alt={blog.title} />
  
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
  
            {/* ✅ Sidebar — pass only what exists in your schema */}
            <aside className="space-y-10">
              <SearchBox />
              <TagsList tags={blog.tags.map((t, i) => ({ id: i, name: t }))} />
            </aside>
  
            <main>
              {/* ✅ Meta */}
              <PostMeta date={formattedDate} time={`By ${blog.author}`} />
  
              {/* ✅ Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h1>
  
              {/* ✅ Short description */}
              <p className="text-gray-500 italic mb-6">{blog.shortDescription}</p>
  
              {/* ✅ Content blocks — schema uses `type` not `variant` */}
              <PostContent
                blocks={blog.content.map((block) => ({
                  text: block.text,
                  variant: block.type, // schema: "body" | "quote"
                }))}
              />
  
              {/* ✅ Tags as post footer tags */}
              <PostFooter
                postTags={blog.tags}
                shareLinks={[
                  { platform: "facebook", href: "#" },
                  { platform: "twitter", href: "#" },
                  { platform: "instagram", href: "#" },
                ]}
              />
  
              {/* ✅ Comments from backend */}
              <CommentsList
                comments={blog.comments.map((c) => ({
                  id: c._id,
                  name: c.name,
                  date: c.createdAt,
                  avatarUrl: c.avatar || "https://via.placeholder.com/64",
                  message: c.message,
                }))}
              />
  
              <CommentForm onSubmit={onCommentSubmit} />
            </main>
          </div>
        </div>
  
        <BackToTop />
      </div>
    );
  }