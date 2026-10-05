import React from "react";

const badges = [
  {
    id: "shipping",
    titlePlain: "Free",
    titleAccent: "Shipping",
    subtitle: "Free shipping on all order",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" className="w-full h-full">
        <rect x="6" y="22" width="32" height="18" rx="1.5" />
        <path d="M38 28h10l8 8v6H38z" />
        <circle cx="20" cy="46" r="5" fill="#fff" />
        <circle cx="48" cy="46" r="5" fill="#fff" />
        <rect x="13" y="14" width="13" height="9" rx="1" fill="#fff" strokeWidth="2" />
        <path d="M19.5 14v9M13 18.5h13" strokeWidth="1.6" />
        <path d="M14 12l-3-3M25 12l3-3" strokeWidth="1.6" />
        <text x="19.5" y="20.5" fontSize="5.5" fontWeight="700" stroke="none" fill="#e0732a" textAnchor="middle" fontFamily="Arial, sans-serif">
          FREE
        </text>
      </svg>
    ),
  },
  {
    id: "support",
    titlePlain: "Support",
    titleAccent: "24/7",
    subtitle: "Support 24 hours a day",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" className="w-full h-full">
        <circle cx="32" cy="34" r="22" />
        <path d="M32 34V20M32 34l9 6" />
        <path d="M14 19l-5-2 1-5M50 19l5-2-1-5" strokeWidth="2" />
        <text x="32" y="38" fontSize="11" fontWeight="700" stroke="none" fill="currentColor" textAnchor="middle" fontFamily="Arial, sans-serif">
          24
        </text>
      </svg>
    ),
  },
  {
    id: "return",
    titlePlain: "Money",
    titleAccent: "Return",
    subtitle: "30 days for free return",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" className="w-full h-full">
        <circle cx="32" cy="32" r="24" />
        <circle cx="32" cy="32" r="16" />
        <text x="32" y="36.5" fontSize="13" fontWeight="700" stroke="none" fill="currentColor" textAnchor="middle" fontFamily="Arial, sans-serif">
          $
        </text>
      </svg>
    ),
  },
  {
    id: "discount",
    titlePlain: "Order",
    titleAccent: "Discount",
    subtitle: "10% off on your first order",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" className="w-full h-full">
        <path d="M32 6 L40 12 L49 11 L52 20 L60 25 L56 33 L60 41 L52 46 L49 55 L40 54 L32 60 L24 54 L15 55 L12 46 L4 41 L8 33 L4 25 L12 20 L15 11 L24 12 Z" />
        <text x="32" y="36" fontSize="10.5" fontWeight="700" stroke="none" fill="currentColor" textAnchor="middle" fontFamily="Arial, sans-serif">
          OFF
        </text>
      </svg>
    ),
  },
];

function Badge({ titlePlain, titleAccent, subtitle, icon, isLast }) {
  return (
    <div
      className={`group flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2.5 sm:gap-3.5 cursor-pointer w-full pb-6 sm:pb-0 border-b border-gray-100 sm:border-0 ${
        isLast ? "border-0 pb-0" : ""
      }`}
    >
      <span className="badge-icon flex h-11 w-11 sm:h-10 sm:w-10 flex-none items-center justify-center text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
        {icon}
      </span>
      <span className="min-w-0">
        <p className="m-0 mb-0.5 text-[15px] font-bold leading-tight text-gray-900">
          {titlePlain} <span className="text-blue-600">{titleAccent}</span>
        </p>
        <p className="m-0 text-[13px] leading-tight text-gray-400">
          {subtitle}
        </p>
      </span>
    </div>
  );
}

export default function Badges() {
  return (
    <div className="w-full bg-white px-6 py-12">
      <style>{`
        @keyframes wiggle {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(-8deg) scale(1.08); }
          50%  { transform: rotate(8deg) scale(1.08); }
          75%  { transform: rotate(-4deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .group:hover .badge-icon {
          animation: wiggle 0.4s ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .group:hover .badge-icon {
            animation: none;
            transform: scale(1.08);
          }
        }
      `}</style>

      {/* Predictable column counts at every width instead of relying on
          flex-wrap + basis/min-width guessing where items land:
          1 column on phones, 2 on small tablets, 4 from desktop up. */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 sm:gap-y-10 place-items-center sm:place-items-start">
        {badges.map((b, i) => (
          <Badge key={b.id} {...b} isLast={i === badges.length - 1} />
        ))}
      </div>
    </div>
  );
}