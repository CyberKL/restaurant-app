import { useTranslation } from "react-i18next";

export default function Hero() {
  const [t] = useTranslation();

  return (
    <div className="relative flex items-center justify-center bg-[url(@/assets/hero.jpg)] h-screen bg-cover snap-start">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70" aria-hidden="true"></div> {/* aria-hidden for the overlay */}

      {/* Header */}
      <div className="text-center text-white z-10 space-y-4 flex flex-col items-center">
        <h1 className="lg:text-7xl md:text-6xl text-5xl" aria-label={t('hero.title')}> {/* aria-label for the heading */}
          {t('hero.title')}
        </h1>
        <p className="lg:text-2xl md:text-xl text-lg max-w-4xl" aria-label={t('hero.description')}> {/* aria-label for the description */}
          {t('hero.description')}
        </p>
      </div>
    </div>
  );
}

