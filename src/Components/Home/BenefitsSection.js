import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../Home/BenefitsSection.module.css";

// Sample images (Replace with actual image URLs)
import img1 from "../../Assets/slider1.jpg";
import img2 from "../../Assets/slider2.png";
import img3 from "../../Assets/hpbg3.jpg";

const benefitsData = [
  {
    id: 1,
    name: "Kell Dawk",
    description: "Simplified stock management and automated tracking.",
    image: img1,
  },
  {
    id: 2,
    name: "Lotw Fox",
    description: "Real-time notifications for low or expiring stock.",
    image: img2,
  },
  {
    id: 3,
    name: "Sara Mit",
    description: "Generate reports to analyze trends and insights.",
    image: img3,
  },
];

export default function BenefitsSlider() {
  return (
    <section className={styles.sliderSection}>
      <h2 className={styles.heading}>Responsive Card Slider</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className={styles.slider}
      >
        {benefitsData.map((benefit) => (
          <SwiperSlide key={benefit.id} className={styles.slide}>
            <div className={styles.card}>
              <img src={benefit.image} alt={benefit.name} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h3>{benefit.name}</h3>
                <p>{benefit.description}</p>
                <button className={styles.viewMoreBtn}>View More</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
