import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductLike,
  removeProductLike,
} from "../../redux/likeSlice";
/* =========================================================================
   ICONS
   ========================================================================= */
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
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
  </svg>
);
const ChevronDown = ({ className = "" }) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
  </svg>
);
const GridIcon = ({ size = "lg", active }) => {
  const cols = size === "lg" ? 2 : 3;
  const cells = Array.from({ length: cols * cols });
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      {cells.map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const gap = 1.5;
        const cell = (16 - gap * (cols + 1)) / cols;
        return (
          <rect
            key={i}
            x={gap + col * (cell + gap)}
            y={gap + row * (cell + gap)}
            width={cell}
            height={cell}
            rx="1"
            fill={active ? "#7b3fe4" : "#9ca3af"}
          />
        );
      })}
    </svg>
  );
};
const ListIcon = ({ active }) => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    {[1.5, 6.5, 11.5].map((y, i) => (
      <g key={i}>
        <rect x="0" y={y} width="3" height="3" rx="0.6" fill={active ? "#7b3fe4" : "#9ca3af"} />
        <rect x="5" y={y + 0.5} width="11" height="2" rx="1" fill={active ? "#7b3fe4" : "#9ca3af"} />
      </g>
    ))}
  </svg>
);
const XIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* =========================================================================
   IMAGE URL HELPER
   Carried over from ProductGrid.jsx — handles full URLs, relative API
   paths, and missing images without throwing or breaking the whole grid.
   ========================================================================= */
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

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/* =========================================================================
   FILTER DATA
   Fixed filter lists (as before) — Categories/Colour/Sizes/Tags always show
   these options regardless of what's currently in the fetched products.
   Swap these arrays for data fetched from your backend if you later add a
   dedicated filters endpoint (e.g. GET /api/filters).
   ========================================================================= */
const FILTER_DEFS = {
  categories: ["Fashion", "Men", "Women", "Kids", "Toys", "Cosmetics", "Furniture", "Book"],
  colors: ["White", "Blue", "Brown", "Black"],
  sizes: ["M", "L", "Xl", "S"],
  tags: ["Men", "Jacket", "Fashion", "Tops", "Pant", "Half Sleeve", "Full Sleeve", "Shirt", "Cosmetics", "Furniture", "Book"],
};

/* =========================================================================
   CHECKBOX GROUP  (Categories / Colour / Sizes)
   ========================================================================= */
function CheckboxGroup({ title, options, selected, onChange }) {
  if (!options || options.length === 0) return null;

  const allChecked = options.length > 0 && options.every((o) => selected.includes(o));

  const toggleAll = () => {
    onChange(allChecked ? [] : [...options]);
  };

  const toggleOne = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="py-5 border-b border-gray-100 first:pt-0">
      <h3 className="text-[15px] font-semibold text-[#2b2b2b] mb-3">{title}</h3>
      <div className="flex flex-col gap-2.5">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="w-4 h-4 rounded-[3px] border-gray-300 text-[#7b3fe4] focus:ring-[#7b3fe4]/40 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm text-[#2b2b2b] group-hover:text-[#7b3fe4] transition-colors">
            All {title}
          </span>
        </label>
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOne(option)}
              className="w-4 h-4 rounded-[3px] border-gray-300 text-[#7b3fe4] focus:ring-[#7b3fe4]/40 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-600 group-hover:text-[#7b3fe4] transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   TAG GROUP  (pill multi-select)
   ========================================================================= */
