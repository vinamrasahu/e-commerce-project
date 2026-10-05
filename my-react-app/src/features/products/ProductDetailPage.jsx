import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import FloneNavbar from "../../components/layout/Navbar";
import FloneFooter from "../../components/layout/Footer/Footer";

import { addToCart } from "../cart/cartThunk";

import { createNotification } from "../notification/notificationThunk";
/* =========================================================================
   ICONS
   ========================================================================= */
const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill={filled ? "#f4c542" : "none"} stroke={filled ? "#f4c542" : "#d1d5db"} strokeWidth="1">
    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
  </svg>
);
const ShareIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M21 12H9a5 5 0 00-5 5v1" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg className="w-[18px] h-[18px]" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const CompareIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h11M15 3l3 4-3 4M17 17H6M9 21l-3-4 3-4" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M5 12h14" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
  </svg>
);
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.5 21v-7h2.4l.4-2.7h-2.8V9.4c0-.8.2-1.3 1.4-1.3h1.5V5.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.3-3.8 3.8v2h-2.5v2.7h2.5v7h3.2z" />
  </svg>
);
const PinterestIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.5 2 3 5.6 3 9.8c0 2.3 1.2 4 3 4.6.2.1.4 0 .5-.3l.3-1.2c.1-.2 0-.4-.1-.6-.4-.5-.7-1.3-.7-2.3 0-3 2.3-5.7 6-5.7 3.3 0 5.1 2 5.1 4.6 0 3.5-1.6 6.4-3.9 6.4-1.3 0-2.2-1-1.9-2.4.4-1.5 1.1-3.2 1.1-4.3 0-1-.5-1.8-1.6-1.8-1.3 0-2.3 1.3-2.3 3 0 1.1.4 1.8.4 1.8s-1.3 5.6-1.6 6.6c-.4 1.8-.1 3.9 0 4.1.1.1.2.1.3 0 .2-.2 2.1-2.6 2.7-4.9.2-.6.9-3.6.9-3.6.5.9 1.8 1.6 3.2 1.6 4.2 0 7-3.8 7-8.9C21.4 5.4 17.6 2 12 2z" />
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.6.8-2.6 1-.7-.8-1.8-1.3-2.9-1.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9-3.3-.2-6.2-1.8-8.2-4.2-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.8-.5 0 1.9 1.4 3.6 3.2 4-.4.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.8-5.1 1.8-.3 0-.7 0-1-.1 1.8 1.2 4 1.8 6.3 1.8 7.5 0 11.6-6.3 11.6-11.7v-.5c.8-.5 1.5-1.3 2-2.1z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.5 9h3V19h-3V9zM6 7.5C5 7.5 4.2 6.7 4.2 5.8S5 4 6 4s1.8.7 1.8 1.7S7 7.5 6 7.5zM9.5 9h2.9v1.4h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.6 2 3.6 4.6V19h-3v-4.8c0-1.2 0-2.6-1.6-2.6-1.6 0-1.9 1.3-1.9 2.6V19h-3V9z" />
  </svg>
);
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/* =========================================================================
   MEDIA URL HELPER
   ========================================================================= */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";

