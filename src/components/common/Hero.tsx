export default function Hero() {
  return (
    <div className="relative flex items-center justify-center bg-[url(@/assets/hero.jpg)] h-screen bg-cover snap-start">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Header */}
      <div className="text-center text-white z-10 space-y-4 flex flex-col items-center">
        <h1 className="lg:text-7xl md:text-6xl text-5xl">Fuel Your Day with Fresh, Healthy Flavors!</h1>
        <p className="lg:text-2xl md:text-xl text-lg max-w-4xl">Discover our delicious, nutrient-packed lunch options made from the freshest ingredients. Order now for a meal that loves you back.</p>
      </div>

    </div>
  );
}