function TagGroup({ options, selected, onChange }) {
  if (!options || options.length === 0) return null;

  const toggleOne = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="py-5">
      <h3 className="text-[15px] font-semibold text-[#2b2b2b] mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleOne(tag)}
              aria-pressed={active}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-[#7b3fe4] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   SIDEBAR  (wraps all filter groups; used in desktop rail + mobile drawer)
   ========================================================================= */
function FilterSidebar({ filters, setFilters, onClear, activeCount }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-[#2b2b2b]">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-[#7b3fe4] hover:underline"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <CheckboxGroup
        title="Categories"
        options={FILTER_DEFS.categories}
        selected={filters.categories}
        onChange={(v) => setFilters((f) => ({ ...f, categories: v }))}
      />
      <CheckboxGroup
        title="Colour"
        options={FILTER_DEFS.colors}
        selected={filters.colors}
        onChange={(v) => setFilters((f) => ({ ...f, colors: v }))}
      />
      <CheckboxGroup
        title="Sizes"
        options={FILTER_DEFS.sizes}
        selected={filters.sizes}
        onChange={(v) => setFilters((f) => ({ ...f, sizes: v }))}
      />
      <TagGroup
        options={FILTER_DEFS.tags}
        selected={filters.tags}
        onChange={(v) => setFilters((f) => ({ ...f, tags: v }))}
      />
    </div>
  );
}

/* =========================================================================
   ACTIVE FILTER CHIPS  (shown above the grid so removal is one click away)
   ========================================================================= */
function ActiveChips({ filters, setFilters, search, setSearch }) {
  const chips = [
    ...filters.categories.map((v) => ({ group: "categories", value: v })),
    ...filters.colors.map((v) => ({ group: "colors", value: v })),
    ...filters.sizes.map((v) => ({ group: "sizes", value: v })),
    ...filters.tags.map((v) => ({ group: "tags", value: v })),
    ...(search ? [{ group: "search", value: `"${search}"` }] : []),
  ];

  if (chips.length === 0) return null;

  const remove = (chip) => {
    if (chip.group === "search") {
      setSearch("");
      return;
    }
    setFilters((f) => ({
      ...f,
      [chip.group]: f[chip.group].filter((v) => v !== chip.value),
    }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip, i) => (
        <span
          key={`${chip.group}-${chip.value}-${i}`}
          className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-[#f3edfc] text-[#7b3fe4] text-xs font-medium"
        >
          {chip.value}
          <button
            type="button"
            onClick={() => remove(chip)}
            aria-label={`Remove ${chip.value} filter`}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#7b3fe4]/15"
          >
            <XIcon />
          </button>
        </span>
      ))}
    </div>
  );
}

/* =========================================================================
   PRODUCT BADGES / RATING / PRICE  (shared by grid + list cards)
   ========================================================================= */
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

function Rating({ value = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < value} />
      ))}
    </div>
  );
}

/* =========================================================================
   COLOR SWATCHES
   Small clickable color circles shown under the product name (in place of
   the star rating). Clicking a swatch swaps the card's displayed image to
   that color variant's image — no navigation, no reload.

   Expects product.colors as an array of variants, e.g.:
     product.colors = [
       { name: "White", hex: "#e7e5e2", image: "/uploads/prod-1-white.jpg" },
       { name: "Black", hex: "#1a1a1a", image: "/uploads/prod-1-black.jpg" },
     ]
   If a product has no `colors` array, nothing renders and the card keeps
   using product.image exactly as before — fully backward compatible.
   ========================================================================= */
