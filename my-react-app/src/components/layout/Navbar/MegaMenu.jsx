const featured = [
    "New Arrivals",
    "Bestsellers",
    "Back in Stock",
    "Special Prices",
    "Shop All",
  ];
  
  const categories = [
    "Shirts",
    "Polos",
    "Tees",
    "Bottomwear",
    "Winterwear",
    "Denims",
  ];
  
  const collections = [
    "Summer Collection",
    "Winter Collection",
    "Premium Linen",
    "Everyday Wear",
  ];
  
  export default function MegaMenu() {
    return (
        <div className="w-full bg-white border-t border-gray-100 shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-3 gap-16">
          <div>
            <h3 className="uppercase text-xs tracking-widest text-gray-500 mb-4">
              Featured
            </h3>
            {featured.map((item) => (
              <p key={item} className="mb-3 text-sm text-gray-700 hover:text-[#A749FF] cursor-pointer transition-colors">
                {item}
              </p>
            ))}
          </div>
  
          <div>
            <h3 className="uppercase text-xs tracking-widest text-gray-500 mb-4">
              Categories
            </h3>
            {categories.map((item) => (
              <p key={item} className="mb-3 text-sm text-gray-700 hover:text-[#A749FF] cursor-pointer transition-colors">
                {item}
              </p>
            ))}
          </div>
  
          <div>
            <h3 className="uppercase text-xs tracking-widest text-gray-500 mb-4">
              Collections
            </h3>
            {collections.map((item) => (
              <p key={item} className="mb-3 text-sm text-gray-700 hover:text-[#A749FF] cursor-pointer transition-colors">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }