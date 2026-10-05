import { useState } from "react";
import { useBlogs } from "../../../../assset/blogdata";
import { Link } from "react-router-dom";

/* =========================================================================
   SECTION HEADING
   ========================================================================= */
function SectionHeading({ title }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10 sm:mb-12">
      <span className="h-[2px] w-10 sm:w-14 bg-[#2b2b2b]" />
      <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-[#2b2b2b] uppercase">
        {title}
      </h2>
      <span className="h-[2px] w-10 sm:w-14 bg-[#2b2b2b]" />
    </div>
  );
}

/* =========================================================================
   BLOG CARD — ✅ prop renamed from `post` to `blog`
   ========================================================================= */
function BlogCard({ blog }) {                              // ✅ was: { post }
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
    
      <div className="relative">
        <div className="relative overflow-hidden aspect-[4/3] bg-[#f5f5f5]">
        <img
  src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${blog.heroImage}`}
  alt={blog.title}
  className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
    hovered ? "scale-110" : "scale-100"
  }`}
/>
        </div>

        <div className="relative mx-4 sm:mx-6 -mt-8 bg-white px-4 sm:px-5 py-4 text-center shadow-sm">
          <Link to={`/blog/${blog._id}`}>             {/* ✅ was: post._id */}
            <h3
              className={`text-base sm:text-lg font-semibold leading-snug transition-colors ${
                hovered ? "text-[#7b3fe4]" : "text-[#2b2b2b]"
              }`}
            >
              {blog.title}                               {/* ✅ was: post.title */}
            </h3>
          </Link>
        </div>
      </div>

      <p className="text-center text-sm italic text-gray-400 mt-3">
        By {blog.author}                                 {/* ✅ was: post.author */}
      </p>
    </article>
  );
}

/* =========================================================================
   BLOG SECTION
   ========================================================================= */
export default function MainBlog({ title = "Our Blog" }) {
  const blogs = useBlogs();

  // ✅ Guard: show nothing (or a loader) while data is fetching
  if (!blogs || blogs.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <SectionHeading title={title} />
        <p className="text-center text-gray-400 text-sm">Loading blogs…</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <SectionHeading title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-y-14">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}                                  // ✅ consistent prop name
          />
        ))}
      </div>
    </section>
  );
}