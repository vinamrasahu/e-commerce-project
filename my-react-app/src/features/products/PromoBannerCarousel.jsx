import { useState, useEffect, useRef, useCallback } from "react";

/* =========================================================================
   PERCENT ICON  (the swirly % on the right of each banner)
   ========================================================================= */
const PercentIcon = () => (
  <svg
    className="w-10 h-10 sm:w-14 sm:h-14 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#percentGradient)"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <defs>
      <linearGradient id="percentGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff5ea3" />
        <stop offset="50%" stopColor="#7b3fe4" />
        <stop offset="100%" stopColor="#4fc3f7" />
      </linearGradient>
    </defs>
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="17" cy="17" r="2.5" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

/* =========================================================================
   DEFAULT BANNERS
   Swap/extend this array (or pass your own via the `banners` prop) —
   this is the only thing you need to touch to add a new promo.
   ========================================================================= */
export const DEFAULT_BANNERS = [
  {
    id: 1,
    title: "Get 25% Off",
    subtitle: "Up To \u20b9200 Off*",
    code: "MYNTRASAVE",
    note: "On Your First Order | T&C Apply",
    bg: "linear-gradient(90deg, #fde9d0 0%, #fbdcd6 100%)",
  },
  {
    id: 2,
    title: "Flat 40% Off",
    subtitle: "On Orders Above \u20b9999",
    code: "SAVE40",
    note: "Valid For New & Existing Users | T&C Apply",
    bg: "linear-gradient(90deg, #d9f0ff 0%, #e3dcfb 100%)",
  },
  {
    id: 3,
    title: "Free Shipping",
    subtitle: "No Minimum Order Value",
    code: "FREESHIP",
    note: "On All Prepaid Orders | T&C Apply",
    bg: "linear-gradient(90deg, #d9f7e6 0%, #d0f0f5 100%)",
  },
];

/* =========================================================================
   ONE SLIDE  (ticket-style card)
   ========================================================================= */
function BannerSlide({ banner }) {
  return (
    <div className="w-full shrink-0 px-1 sm:px-1.5">
      <div
        className="relative flex items-center justify-between gap-3 sm:gap-6 rounded-2xl px-5 sm:px-10 py-4 sm:py-6 overflow-hidden"
        style={{ background: banner.bg }}
      >
        {/* ticket notches */}
        <span className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
        <span className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />

        {/* left: headline */}
        <div className="min-w-0">
          <p className="text-lg sm:text-3xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff7a3d] to-[#ff5ea3]">
              {banner.title}
            </span>
          </p>
          <p className="text-xs sm:text-lg font-semibold text-[#2b2b2b] mt-0.5 truncate">
            {banner.subtitle}
          </p>
        </div>

        {/* middle: coupon code, hidden on very small screens */}
        <div className="hidden xs:flex sm:flex flex-col items-center bg-white rounded-lg px-3 sm:px-6 py-1.5 sm:py-3 shadow-sm shrink-0">
          <span className="text-[9px] sm:text-[11px] font-semibold text-gray-400 tracking-wide leading-none">
            COUPON
            <br className="sm:hidden" /> CODE
          </span>
          <span className="text-sm sm:text-2xl font-extrabold text-[#2b2b2b] tracking-wide whitespace-nowrap">
            {banner.code}
          </span>
        </div>

        {/* right: percent icon + note (note hidden on mobile) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <p className="hidden md:block text-xs text-gray-500 max-w-[140px] text-right">
            {banner.note}
          </p>
          <PercentIcon />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROMO BANNER CAROUSEL
   Auto-scrolls through `banners` every `interval` ms, pauses on hover,
   supports swipe on touch, and shows dot navigation.
   Drop it right under your <Navbar /> — it's full-width and responsive.
   ========================================================================= */
export default function PromoBannerCarousel({ banners = DEFAULT_BANNERS, interval = 4000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const count = banners.length;

  const goTo = useCallback(
    (i) => setIndex(((i % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [paused, count, interval]);

  if (!banners || banners.length === 0) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) goTo(index - 1);
    else if (delta < -40) goTo(index + 1);
    touchStartX.current = null;
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((banner) => (
            <BannerSlide key={banner.id} banner={banner} />
          ))}
        </div>

        {count > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Go to banner ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-[#7b3fe4]" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}