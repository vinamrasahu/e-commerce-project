/**
 * =========================================================================
 * STATIC / MOCK DATA — for checking your components before backend is wired
 * =========================================================================
 * Covers:
 *   - PRODUCTS        -> Shop.jsx, ProductGrid.jsx, ProductDetailPage.jsx
 *   - BLOG_POSTS      -> BlogSection.jsx
 *
 * Usage:
 *   import { PRODUCTS, BLOG_POSTS } from "./staticData";
 *   <Shop products={PRODUCTS} />          // if you wire a products prop
 *   <ProductGrid products={PRODUCTS} />
 *   <BlogSection posts={BLOG_POSTS} />
 *
 * Note: Shop.jsx currently fetches from getProducts() directly rather than
 * accepting a `products` prop — if you want to test with this static list
 * instead of hitting the real API, see the bottom of this file for a
 * drop-in mock of getProducts().
 * =========================================================================
 */

/* =========================================================================
   PRODUCTS
   Shape: { _id, name, image, hoverImage?, price, salePrice?, rating (0-5),
            badges: [{label, type:"new"|"sale"}], category, color, size,
            tags: [], createdAt, description?, colors?, sizes?,
            additionalInfo?, reviews? }

   _id is used (not id) to match the Mongo-style backend shape used in
   Shop.jsx / ProductGrid.jsx.
   ========================================================================= */
   export const examplePost = [
    {
      _id: "p1",
      name: "Crew ventile coat one",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&q=80",
      price: 50,
      salePrice: null,
      rating: 4,
      badges: [{ label: "New", type: "new" }],
      category: "Men",
      color: "Black",
      size: "L",
      tags: ["Men", "Jacket", "Fashion"],
      createdAt: "2026-06-20",
      description:
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
      colors: [
        { value: "black", label: "Black", hex: "#2b2b2b" },
        { value: "beige", label: "Beige", hex: "#d8cdb8" },
      ],
      sizes: ["M", "L", "Xl"],
      additionalInfo: [
        { label: "Weight", value: "400 g" },
        { label: "Dimensions", value: "10 x 10 x 15 cm" },
        { label: "Materials", value: "60% cotton, 40% polyester" },
        { label: "Other Info", value: "American heirloom jean shorts pug seitan letterpress" },
      ],
      reviews: [
        { author: "Sarah K.", rating: 5, comment: "Great fit and really warm for winter." },
        { author: "Daniel M.", rating: 4, comment: "Good quality, runs slightly large." },
      ],
    },
    {
      _id: "p2",
      name: "Trench winter coat one",
      image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      price: 60,
      salePrice: 30,
      rating: 1,
      badges: [{ label: "-50%", type: "sale" }],
      category: "Women",
      color: "Brown",
      size: "M",
      tags: ["Fashion", "Full Sleeve"],
      createdAt: "2026-06-10",
      description: "A warm, classic trench coat cut for cold mornings and layovers alike.",
      colors: [
        { value: "brown", label: "Brown", hex: "#7b5b3f" },
        { value: "black", label: "Black", hex: "#2b2b2b" },
      ],
      sizes: ["S", "M", "L"],
      additionalInfo: [
        { label: "Weight", value: "650 g" },
        { label: "Dimensions", value: "12 x 10 x 18 cm" },
        { label: "Materials", value: "80% wool, 20% polyester" },
      ],
      reviews: [
        { author: "Priya N.", rating: 5, comment: "Beautiful color, fits true to size." },
      ],
    },
    {
      _id: "p3",
      name: "Women winter overcoat one",
      image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80",
      price: 70,
      salePrice: 56,
      rating: 3,
      badges: [{ label: "New", type: "new" }, { label: "-20%", type: "sale" }],
      category: "Women",
      color: "White",
      size: "S",
      tags: ["Fashion", "Tops"],
      createdAt: "2026-06-22",
      description: "Soft overcoat with a relaxed fit, ideal for layering through autumn and winter.",
      colors: [{ value: "white", label: "White", hex: "#f5f5f0" }],
      sizes: ["S", "M"],
      additionalInfo: [
        { label: "Weight", value: "520 g" },
        { label: "Materials", value: "70% cotton, 30% polyester" },
      ],
      reviews: [],
    },
    {
      _id: "p4",
      name: "Crew ventile coat two",
      image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
      price: 50,
      salePrice: null,
      rating: 2,
      badges: [],
      category: "Men",
      color: "Blue",
      size: "Xl",
      tags: ["Men", "Half Sleeve"],
      createdAt: "2026-05-30",
      description: "A lighter take on the classic crew ventile coat, built for transitional weather.",
      colors: [{ value: "blue", label: "Blue", hex: "#3b5b8c" }],
      sizes: ["L", "Xl"],
      additionalInfo: [{ label: "Weight", value: "410 g" }],
      reviews: [{ author: "Tom R.", rating: 4, comment: "Solid everyday jacket." }],
    },
    {
      _id: "p5",
      name: "Classic denim jacket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500&q=80",
      price: 45,
      salePrice: null,
      rating: 5,
      badges: [{ label: "New", type: "new" }],
      category: "Fashion",
      color: "Blue",
      size: "M",
      tags: ["Jacket", "Fashion", "Full Sleeve"],
      createdAt: "2026-06-24",
      description: "A timeless denim jacket that goes with everything.",
      colors: [{ value: "blue", label: "Blue", hex: "#3b5b8c" }],
      sizes: ["S", "M", "L"],
      additionalInfo: [{ label: "Materials", value: "100% cotton denim" }],
      reviews: [{ author: "Aisha B.", rating: 5, comment: "Perfect fit, great quality denim." }],
    },
    {
      _id: "p6",
      name: "Lightweight summer shirt",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&q=80",
      price: 25,
      salePrice: 18,
      rating: 4,
      badges: [{ label: "-28%", type: "sale" }],
      category: "Men",
      color: "White",
      size: "M",
      tags: ["Shirt", "Half Sleeve"],
      createdAt: "2026-06-01",
      description: "Breathable cotton shirt designed for warm days.",
      colors: [
        { value: "white", label: "White", hex: "#f5f5f0" },
        { value: "black", label: "Black", hex: "#2b2b2b" },
      ],
      sizes: ["S", "M", "L", "Xl"],
      additionalInfo: [{ label: "Materials", value: "100% cotton" }],
      reviews: [],
    },
    {
      _id: "p7",
      name: "Kids puffer jacket",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80",
      price: 35,
      salePrice: null,
      rating: 5,
      badges: [{ label: "New", type: "new" }],
      category: "Kids",
      color: "Black",
      size: "S",
      tags: ["Jacket", "Fashion"],
      createdAt: "2026-06-15",
      description: "Cozy, lightweight puffer jacket built for active kids.",
      colors: [{ value: "black", label: "Black", hex: "#2b2b2b" }],
      sizes: ["S", "M"],
      additionalInfo: [{ label: "Weight", value: "300 g" }],
      reviews: [{ author: "Maria L.", rating: 5, comment: "My son loves it, warm and light." }],
    },
    {
      _id: "p8",
      name: "Leather tote bag",
      image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80",
      price: 80,
      salePrice: 64,
      rating: 4,
      badges: [{ label: "-20%", type: "sale" }],
      category: "Women",
      color: "Brown",
      size: "M",
      tags: ["Fashion"],
      createdAt: "2026-05-20",
      description: "Genuine leather tote with plenty of room for everyday essentials.",
      colors: [
        { value: "brown", label: "Brown", hex: "#7b5b3f" },
        { value: "black", label: "Black", hex: "#2b2b2b" },
      ],
      sizes: ["M"],
      additionalInfo: [{ label: "Materials", value: "100% genuine leather" }],
      reviews: [{ author: "Hannah G.", rating: 4, comment: "Sturdy and looks great." }],
    },
    {
      _id: "p9",
      name: "Wool blend scarf",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&q=80",
      price: 20,
      salePrice: null,
      rating: 3,
      badges: [],
      category: "Fashion",
      color: "Black",
      size: "S",
      tags: ["Fashion"],
      createdAt: "2026-04-28",
      description: "Soft wool blend scarf for everyday warmth.",
      colors: [{ value: "black", label: "Black", hex: "#2b2b2b" }],
      sizes: ["S"],
      additionalInfo: [{ label: "Materials", value: "50% wool, 50% acrylic" }],
      reviews: [],
    },
  ];
  
  /* =========================================================================
     BLOG POSTS
     Shape: { id, title, image, category, author, href?, excerpt?, createdAt? }
     Matches BlogSection.jsx's BlogCard component.
     ========================================================================= */
  export const BLOG_POSTS = [
    {
      id: "b1",
      title: "A guide to latest trends product",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
      category: "women",
      author: "Admin",
      excerpt: "What's trending this season and how to wear it without overthinking it.",
      createdAt: "2026-06-20",
    },
    {
      id: "b2",
      title: "Five ways to lead a happy life",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
      category: "lifestyle",
      author: "admin",
      excerpt: "Small, sustainable habits that actually make a difference day to day.",
      createdAt: "2026-06-15",
    },
    {
      id: "b3",
      title: "Tips on having a happy life forever",
      image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=600&q=80",
      category: "women",
      author: "admin",
      excerpt: "A few mindset shifts worth revisiting whenever things feel heavy.",
      createdAt: "2026-06-05",
    },
    {
      id: "b4",
      title: "How to style a winter coat for every occasion",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      category: "fashion",
      author: "Admin",
      excerpt: "From office to weekend brunch — one coat, three completely different looks.",
      createdAt: "2026-05-28",
    },
  ];
  
  /* =========================================================================
     OPTIONAL: drop-in mock for getProducts(), if you want Shop.jsx to render
     this static list instead of calling the real backend while you check
     the UI. Copy this into productService.js temporarily, or import and
     use directly in a test file.
  
     import { PRODUCTS } from "./staticData";
  
     export async function getProducts() {
       // Simulate the same response shape your real API returns
       return { data: PRODUCTS };
     }
     ========================================================================= */