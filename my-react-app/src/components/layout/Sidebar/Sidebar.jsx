import { useState, useEffect } from "react";
import { getSliders } from "../../../services/sliderService";

const ChevronUp = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function FloneSlider() {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await getSliders();
      setSliders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const goTo = (dir) => {
    if (animating || sliders.length === 0) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(prev =>
        dir === "down"
          ? (prev + 1) % sliders.length
          : (prev - 1 + sliders.length) % sliders.length
      );
      setAnimating(false);
    }, 350);
  };

  if (sliders.length === 0) {
    return (
      <div
        className="flex items-center justify-center font-sans h-[380px] sm:h-[532px]"
        style={{ backgroundColor: "#e8e0f5" }}
      >
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const slide = sliders[current];

  const slideClass = animating
    ? animDir === "down" ? "animate-slide-out-up" : "animate-slide-out-down"
    : "animate-slide-in";

  return (
    <>
      <style>{`
        @keyframes slideInFromDown {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromUp {
          from { opacity: 0; transform: translateY(-40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutUp {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-40px); }
        }
        @keyframes slideOutDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(40px); }
        }
        .animate-slide-in        { animation: slideInFromDown 0.35s ease forwards; }
        .animate-slide-out-up    { animation: slideOutUp 0.35s ease forwards; }
        .animate-slide-out-down  { animation: slideOutDown 0.35s ease forwards; }

        .btn-fill {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 0;
        }
        .btn-fill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #A749FF;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }
        .btn-fill:hover::before { transform: translateX(0); }
        .btn-fill:not(:hover)::before {
          transform: translateX(101%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-fill:hover { color: #fff; border-color: #A749FF; }
      `}</style>

      <div className="font-sans">
        <div
          className="relative overflow-hidden h-auto sm:h-[532px] pb-6 sm:pb-0"
          style={{ backgroundColor: "#e8e0f5" }}
        >
          {/* Slide content */}
          <div
            key={slide._id}
            className={`relative sm:absolute sm:inset-0 flex flex-col sm:flex-row items-center justify-center sm:justify-start ${slideClass}`}
          >
            {/* Text — left side on desktop, top on mobile */}
            <div className="order-1 w-full sm:w-[600px] px-6 pt-8 sm:pt-0 sm:pl-24 sm:px-0 z-10 text-center sm:text-left">
              <p
                className="mb-1.5 sm:mb-6 whitespace-pre-line text-xs sm:text-[18px]"
                style={{
                  fontFamily: "'Jost', 'Poppins', 'Inter', sans-serif",
                  fontWeight: 500,
                  lineHeight: "1.4",
                  letterSpacing: "0px",
                  color: "#111111",
                }}
              >
                {slide.title}
              </p>
              <h1
                className="text-[26px] sm:text-[72px] font-light leading-[1.2] sm:leading-[1.2] tracking-[-0.5px] sm:tracking-[-2px] text-[#111111] mb-4 sm:mb-10 whitespace-pre-line"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 300,
                }}
              >
                {slide.subtitle}
              </h1>
              <button className="btn-fill px-6 py-2 sm:px-10 sm:py-3 border-2 border-gray-900 text-gray-900 text-[10px] sm:text-xs font-bold tracking-[0.2em]">
                {slide.buttonText}
              </button>
            </div>

            {/* Image — below text on mobile, with its own flanking arrows; right half on desktop */}
            <div className="order-2 relative block sm:hidden w-full h-[210px] mt-6 px-10">
              <img
               src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${slide.image}`}
                alt={slide.imageAlt}
                className="h-full w-full object-contain object-center"
                onError={e => { e.target.src = "https://via.placeholder.com/400x400?text=Image"; }}
              />
              <button
                onClick={() => goTo("up")}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition bg-white/60 hover:bg-white rounded-full shadow"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo("down")}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition bg-white/60 hover:bg-white rounded-full shadow"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="hidden sm:block absolute right-0 top-0 w-1/2 h-full">
              <img
              src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${slide.image}`}
                alt={slide.imageAlt}
                className="h-full w-full object-contain object-center"
                onError={e => { e.target.src = "https://via.placeholder.com/400x400?text=Image"; }}
              />
            </div>
          </div>

          {/* Left arrow — desktop only, mobile has its own arrows on the image */}
          <button
            onClick={() => goTo("up")}
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center text-gray-500 hover:text-gray-900 transition bg-white/60 hover:bg-white rounded-full shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow — desktop only */}
          <button
            onClick={() => goTo("down")}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center text-gray-500 hover:text-gray-900 transition bg-white/60 hover:bg-white rounded-full shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Up / Down buttons */}
          <div className="hidden sm:flex absolute right-16 bottom-5 flex-col gap-1">
            <button
              onClick={() => goTo("up")}
              className="w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-gray-700 shadow rounded transition"
            >
              <ChevronUp />
            </button>
            <button
              onClick={() => goTo("down")}
              className="w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-gray-700 shadow rounded transition"
            >
              <ChevronDown />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnimDir("down"); setCurrent(i); }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                  i === current ? "bg-gray-800 w-4 sm:w-5" : "w-1.5 sm:w-2 bg-gray-400/60"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}