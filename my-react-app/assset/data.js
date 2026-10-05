 export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Crew ventile coat one",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&q=80",
    price: 50,
    rating: 4,
    badges: [{ label: "New", type: "new" }],
    category: "Men",
    color: "Black",
    size: "L",
    tags: ["Men", "Jacket", "Fashion"],
  
    description:
      "Premium winter coat made from high-quality cotton blend fabric. Designed for comfort, warmth, and modern style.",
  
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=80",
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=700&q=80"
    ],
  
    colors: [
      { value: "black", label: "Black", hex: "#2b2b2b" },
      { value: "gray", label: "Gray", hex: "#808080" }
    ],
  
    sizes: ["M", "L", "XL"],
  
    additionalInfo: [
      { label: "Material", value: "Cotton Blend" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Weight", value: "400 g" }
    ],
  
    reviews: [
      {
        author: "John",
        rating: 5,
        comment: "Excellent quality and very comfortable."
      },
      {
        author: "Alex",
        rating: 4,
        comment: "Perfect for winter season."
      }
    ],
  
    createdAt: "2026-06-20"
  },
  {
    id: 2,
    name: "Trench winter coat one",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    price: 60,
    salePrice: 30,
    rating: 5,
    badges: [{ label: "-50%", type: "sale" }],
    category: "Women",
    color: "Brown",
    size: "M",
    tags: ["Fashion", "Full Sleeve"],
  
    description:
      "Elegant trench coat with a modern design. Lightweight, stylish and suitable for casual and formal occasions.",
  
    images: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=700&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80"
    ],
  
    colors: [
      { value: "brown", label: "Brown", hex: "#8B4513" },
      { value: "beige", label: "Beige", hex: "#D8CDB8" }
    ],
  
    sizes: ["S", "M", "L"],
  
    additionalInfo: [
      { label: "Material", value: "Polyester Blend" },
      { label: "Fit", value: "Slim Fit" },
      { label: "Weight", value: "350 g" }
    ],
  
    reviews: [
      {
        author: "Sophia",
        rating: 5,
        comment: "Amazing quality and beautiful design."
      },
      {
        author: "Emma",
        rating: 4,
        comment: "Worth buying at this price."
      }
    ],
  
    createdAt: "2026-06-10"
  },
    {
      id: 3,
      name: "Women winter overcoat one",
      image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80",
      price: 70,
      salePrice: 56,
      rating: 1,
      badges: [{ label: "New", type: "new" }, { label: "-20%", type: "sale" }],
      category: "Women",
      color: "White",
      size: "S",
      tags: ["Fashion", "Tops"],
      createdAt: "2026-06-22",
    },
    { 
      id: 4,
      name: "Crew ventile coat two",
      image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
      price: 50,
      rating: 1,
      badges: [],
      category: "Men",
      color: "Blue",
      size: "Xl",
      tags: ["Men", "Half Sleeve"],
      createdAt: "2026-05-30",
    },
    {
      id: 5,
      name: "Classic Denim Jacket",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80",
      price: 45,
      rating: 4,
      badges: [{ label: "New", type: "new" }],
      category: "Men",
      color: "Blue",
      size: "M",
      tags: ["Jacket", "Fashion"],
      createdAt: "2026-06-15",
    },
    {
      id: 6,
      name: "Casual White Shirt",
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=500&q=80",
      price: 35,
      rating: 5,
      badges: [],
      category: "Men",
      color: "White",
      size: "L",
      tags: ["Shirt", "Full Sleeve"],
      createdAt: "2026-06-18",
    },
    {
      id: 7,
      name: "Women's Summer Dress",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
      price: 55,
      rating: 4,
      badges: [{ label: "-15%", type: "sale" }],
      category: "Women",
      color: "White",
      size: "S",
      tags: ["Fashion", "Tops"],
      createdAt: "2026-06-19",
    },
    {
      id: 8,
      name: "Kids Cotton Hoodie",
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80",
      price: 28,
      rating: 4,
      badges: [],
      category: "Kids",
      color: "Brown",
      size: "M",
      tags: ["Fashion"],
      createdAt: "2026-06-11",
    },
    {
      id: 9,
      name: "Leather Office Bag",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
      price: 90,
      rating: 5,
      badges: [{ label: "New", type: "new" }],
      category: "Fashion",
      color: "Brown",
      size: "L",
      tags: ["Fashion"],
      createdAt: "2026-06-21",
    },
    {
      id: 10,
      name: "Modern Bookshelf",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80",
      price: 150,
      rating: 4,
      badges: [],
      category: "Furniture",
      color: "Brown",
      size: "Xl",
      tags: ["Furniture"],
      createdAt: "2026-06-05",
    },
    {
      id: 11,
      name: "Programming Guide Book",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80",
      price: 20,
      rating: 5,
      badges: [],
      category: "Book",
      color: "Blue",
      size: "S",
      tags: ["Book"],
      createdAt: "2026-06-12",
    },
    {
      id: 12,
      name: "Toy Racing Car",
      image: "https://images.unsplash.com/photo-1517672651691-24622a91b550?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=500&q=80",
      price: 18,
      rating: 3,
      badges: [{ label: "-10%", type: "sale" }],
      category: "Toys",
      color: "Blue",
      size: "M",
      tags: ["Toys"],
      createdAt: "2026-06-03",
    },
    {
      id: 13,
      name: "Premium Face Cream",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80",
      price: 40,
      rating: 4,
      badges: [{ label: "New", type: "new" }],
      category: "Cosmetics",
      color: "White",
      size: "S",
      tags: ["Cosmetics"],
      createdAt: "2026-06-23",
    },
    {
      id: 14,
      name: "Slim Fit Chinos",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1506629905607-c4f9f6d8f3f4?w=500&q=80",
      price: 42,
      rating: 4,
      badges: [],
      category: "Men",
      color: "Black",
      size: "L",
      tags: ["Pant"],
      createdAt: "2026-06-09",
    },
    {
      id: 15,
      name: "Women's Handbag",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80",
      price: 65,
      rating: 5,
      badges: [{ label: "-25%", type: "sale" }],
      category: "Women",
      color: "Black",
      size: "M",
      tags: ["Fashion"],
      createdAt: "2026-06-14",
    },
    {
      id: 16,
      name: "Luxury Sofa Chair",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80",
      hoverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80",
      price: 220,
      rating: 5,
      badges: [{ label: "New", type: "new" }],
      category: "Furniture",
      color: "Brown",
      size: "Xl",
      tags: ["Furniture"],
      createdAt: "2026-06-16",
    }
  ];