function resolveImageUrl(path) {
  if (!path) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//.test(path)) return path;

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function resolveMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/* =========================================================================
   BREADCRUMB
   ========================================================================= */
function Breadcrumb({ path }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-[#f7f7f7] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
        <ol className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wide flex-wrap">
          {path.map((item, i) => {
            const isLast = i === path.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-400">/</span>}
                {isLast || !item.href ? (
                  <span className="text-gray-500">{item.label}</span>
                ) : (
                  <a href={item.href} className="text-[#2b2b2b] hover:text-[#7b3fe4] transition-colors">
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/* =========================================================================
   MEDIA GALLERY (images + videos)
   ========================================================================= */
function MediaGallery({ images, videos, badge }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageItems = (images && images.length > 0 ? images : []).map((src) => ({
    type: "image",
    src,
  }));
  const videoItems = (videos && videos.length > 0 ? videos : [])
    .map((src) => ({ type: "video", src }))
    .filter((item) => resolveMediaUrl(item.src));

  const media = [...imageItems, ...videoItems];
  const safeMedia = media.length > 0 ? media : [{ type: "image", src: null }];
  const hasMultiple = safeMedia.length > 1;
  const activeItem = safeMedia[activeIndex] ?? safeMedia[0];

  const goPrev = () => setActiveIndex((i) => (i === 0 ? safeMedia.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === safeMedia.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="relative bg-[#f5f5f5] overflow-hidden aspect-square sm:aspect-[4/3.6]">
        {badge && (
          <span
            className="absolute top-3 left-3 z-10 text-[11px] font-semibold uppercase tracking-wide text-white px-2.5 py-1 rounded-sm"
            style={{ background: "#ff5ea3" }}
          >
            {badge}
          </span>
        )}

        {activeItem.type === "video" ? (
          <video
            key={activeItem.src}
            src={resolveMediaUrl(activeItem.src)}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img
            src={resolveImageUrl(activeItem.src)}
            alt={`Product image ${activeIndex + 1}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
            className="w-full h-full object-contain"
          />
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous item"
              onClick={goPrev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:text-[#7b3fe4] shadow-sm transition-colors"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next item"
              onClick={goNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:text-[#7b3fe4] shadow-sm transition-colors"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-3 sm:mt-4">
          {safeMedia.map((item, i) => (
            <button
              key={`${item.type}-${i}`}
              type="button"
              aria-label={item.type === "video" ? `Play video ${i + 1}` : `View image ${i + 1}`}
              aria-pressed={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={`relative bg-[#f5f5f5] overflow-hidden aspect-square rounded-sm transition-all ${
                i === activeIndex ? "ring-2 ring-[#7b3fe4]" : "ring-1 ring-gray-100 hover:ring-gray-300"
              }`}
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={resolveMediaUrl(item.src)}
                    className="w-full h-full object-contain bg-black"
                    muted
                    preload="metadata"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <PlayIcon />
                  </span>
                </>
              ) : (
                <img
                  src={resolveImageUrl(item.src)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                  className="w-full h-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   RATING
   ========================================================================= */
function Rating({ value = 0, reviewCount = 0, onJumpToReviews }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < Math.round(value)} />
        ))}
      </div>
      <span className="text-gray-300">|</span>
      <button
        type="button"
        onClick={onJumpToReviews}
        className="text-[#7b3fe4] hover:underline"
      >
        {reviewCount} Review{reviewCount === 1 ? "" : "s"}
      </button>
    </div>
  );
}

/* =========================================================================
   COLOR SWATCHES
   ========================================================================= */
function ColorSwatches({ colors, selected, onSelect }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div className="py-4 border-t border-gray-100">
      <h3 className="text-sm font-semibold text-[#2b2b2b] mb-2.5">Color</h3>
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            aria-label={color.label}
            aria-pressed={selected === color.value}
            onClick={() => onSelect(color.value)}
            className={`w-6 h-6 rounded-sm border transition-all ${
              selected === color.value ? "ring-2 ring-offset-1 ring-[#7b3fe4]" : "border-gray-300"
            }`}
            style={{ background: color.hex }}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SIZE SELECTOR
   ========================================================================= */
function SizeSelector({ sizes, selected, onSelect }) {
  if (!sizes || sizes.length === 0) return null;
  return (
    <div className="py-4 border-t border-gray-100">
      <h3 className="text-sm font-semibold text-[#2b2b2b] mb-2.5">Size</h3>
      <div className="flex items-center gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={selected === size}
            onClick={() => onSelect(size)}
            className={`min-w-[2.25rem] h-9 px-2 rounded-sm text-sm font-medium border transition-colors ${
              selected === size
                ? "bg-[#7b3fe4] text-white border-[#7b3fe4]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#7b3fe4] hover:text-[#7b3fe4]"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   PURCHASE ROW
   ========================================================================= */
function PurchaseRow({ quantity, setQuantity, onAddToCart, wishlisted, onToggleWishlist, onCompare,onShare }) {
  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  return (
    <div className="flex flex-wrap items-center gap-3 py-5 border-t border-gray-100">
      <div className="flex items-center border border-gray-200 rounded-sm h-11">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={dec}
          className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-[#7b3fe4] transition-colors"
        >
          <MinusIcon />
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={inc}
          className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-[#7b3fe4] transition-colors"
        >
          <PlusIcon />
        </button>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        className="h-11 px-6 sm:px-8 rounded-sm text-white text-sm font-semibold uppercase tracking-wide bg-[#2b2b2b] hover:bg-[#7b3fe4] transition-colors"
      >
        Add to Cart
      </button>

      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={onToggleWishlist}
        className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${
          wishlisted ? "border-[#7b3fe4] text-[#7b3fe4]" : "border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4]"
        }`}
      >
        <HeartIcon filled={wishlisted} />
      </button>

      <button
        type="button"
        aria-label="Add to compare"
        onClick={onCompare}
        className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4] transition-colors"
      >
        <CompareIcon />
      </button>

      <button
        type="button"
        aria-label="Share this product"
        onClick={onShare}
        className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4] transition-colors"
      >
        <ShareIcon />
      </button>
    </div>
  );
}

/* =========================================================================
   NOTIFY-ME ROW (shown instead of PurchaseRow when out of stock)
   ========================================================================= */
function NotifyRow({ loading, success, onNotify }) {
  return (
    <div className="py-5 border-t border-gray-100">
      <button
        type="button"
        onClick={onNotify}
        disabled={loading || success}
        className="w-full h-11 rounded-sm text-white text-sm font-semibold uppercase tracking-wide bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {loading
          ? "Subscribing..."
          : success
          ? "✓ You're Subscribed"
          : "🔔 Notify Me When Available"}
      </button>
    </div>
  );
}

/* =========================================================================
   PRODUCT META
   ========================================================================= */
function ProductMeta({ categories, tags }) {
  return (
    <div className="py-5 border-t border-gray-100 space-y-2">
      {categories?.length > 0 && (
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#2b2b2b]">Categories: </span>
          {categories.join(", ")}
        </p>
      )}
      {tags?.length > 0 && (
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#2b2b2b]">Tag: </span>
          {tags.join(", ")}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2 text-gray-400">
        <a href="#" aria-label="Share on Facebook" className="hover:text-[#7b3fe4] transition-colors"><FacebookIcon /></a>
        <a href="#" aria-label="Share on Pinterest" className="hover:text-[#7b3fe4] transition-colors"><PinterestIcon /></a>
        <a href="#" aria-label="Share on Twitter" className="hover:text-[#7b3fe4] transition-colors"><TwitterIcon /></a>
        <a href="#" aria-label="Share on LinkedIn" className="hover:text-[#7b3fe4] transition-colors"><LinkedInIcon /></a>
      </div>
    </div>
  );
}

/* =========================================================================
   PRICE
   ========================================================================= */
function Price({ price, salePrice }) {
  const safePrice = Number(price) || 0;
  const safeSalePrice = salePrice != null ? Number(salePrice) : null;

  if (safeSalePrice) {
    return (
      <p className="text-xl sm:text-2xl font-semibold">
        <span className="text-[#7b3fe4]">₹{safeSalePrice.toFixed(2)}</span>{" "}
        <span className="text-gray-400 line-through text-lg">₹{safePrice.toFixed(2)}</span>
      </p>
    );
  }
  return <p className="text-xl sm:text-2xl font-semibold text-[#2b2b2b]">₹{safePrice.toFixed(2)}</p>;
}

/* =========================================================================
   PRODUCT TABS
   ========================================================================= */
function ProductTabs({ additionalInfo, description, reviews }) {
  const [activeTab, setActiveTab] = useState("additional");

  const tabs = [
    { id: "additional", label: "Additional information" },
    { id: "description", label: "Description" },
    { id: "reviews", label: `Reviews (${reviews?.length ?? 0})` },
  ];

  return (
    <div className="mt-12 sm:mt-16" id="product-reviews">
      <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-3 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "text-[#2b2b2b]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#2b2b2b]" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-6 sm:pt-8">
        {activeTab === "additional" && (
          additionalInfo.length === 0 ? (
            <p className="text-sm text-gray-500">No additional information available.</p>
          ) : (
            <dl className="space-y-3">
              {additionalInfo.map((row) => (
                <div key={row.label} className="flex flex-col sm:flex-row sm:gap-8 text-sm">
                  <dt className="font-semibold text-[#2b2b2b] w-40 shrink-0">{row.label}</dt>
                  <dd className="text-gray-500">{row.value}</dd>
                </div>
              ))}
            </dl>
          )
        )}

        {activeTab === "description" && (
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {description || "No description available."}
          </p>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6 max-w-3xl">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            ) : (
              reviews.map((review, i) => (
                <div key={i} className="pb-5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <StarIcon key={s} filled={s < review.rating} />
                    ))}
                    <span className="text-sm font-semibold text-[#2b2b2b] ml-1">{review.author}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   LOADING / NOT-FOUND / ERROR STATES
   ========================================================================= */
function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#7b3fe4] border-t-transparent animate-spin mb-4" />
      <p className="text-sm text-gray-500">Loading product…</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-[#2b2b2b]">Product Not Found</h1>
      <a href="/" className="mt-4 inline-block text-[#7b3fe4] hover:underline">
        Back to Home
      </a>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-[#2b2b2b]">Couldn't load this product</h1>
      <p className="text-sm text-gray-500 mt-2 mb-5">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-sm font-medium text-white px-4 py-2 rounded-md transition-colors hover:opacity-90"
        style={{ background: "#7b3fe4" }}
      >
        Retry
      </button>
    </div>
  );
}

/* =========================================================================
   MAIN PRODUCT DETAIL PAGE
   ========================================================================= */
export default function ProductDetailPage({ breadcrumbPath }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [fetchKey, setFetchKey] = useState(0); // bump to retry

  // Selection state — re-initialized whenever the loaded product changes.
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const {
    loading: notificationLoading,
    success: notificationSuccess,
    error: notificationError,
  } = useSelector((state) => state.notification);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setLoadError(null);
      setNotFound(false);

      try {
        const res = await getProductById(id);
        const data = res.data ?? null;

        if (cancelled) return;

        if (!data) {
          setNotFound(true);
          setProduct(null);
        } else {
          setProduct(data);
          setSelectedColor(data.colors?.[0]?.value ?? null);
          setSelectedSize(data.sizes?.[0] ?? null);
          setQuantity(1);
          setWishlisted(false);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        if (!cancelled) {
          if (error?.response?.status === 404) {
            setNotFound(true);
          } else {
            setLoadError("Something went wrong while loading this product.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, fetchKey]);

  if (loading) return <LoadingState />;
  if (loadError) return <ErrorState message={loadError} onRetry={() => setFetchKey((k) => k + 1)} />;
  if (notFound || !product) return <NotFoundState />;

  const crumbPath = breadcrumbPath ?? [
    { label: "Home", href: "/" },
    { label: product.name },
  ];

  const badge = product.badges?.[0]?.label ?? null;

  const categories = product.categories
    ? product.categories
    : product.category
    ? [product.category]
    : [];

  const inStock = (product.stock ?? 0) > 0;

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
          size: selectedSize,
        })
      ).unwrap();

      alert("Product added successfully");
    } catch (err) {
      alert(err);
    }
  };
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    };
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // user cancelled or share failed — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      } catch {
        alert("Unable to share on this browser");
      }
    }
  };
  // Just fires the notification subscribe request — the button's own
  // loading/success text comes from Redux state (notificationLoading /
  // notificationSuccess), so this function doesn't need to render anything.
  const handleNotify = async () => {
    try {
      await dispatch(createNotification(product._id)).unwrap();
      alert("We'll notify you when this product is back in stock.");
    } catch (err) {
      alert(err);
    }
  };

  const handleCompare = () => {
    console.log("Add to compare:", product._id ?? product.id);
    // TODO: call backend e.g. api.addToCompare(productId)
  };

  const scrollToReviews = () => {
    document.getElementById("product-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <FloneNavbar />
      <div>
        <Breadcrumb path={crumbPath} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <MediaGallery images={product.images} videos={product.videos} badge={badge} />

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#2b2b2b] mb-2">{product.name}</h1>

              <div className="mb-3">
                <Price price={product.price} salePrice={product.salePrice} />
              </div>

              <Rating
                value={product.rating}
                reviewCount={product.reviews?.length ?? 0}
                onJumpToReviews={scrollToReviews}
              />

              <p className="text-sm text-gray-500 leading-relaxed mt-4 max-w-prose">
                {product.description}
              </p>

              <ColorSwatches
                colors={product.colors}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />

              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />

              {inStock ? (
             <PurchaseRow
             quantity={quantity}
             setQuantity={setQuantity}
             onAddToCart={handleAddToCart}
             wishlisted={wishlisted}
             onToggleWishlist={() => setWishlisted((w) => !w)}
             onCompare={handleCompare}
             onShare={handleShare}
           />
              ) : (
                <NotifyRow
                  loading={notificationLoading}
                  success={notificationSuccess}
                  onNotify={handleNotify}
                />
              )}

              <ProductMeta categories={categories} tags={product.tags} />
            </div>
          </div>

          <ProductTabs
            additionalInfo={product.additionalInfo ?? []}
            description={product.description}
            reviews={product.reviews ?? []}
          />
        </div>
      </div>
      <FloneFooter />
    </>
  );
}