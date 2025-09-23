// components/PromoBannerSection.js

const PromoBannerSection = () => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-400 p-6 rounded-lg">
            <div className="text-sm font-medium text-black mb-2">BIG DEAL</div>
            <h3 className="text-xl font-bold text-black mb-2">Calculators</h3>
            <div className="text-black mb-4">SAVE BIG</div>
          </div>

          <div className="bg-purple-600 p-6 rounded-lg text-white">
            <div className="text-sm font-medium mb-2">LIMITED EDITION</div>
            <h3 className="text-xl font-bold mb-2">Office Report File Folder</h3>
            <div className="mb-4">MAKE ORDER NOW!</div>
          </div>

          <div className="bg-green-600 p-6 rounded-lg text-white">
            <div className="text-sm font-medium mb-2">ART SUPPLIES</div>
            <h3 className="text-xl font-bold mb-2">Washable Finger Water Colors</h3>
            <div className="mb-4">BEST PRICES</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannerSection;