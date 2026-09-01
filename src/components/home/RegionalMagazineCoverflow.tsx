import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { Issue } from "@/lib/magazines-map";

import "swiper/css";
import "swiper/css/effect-coverflow";

type RegionalMagazineCoverflowProps = {
  magazines: Issue[];
  region: string;
};

const sharpenCover = (url: string) => {
  if (!url.includes("unsplash.com")) return url;
  return `${url.split("?")[0]}?auto=format&fit=crop&w=1400&q=90`;
};

const RegionalMagazineCoverflow = ({
  magazines,
  region,
}: RegionalMagazineCoverflowProps) => {
  if (!magazines.length) {
    return (
      <div className="flex h-[270px] items-center justify-center text-sm text-neutral-500">
        No magazines available for this edition.
      </div>
    );
  }

  const carouselMagazines = Array.from(
    { length: 10 },
    (_, index) => magazines[index % magazines.length]
  );

  return (
    <div className="home-motion-magazine-shell">
      <Swiper
        key={region}
        effect="coverflow"
        centeredSlides
        grabCursor
        watchSlidesProgress
        loop
        speed={3000}
        slidesPerView={2}
        slidesPerGroup={1}
        spaceBetween={0}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 20,
          depth: 80,
          modifier: 2,
          slideShadows: true,
        }}
        breakpoints={{
          767: {
            slidesPerView: 3,
            spaceBetween: 0,
            slidesPerGroup: 1,
          },
          1023: {
            slidesPerView: 4,
            spaceBetween: 25,
            slidesPerGroup: 1,
          },
        }}
        modules={[Autoplay, EffectCoverflow]}
        className="home-motion-magazine-carousel"
        aria-label={`${region} magazine carousel`}
      >
        {carouselMagazines.map((magazine, index) => (
          <SwiperSlide
            key={`${region}-${magazine.id}-${index}`}
            className="home-motion-magazine-slide"
          >
            <Link
              to={magazine.slug ? `/magazine/${magazine.slug}` : "/magazine"}
              title={magazine.title}
              className="block h-full w-full"
            >
              <img
                src={sharpenCover(magazine.cover)}
                alt={magazine.title}
                width="880"
                height="1155"
                loading={index < 5 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-contain"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RegionalMagazineCoverflow;
