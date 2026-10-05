import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const ChevronDown = () => (
  <svg className="w-3 h-3 ml-0.5 inline-block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);


const UserIcon = () => {
  return (
    <div className="relative group">
      <svg
        className="w-6 h-6 cursor-pointer"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="4" />
        <path
          strokeLinecap="round"
          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        />
      </svg>

      <div className="absolute top-0 right-0 translate-x-full ml-2 w-48 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <Link
          to="/register"
          className="block px-4 py-3 hover:bg-gray-100"
        >
          User Login
        </Link>

        <Link
          to="/admin"
          className="block px-4 py-3 hover:bg-gray-100 border-t"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
};

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12M8 12h8M8 17h4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10" />
  </svg>
);
const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const Badge = ({ count }) => (
  <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
    {count}
  </span>
);

const navLinks = [
  { label: "Home", hasDropdown: true },
  { label: "Shop", hasDropdown: true },
  { label: "Pages", hasDropdown: true },
  { label: "Blog", hasDropdown: true },
  { label: "Contact", hasDropdown: false },
];
const iconActions = [
  { icon: <SearchIcon />, badge: null },
  { icon: <UserIcon />, badge: null },
  { icon: <CompareIcon />, badge: 0 },
  { icon: <HeartIcon />, badge: 0 },
  { icon: <CartIcon />, badge: 1 },
];

// Scroll distance (px) before the navbar switches from normal (in-flow) to fixed mode.
const FIXED_THRESHOLD = 80;

export default function FloneNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  // "normal"  — in document flow, scrolls with page
  // "hidden"  — fixed, translated above viewport (invisible)
  // "pinned"  — fixed, at top (visible, locked)
  const [mode, setMode] = useState("normal");
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.pageYOffset;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const goingDown = currentScroll > lastScrollY.current;

      if (currentScroll <= FIXED_THRESHOLD) {
        setMode("normal");
      } else if (goingDown) {
        setMode("hidden");
        setMenuOpen(false); // close mobile menu if it auto-hides while open
      } else {
        setMode("pinned");
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .flone-nav {
          width: 100%;
          z-index: 100;
          background: #fff;
          border-bottom: 1px solid #f3f4f6;
        }

        .flone-nav.mode-normal {
          position: relative;
          transform: translateY(0);
        }

        .flone-nav.mode-hidden {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          transform: translateY(-100%);
          transition: transform 0.35s ease;
        }

        .flone-nav.mode-pinned {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          transform: translateY(0);
          transition: transform 0.35s ease;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Spacer only when fixed so layout doesn't jump */}
      {mode !== "normal" && <div style={{ height: "68px" }} />}

      <div className={`flone-nav mode-${mode}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Flone<span className="text-gray-900">.</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="text-sm font-medium text-[#262626] hover:text-[#A749FF] transition-colors duration-150 flex items-center gap-0.5 py-1 cursor-pointer">
                    {link.label}
                    {link.hasDropdown && <ChevronDown />}
                  </button>
                  {link.hasDropdown && openDropdown === link.label && (
                    <div className="absolute left-0 w-40 bg-white border border-gray-100 shadow-lg rounded-sm z-50 py-2" style={{ top: "100%" }}>
                      <div className="absolute -top-3 left-0 right-0 h-3" />
                      {["Option 1", "Option 2", "Option 3"].map((item) => (
                        <a key={item} href="#" className="block px-4 py-2 text-sm text-gray-600 hover:text-[#A749FF] hover:bg-gray-50 transition-colors">
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              {iconActions.map((action, i) => (
                <button key={i} className="relative text-gray-700 hover:text-[#A749FF] transition-colors duration-150 cursor-pointer">
                  {action.icon}
                  {action.badge !== null && <Badge count={action.badge} />}
                </button>
              ))}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-3">
              <button className="relative text-gray-700 hover:text-[#A749FF]">
                <CartIcon /><Badge count={1} />
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-[#A749FF]">
                {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="h-[3px] bg-gradient-to-r from-[#e8d5f0] via-[#c9a8e8] to-[#e8d5f0]" />

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            {navLinks.map((link) => (
              <div key={link.label} className="py-2 border-b border-gray-50">
                <button
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  className="w-full flex items-center justify-between text-sm font-medium text-[#262626]"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown />}
                </button>
                {link.hasDropdown && openDropdown === link.label && (
                  <div className="mt-1 ml-3 flex flex-col gap-1">
                    {["Option 1", "Option 2", "Option 3"].map((item) => (
                      <a key={item} href="#" className="text-sm text-gray-500 hover:text-[#A749FF] py-0.5">{item}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-5 pt-4">
              {[<SearchIcon />, <UserIcon />, <CompareIcon />, <HeartIcon />].map((icon, i) => (
                <button key={i} className="text-gray-600 hover:text-[#A749FF] transition-colors">{icon}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}