function ColorSwatches({ colors, activeIndex, onSelect }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-1.5">
      {colors.map((c, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={c.name ?? i}
            type="button"
            aria-label={`View ${c.name ?? "color"} variant`}
            aria-pressed={active}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect?.(i);
            }}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              active ? "ring-2 ring-offset-1 ring-[#7b3fe4]" : "ring-1 ring-offset-1 ring-gray-200"
            }`}
            style={{ background: c.hex ?? c.color ?? "#ccc" }}
          />
        );
      })}
    </div>
  );
}

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
  return <p className="text-sm text-gray-800 font-medium">${safePrice.toFixed(2)}</p>;
}

/* =========================================================================
   PRODUCT CARD — GRID VIEW
   ========================================================================= */
function ProductCardGrid({ product, onToggleWishlist, onQuickView, wishlisted, columns = 4 }) {
  const [hovered, setHovered] = useState(false);
  // Which color swatch is active; drives which image is shown.
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = product.colors?.[activeColorIndex];

  // Base (non-hover) image: the selected color variant's image if the
  // product has color variants, otherwise the product's default image —
  // identical to the old behavior when no `colors` array is present.
  const baseImage = activeColor?.image ?? product.image;
  const hoverImageSrc = activeColor?.hoverImage ?? product.hoverImage;
  const hasHoverImage = Boolean(hoverImageSrc);

  // Above 4 columns the cards get small (Andamen-style) — drop the name,
  // rating, price and badges and show just the photo.
  const showDetails = columns <= 4;

  return (
    <div
      className="group flex flex-col transition-all duration-300 ease-out"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative bg-[#f5f5f5] overflow-hidden aspect-[3/4] rounded-sm transition-all duration-300 ease-out">
        {showDetails && <ProductBadges badges={product.badges} />}

        <img
          src={resolveImageUrl(baseImage)}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
            hasHoverImage && hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        {hasHoverImage && (
          <img
            src={resolveImageUrl(hoverImageSrc)}
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

        <div
          className={`absolute left-0 right-0 bottom-0 flex items-center transition-all duration-300 ease-out ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
          style={{ background: "#7b3fe4" }}
        >
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => onToggleWishlist?.(product)}
            className="flex items-center justify-center w-11 h-11 text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <HeartIcon filled={wishlisted} />
          </button>

          <Link
            to={`/product/${product._id}`}
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

      {showDetails && (
        <div className="pt-3 text-center">
          <Link
            to={`/product/${product._id}`}
            className="text-sm text-[#2b2b2b] font-medium hover:text-[#7b3fe4] transition-colors cursor-pointer"
          >
            {product.name}
          </Link>
          <div className="mt-1.5 flex justify-center">
            <ColorSwatches
              colors={product.colors}
              activeIndex={activeColorIndex}
              onSelect={setActiveColorIndex}
            />
          </div>
          <div className="mt-1.5">
            <Price price={product.price} salePrice={product.salePrice} />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   PRODUCT CARD — LIST VIEW
   ========================================================================= */
function ProductCardList({ product, onToggleWishlist, onQuickView, wishlisted }) {
  return (
    <div className="flex gap-4 sm:gap-5 p-3 sm:p-4 rounded-md hover:bg-gray-50 transition-colors">
      <div className="relative bg-[#f5f5f5] overflow-hidden aspect-[3/4] w-24 sm:w-32 shrink-0 rounded-sm">
        <ProductBadges badges={product.badges} />
        <img
          src={resolveImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <Link
            to={`/product/${product._id}`}
            className="text-sm sm:text-base text-[#2b2b2b] font-medium hover:text-[#7b3fe4] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </Link>
          <div className="mt-1.5">
            <Rating value={product.rating} />
          </div>
          <div className="mt-1.5">
            <Price price={product.price} salePrice={product.salePrice} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => onToggleWishlist?.(product)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
              wishlisted ? "border-[#7b3fe4] text-[#7b3fe4]" : "border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4]"
            }`}
          >
            <HeartIcon filled={wishlisted} />
          </button>
          <button
            type="button"
            aria-label="Quick view"
            onClick={() => onQuickView?.(product)}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4] transition-colors"
          >
            <EyeIcon />
          </button>
          <Link
            to={`/product/${product._id}`}
            className="h-10 px-4 rounded-full text-white text-xs font-semibold uppercase tracking-wide transition-colors hover:opacity-90 whitespace-nowrap flex items-center justify-center"
            style={{ background: "#7b3fe4" }}
          >
            Select Option
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PRODUCT SIZE SLIDER  (Andamen-style — replaces the old Large/Small grid
   toggle buttons). 5 positions map to 2 → 6 columns. Desktop only; hidden
   on mobile per requirements, where the list button remains available.
   ========================================================================= */
function ProductSizeSlider({ gridColumns, setGridColumns, onActivateGrid }) {
  // position 1..5 maps to columns 2..6
  const position = gridColumns - 1;
  const percent = ((position - 1) / 4) * 100;

  return (
    <div className="hidden lg:flex items-center gap-3">
      <button
        type="button"
        aria-label="Grid view"
        onClick={onActivateGrid}
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-[#7b3fe4] transition-colors"
      >
        <GridIcon size="lg" active />
      </button>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={position}
        onChange={(e) => {
          onActivateGrid();
          setGridColumns(Number(e.target.value) + 1);
        }}
        aria-label="Adjust product grid size"
        className="w-32 h-[3px] appearance-none rounded-full cursor-pointer accent-[#7b3fe4] transition-all duration-300"
        style={{
          background: `linear-gradient(to right, #7b3fe4 0%, #7b3fe4 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}

/* =========================================================================
   TOOLBAR  (search, sort, result count, view toggle)
   ========================================================================= */
function Toolbar({
  search,
  setSearch,
  sort,
  setSort,
  view,
  setView,
  gridColumns,
  setGridColumns,
  resultCount,
  totalCount,
  onOpenMobileFilters,
}) {
  const sortOptions = [
    { value: "price-desc", label: "Price – High to Low" },
    { value: "price-asc", label: "Price – Low to High" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#2b2b2b]">Search</h2>
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-[#7b3fe4] border border-[#7b3fe4]/30 rounded-full px-3 py-1.5"
          >
            Filters
          </button>
        </div>

        <div className="relative w-full sm:w-auto sm:max-w-xs order-3 sm:order-none">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search here..."
            className="w-full sm:w-64 pl-3.5 pr-9 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none text-sm border border-gray-200 rounded-md pl-3 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7b3fe4]/30 focus:border-[#7b3fe4] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <p className="text-sm text-gray-500">
            Showing {resultCount === 0 ? 0 : 1} to {resultCount} of{" "}
            <span className="text-[#7b3fe4] font-medium">{totalCount}</span> result
            {totalCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ProductSizeSlider
            gridColumns={gridColumns}
            setGridColumns={setGridColumns}
            onActivateGrid={() => setView("grid")}
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`flex items-center justify-center w-8 h-8 rounded-md border transition-colors ${
                view === "list" ? "border-[#7b3fe4] bg-[#f3edfc]" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ListIcon active={view === "list"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PAGINATION
   ========================================================================= */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageList = () => {
    const pages = [];
    const addPage = (p) => pages.push(p);

    addPage(1);
    if (currentPage > 3) addPage("...");

    for (let p = currentPage - 1; p <= currentPage + 1; p++) {
      if (p > 1 && p < totalPages) addPage(p);
    }

    if (currentPage < totalPages - 2) addPage("...");
    if (totalPages > 1) addPage(totalPages);

    return pages;
  };

  const pages = getPageList();

  const baseBtn =
    "flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${baseBtn} border border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4] disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:cursor-not-allowed`}
      >
        <ChevronLeft />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-label={`Go to page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={`${baseBtn} ${
              p === currentPage
                ? "text-white shadow-sm"
                : "bg-gray-50 text-gray-500 hover:bg-[#f3edfc] hover:text-[#7b3fe4]"
            }`}
            style={p === currentPage ? { background: "#7b3fe4" } : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${baseBtn} border border-gray-200 text-gray-400 hover:text-[#7b3fe4] hover:border-[#7b3fe4] disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:cursor-not-allowed`}
      >
        <ChevronRight />
      </button>
    </nav>
  );
}

/* =========================================================================
   EMPTY STATE
   ========================================================================= */
function EmptyState({ onClear, hasActiveFilters }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-14 h-14 rounded-full bg-[#f3edfc] flex items-center justify-center text-[#7b3fe4] mb-4">
        <SearchIcon />
      </div>
      <h3 className="text-base font-semibold text-[#2b2b2b] mb-1">
        {hasActiveFilters ? "No products match these filters" : "No products yet"}
      </h3>
      {hasActiveFilters && (
        <>
          <p className="text-sm text-gray-500 mb-4">Try removing a filter or searching a different term.</p>
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-white px-4 py-2 rounded-md transition-colors hover:opacity-90"
            style={{ background: "#7b3fe4" }}
          >
            Clear all filters
          </button>
        </>
      )}
    </div>
  );
}

/* =========================================================================
   CONSTANTS
   ========================================================================= */
const EMPTY_FILTERS = { categories: [], colors: [], sizes: [], tags: [] };
const PAGE_SIZE = 8;

/* =========================================================================
   MAIN SHOP PAGE
   Fetches real products via getProducts() (same service used by
   ProductGrid.jsx). Filtering, search, sort and pagination all happen
   client-side over the fetched list.
   ========================================================================= */
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);


  const dispatch = useDispatch();

  const likes = useSelector((state) => state.likes.items);






  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-desc");
  // view: "grid" | "list"
  const [view, setView] = useState("grid");
  // gridColumns: 2 → 6, driven by the Andamen-style size slider (desktop only)
  const [gridColumns, setGridColumns] = useState(4);
  const [wishlist, setWishlist] = useState(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Track breakpoint so the slider only controls columns on desktop (lg+),
  // matching the "hide slider on mobile" requirement while keeping the
  // grid responsive on smaller screens.
  const [breakpoint, setBreakpoint] = useState("desktop");

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");

    const updateBreakpoint = () => {
      if (mqLg.matches) setBreakpoint("desktop");
      else if (mqSm.matches) setBreakpoint("tablet");
      else setBreakpoint("mobile");
    };

    updateBreakpoint();
    mqLg.addEventListener("change", updateBreakpoint);
    mqSm.addEventListener("change", updateBreakpoint);
    return () => {
      mqLg.removeEventListener("change", updateBreakpoint);
      mqSm.removeEventListener("change", updateBreakpoint);
    };
  }, []);

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

  const activeFilterCount =
    filters.categories.length + filters.colors.length + filters.sizes.length + filters.tags.length;

  // ---- Filtering + search + sort (client-side) ----
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchesColor =
        filters.colors.length === 0 || filters.colors.includes(p.color);
      const matchesSize =
        filters.sizes.length === 0 || filters.sizes.includes(p.size);
      const matchesTags =
        filters.tags.length === 0 || filters.tags.some((t) => p.tags?.includes(t));
      const matchesSearch =
        search.trim() === "" ||
        (p.name ?? "").toLowerCase().includes(search.trim().toLowerCase());

      return matchesCategory && matchesColor && matchesSize && matchesTags && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      const priceA = Number(a.salePrice ?? a.price) || 0;
      const priceB = Number(b.salePrice ?? b.price) || 0;
      switch (sort) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "newest":
          return new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [products, filters, search, sort]);

  // ---- Pagination derived from the filtered list ----
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  const goToPage = (page) => {
    setCurrentPage(page);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setCurrentPage(1);
  };

  // Reset to page 1 whenever filters, search, or sort change.
  const filtersKey = JSON.stringify(filters) + search + sort;
  const [lastFiltersKey, setLastFiltersKey] = useState(filtersKey);
  if (filtersKey !== lastFiltersKey) {
    setLastFiltersKey(filtersKey);
    if (currentPage !== 1) setCurrentPage(1);
  }
  const toggleWishlist = (product) => {
    const liked = likes.some(
      (item) => item._id === product._id
    );
  
    if (liked) {
      dispatch(removeProductLike(product._id));
    } else {
      dispatch(addProductLike(product._id));
    }
  };
  // const toggleWishlist = (product) => {
  //   setWishlist((prev) => {
  //     const next = new Set(prev);
  //     next.has(product._id) ? next.delete(product._id) : next.add(product._id);
  //     return next;
  //   });
  //   // TODO: call backend e.g. api.toggleWishlist(product._id)
  // };

  const handleQuickView = (product) => {
    // TODO: open quick-view modal with product details from backend
    console.log("Quick view:", product);
  };

  // Effective column count: the slider (gridColumns, 2–6) only drives the
  // layout on desktop. Tablet/mobile fall back to sensible fixed values
  // since the slider is hidden below the lg breakpoint.
  const effectiveColumns =
    breakpoint === "desktop" ? gridColumns : breakpoint === "tablet" ? 3 : 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8 lg:gap-10">
        {/* ---- Desktop sidebar ---- */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              activeCount={activeFilterCount}
            />
          </div>
        </aside>

        {/* ---- Main column ---- */}
        <div className="flex-1 min-w-0">
          <Toolbar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            view={view}
            setView={setView}
            gridColumns={gridColumns}
            setGridColumns={setGridColumns}
            resultCount={paginatedProducts.length}
            totalCount={filteredProducts.length}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          />

          <ActiveChips filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />

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
          ) : filteredProducts.length === 0 ? (
            <EmptyState onClear={clearFilters} hasActiveFilters={activeFilterCount > 0 || search.trim() !== ""} />
          ) : view === "list" ? (
            <div className="flex flex-col divide-y divide-gray-100">
              {paginatedProducts.map((product) => (
                <ProductCardList
                  key={product._id}
                  product={product}
                  wishlisted={likes.some(
                    (item) => item._id === product._id
                  )}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          ) : (
            <div
              className="grid gap-x-5 gap-y-8 transition-all duration-300 ease-out"
              style={{ gridTemplateColumns: `repeat(${effectiveColumns}, minmax(0,1fr))` }}
            >
              {paginatedProducts.map((product) => (
                <ProductCardGrid
                  key={product._id}
                  product={product}
                  columns={effectiveColumns}
                  wishlisted={likes.some(
                    (item) => item._id === product._id
                  )}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}

          {!loading && !loadError && filteredProducts.length > 0 && (
            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </div>
      </div>

      {/* ---- Mobile filters drawer ---- */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
              >
                <XIcon />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              activeCount={activeFilterCount}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-4 py-3 rounded-md text-white text-sm font-semibold"
              style={{ background: "#7b3fe4" }}
            >
              Show {filteredProducts.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}