import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoCartOutline, IoCart } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../../features/cart/cartThunk";
import MegaMenu from "./MegaMenu";
const ChevronDown = () => (
  <svg className="w-[14px] h-[14px] ml-0.5 inline-block text-[#666666]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const UserIcon = ({ user, handleLogout }) => {
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
        <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>

      <div className="absolute right-0 top-full mr-[-100px] w-48 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

        {user ? (
          <>
            <Link
              to="/profile"
              className="block px-4 py-3 hover:bg-gray-100"
            >
              My Profile
            </Link>
            <Link
              to="/myorders"
              className="block px-4 py-3 hover:bg-gray-100 border-t"
            >
              orders
            </Link>
            <Link
              to="/wishlist"
              className="block px-4 py-3 hover:bg-gray-100 border-t"
            >
              Whilelist 
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 hover:bg-gray-100 border-t"
            >
              contact us
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 border-t"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/Register"
              className="block px-4 py-3 hover:bg-gray-100"
            >
              User Login
            </Link>

            <Link
              to="/register"
              className="block px-4 py-3 hover:bg-gray-100 border-t"
            >
              Register
            </Link>
          </>
        )}

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

const HeartIcon = ({ filled }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12M8 12h8M8 17h4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10" />
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

const Badge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
      {count}
    </span>
  );
};

const navLinks = [
  { label: "Home", path: "/home", hasDropdown: false },
  { label: "Shop", path: "/", hasDropdown: true },
  { label: "Blog", path: "/blog", hasDropdown: false },
  { label: "Contact", path: "/contact", hasDropdown: false },
];

// Safely reads the logged-in user from localStorage without throwing
// on missing or malformed data.
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function FloneNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // desktop hover dropdown
  const [mobileDropdown, setMobileDropdown] = useState(null); // mobile click dropdown
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(getStoredUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartcount = useSelector((state) => state.cart.count);
  const likes = useSelector((state) => state.likes.items);
  const wishlistCount = likes?.length || 0;
  const compareCount = 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/Register");
  };

  // --- Desktop hover-dropdown handling (with close delay so the cursor
  // has time to travel from the "Shop" link down into the mega menu) ---
  const closeTimer = useRef(null);

  const openMenu = (label) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const iconActions = [
    { key: "search", icon: <SearchIcon />, to: null, count: null },
    { key: "user", icon: <UserIcon user={user} handleLogout={handleLogout} />, to: null, count: null },

    { key: "wishlist", icon: <HeartIcon filled={wishlistCount > 0} />, to: "/wishlist", count: wishlistCount },
    {
      key: "cart",
      icon: cartcount > 0 ? (
        <IoCart className="w-5 h-5 text-[#111111] hover:text-[#A749FF]" />
      ) : (
        <IoCartOutline className="w-5 h-5" />
      ),
      to: "/add-to-cart",
      count: cartcount,
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu automatically if the viewport grows past the
  // md breakpoint, so it doesn't stay stuck open behind the desktop nav.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (document.getElementById("jost-font-link")) return;
    const link = document.createElement("link");
    link.id = "jost-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  const renderIcon = (action, sizeClass = "") => {
    const content = (
      <>
        <span className={sizeClass}>{action.icon}</span>
        <Badge count={action.count} />
      </>
    );
    return action.to ? (
      <Link
        key={action.key}
        to={action.to}
        onClick={() => setMenuOpen(false)}
        className="relative text-gray-700 hover:text-[#A749FF] transition-colors duration-150"
        aria-label={action.key}
      >
        {content}
      </Link>
    ) : (
      <div
        key={action.key}
        className="relative text-gray-700 hover:text-[#A749FF] transition-colors duration-150"
        aria-label={action.key}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      className="font-sans sticky top-0 z-[100]"
      style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.10)" : "none", transition: "box-shadow 0.3s ease" }}
    >
      <nav className="bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Flone<span className="text-gray-900">.</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-[38px]" style={{ fontFamily: "'Jost', 'Inter', 'Poppins', sans-serif" }}>
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && openMenu(link.label)}
                  onMouseLeave={() => link.hasDropdown && scheduleClose()}
                >
                  <Link
                    to={link.path}
                    className="font-medium text-[#2C2C2C] hover:text-[#A749FF] transition-colors duration-150 flex items-center gap-0.5 py-1"
                    style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "0px" }}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown />}
                  </Link>
                </div>
              ))}
            </div>

            {/* Mega menu — anchored to the whole <nav>, spans full width, taken out of flex flow */}
            {openDropdown === "Shop" && (
              <div
                className="absolute inset-x-0 top-full"
                onMouseEnter={() => openMenu("Shop")}
                onMouseLeave={scheduleClose}
              >
                <MegaMenu />
              </div>
            )}

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-6">

              {!user ? (
                <Link
                  to="/register"
                  className="text-[15px] font-medium text-[#333] hover:text-[#A749FF]"
                >
                  Login <span className="text-gray-400">/</span> Register
                </Link>
              ) : (
                <span className="text-[15px] font-medium">
                  Hi, {user.name}
                </span>
              )}

              {renderIcon(iconActions.find(action => action.key === "search"))}
              {renderIcon(iconActions.find(action => action.key === "user"))}
              {renderIcon(iconActions.find(action => action.key === "wishlist"))}
              {renderIcon(iconActions.find(action => action.key === "cart"))}

            </div>

            {/* Mobile: all icons + hamburger, in one tidy row */}
            <div className="flex md:hidden items-center gap-3.5 sm:gap-4">
              {iconActions.map((action) => renderIcon(action, "block scale-90"))}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-[#A749FF] pl-1 border-l border-gray-200"
                aria-label={menuOpen ? "close menu" : "open menu"}
              >
                {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu — nav links only, icons already live in the top bar.
            Uses click-to-toggle (not hover) since there's no mouse on touch devices. */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            {navLinks.map((link) => (
              <div key={link.label} className="py-2 border-b border-gray-50">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === link.label ? null : link.label)}
                  className="w-full flex items-center justify-between text-sm font-medium text-[#262626]"
                >
                  <Link to={link.path} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                  {link.hasDropdown && <ChevronDown />}
                </button>
                {link.hasDropdown && mobileDropdown === link.label && (
                  <div className="mt-1 ml-3 flex flex-col gap-1">
                    {["Option 1", "Option 2", "Option 3"].map((item) => (
                      <a key={item} href="#" className="text-sm text-gray-500 hover:text-[#A749FF] py-0.5">{item}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}