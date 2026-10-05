import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { useDispatch, useSelector } from "react-redux";

import { addProductLike, 
  removeProductLike } from "../../redux/likeSlice";

/* ---------- Icons ---------- */
const HeartIcon = ({ filled }) => (
  <svg className="w-[18px] h-[18px]" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={filled ? "#f4c542" : "none"} stroke={filled ? "#f4c542" : "#d1d5db"} strokeWidth="1">
    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
  </svg>
);

/* ---------- Image URL helper ----------
   Builds a full URL for an image that may come back from the API as either:
     - a full URL (e.g. "https://res.cloudinary.com/...")
     - a relative path (e.g. "/uploads/foo.jpg" or "uploads/foo.jpg")
     - missing entirely

   Why your photos weren't showing — any one of these would do it, and the
   first two actually crash the *entire* grid (not just one card), because
   the error happens during render and there's no error boundary here:
     1. `product.image.startsWith(...)` throws if `product.image` is
        undefined/null — e.g. a product saved without a main image.
     2. `import.meta.env.VITE_API_URL.replace(...)` throws if VITE_API_URL
        isn't set (missing VITE_ prefix, wrong .env location, or the dev
        server wasn't restarted after adding it).
     3. Even when nothing throws, joining base + path without normalizing
        slashes can silently produce a broken URL (404, no error) if
        `product.image` was stored without a leading slash.

   This helper never throws and falls back to a placeholder instead.
*/
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";

function resolveImageUrl(path) {
  if (!path) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//.test(path)) return path;

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  if (!base) {
    console.warn(
      "VITE_API_URL is not set — image paths will be resolved relative to the current origin, which is probably wrong."
    );
  }

  // Make sure exactly one slash joins base + path, regardless of whether
  // `path` was stored with or without a leading slash.
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/* ---------- Badge ---------- */
function ProductBadges({ badges }) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10">
      {badges.map((b, i) => (
        <span
          key={i}
          className="text-[11px] font-semibold uppercase tracking-wide text-white px-2 py-[3px] rounded-sm"
          style={{ background: b.type === "new" ? "#ff5ea3" : "#7b3fe4" }}
        >
         
          {b.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- Rating ---------- */
function Rating({ value = 0 }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < value} />
      ))}
    </div>
  );
}

/* ---------- Price ---------- */
function Price({ price, salePrice }) {
  const safePrice = Number(price) || 0;
  const safeSalePrice = salePrice != null ? Number(salePrice) : null;

  if (safeSalePrice) {
    return (
      <p className="text-sm">
        <span className="text-[#7b3fe4] font-semibold">₹{safeSalePrice.toFixed(2)}</span>{" "}
        <span className="text-gray-400 line-through">₹{safePrice.toFixed(2)}</span>
      </p>
    );
  }
  return <p className="text-sm text-gray-800 font-medium">₹{safePrice.toFixed(2)}</p>;
}

/* ---------- Single Card ---------- */
function ProductCard({ product, onQuickView, onSelectOption }) {
  const [hovered, setHovered] = useState(false);
  const hasHoverImage = Boolean(product.hoverImage);

  // Wishlist state lives here, driven entirely by Redux, since this is
  // the component that actually has `product` in scope. Previously
  // `handleWishlist` and the `wishlisted` calculation were declared
  // outside any component (or in the grid, referencing an undefined
  // `product`), so `dispatch`/`product`/`wishlisted` didn't exist when
  // the click handler ran — that's why the button did nothing.
  const dispatch = useDispatch();
  const likes = useSelector((state) => state.likes.items);
  const wishlisted = likes.some((item) => (item._id ?? item) === product._id);
  
  const handleWishlist = () => {
    if (wishlisted) {
      dispatch(removeProductLike(product._id));
    } else {
      dispatch(addProductLike(product._id));
    }
  };

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative bg-[#f5f5f5] overflow-hidden aspect-[3/4]">
        <ProductBadges badges={product.badges} />

        {/* Primary image — fades out on hover if a second image is provided */}
        <img
          src={resolveImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
            hasHoverImage && hovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Secondary image — fades in on hover */}
        {hasHoverImage && (
          <img
            src={resolveImageUrl(product.hoverImage)}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Hover overlay action bar */}
        <div
          className={`absolute left-0 right-0 bottom-0 flex items-center transition-all duration-300 ease-out ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
          style={{ background: "#7b3fe4" }}
        >
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlist}
            className="flex items-center justify-center w-11 h-11 text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <HeartIcon filled={wishlisted} />
          </button>

          <Link
            to={`/product/${product._id}`}
            onClick={() => onSelectOption?.(product)}
            className="flex-1 h-11 text-white text-[13px] font-semibold uppercase tracking-wide hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
          >
            Select Option
          </Link>

          <button
            type="button"
            aria-label="Quick view"
            onClick={() => onQuickView?.(product)}
            className="flex items-center justify-center w-11 h-11 text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* Info area */}
      <div className="pt-3 text-center">
      <h3 className="w-full truncate text-sm text-[#2b2b2b] font-medium hover:text-[#7b3fe4] transition-colors cursor-pointer">
  {product.name}
</h3>
        <div className="mt-1">
          <Rating value={product.rating} />
        </div>

        <div className="mt-1.5">
          <Price price={product.price} salePrice={product.salePrice} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Grid (this is what you'll wire up to a backend later) ---------- */
export default function ProductGrid({ viewMoreHref = "/shop" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getProducts();
      setProducts(res.data ?? []);
    } catch (error) {
      console.error(error);
      setLoadError("We couldn't load products right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (product) => {
    // TODO: open quick-view modal with product details from backend
    console.log("Quick view:", product);
  };

  const handleSelectOption = (product) => {
    // TODO: open size/variant selector, then add to cart via backend
    console.log("Select option:", product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {loading ? (
        <p className="text-center text-sm text-gray-500 py-16">Loading products…</p>
      ) : loadError ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500 mb-3">{loadError}</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="text-sm font-medium text-white px-4 py-2 rounded-md transition-colors hover:opacity-90"
            style={{ background: "#7b3fe4" }}
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-16">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={handleQuickView}
              onSelectOption={handleSelectOption}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <a
          href={viewMoreHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90"
          style={{ background: "#7b3fe4" }}
        >
          View More Products
        </a>
      </div>
    </div>
  );
}