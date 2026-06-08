import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

function SectionHero() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(true);

  const titles = [
    "Hành động nhỏ, tác động lớn!",
    "Trồng cây hôm nay, hưởng trái ngọt mai sau!",
    "Bảo vệ động vật biển, bảo vệ chính chúng ta!",
  ];
  const images = [
    "../src/assets/images/pick-up-trash.jpg",
    "../src/assets/images/plant-a-tree.jpg",
    "../src/assets/images/turtle.jpg",
  ];

  useEffect(() => {
    const changeSlide = () => {
      setShowText(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
        setShowText(true);
      }, 500);
    };

    const interval = setInterval(changeSlide, 3000);

    return () => clearInterval(interval);
  }, []);

  const formattedTitle = useMemo(() => {
    return titles[index].split(",").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i !== arr.length - 1 && ","}
        {i !== arr.length - 1 && <br />}
      </span>
    ));
  }, [index]);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 sm:p-6 lg:flex-row lg:p-12">
      <header className="flex w-full items-center justify-center px-4 text-center text-lg leading-tight font-bold text-[#059212] sm:text-xl md:text-2xl lg:w-1/2 lg:text-4xl xl:text-5xl">
        <h1
          id="heroTitle"
          className={`transition-opacity duration-500 ${showText ? "opacity-100" : "opacity-0"}`}
        >
          {formattedTitle}
        </h1>
      </header>
      <div className="relative flex h-[500px] w-full items-center justify-center sm:h-[250px] md:h-[350px] lg:h-[450px] lg:w-1/2 xl:h-[600px]">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`absolute left-1/2 aspect-[16/9] h-full w-full -translate-x-1/2 transform rounded-2xl object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </section>
  );
}

function Section({ imagePath, H2Text, PText, ButtonText, path, reverse }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`flex min-h-[60vh] w-full flex-col sm:min-h-[80vh] lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""} section items-center justify-center gap-6 p-4 sm:gap-8 sm:p-6 lg:gap-12 lg:p-8`}
    >
      <img
        src={imagePath}
        alt="ảnh mô tả"
        className={`h-full transform overflow-hidden transition-transform duration-1000 sm:h-3/5 lg:h-100 ${isVisible ? "translate-x-0" : reverse ? "translate-x-full" : "-translate-x-full"}`}
      />
      <header
        className={`flex w-full transform flex-col justify-center gap-4 text-center transition-transform duration-1000 max-sm:items-center sm:w-4/5 sm:items-center sm:gap-6 lg:w-2/5 lg:text-left ${isVisible ? "translate-x-0" : reverse ? "-translate-x-full" : "translate-x-full"}`}
      >
        <h2 className="text-xl font-semibold text-[#1F7D53] sm:text-2xl lg:text-[30px]">
          {H2Text}
        </h2>
        <p className="text-sm text-gray-700 sm:text-base lg:text-[20px]">
          {PText}
        </p>
        <button
          className="ease w-1/2 cursor-pointer rounded-[50px] border-0 bg-[#65b444] px-[40px] py-[17px] text-[15px] font-bold tracking-[1.5px] uppercase shadow-[0_0_8px_rgba(0,0,0,0.05)] transition-all duration-500 hover:bg-[#059212] hover:tracking-[3px] hover:text-white hover:shadow-[#059212_0px_7px_29px_0px] active:translate-y-[10px] active:bg-[#059212] active:tracking-[3px] active:text-white active:shadow-none active:duration-100"
          onClick={() => {
            if (isAuthenticated) {
              router.push(path);
              window.scrollTo(0, 0);
            } else {
              router.push("/register");
              window.scrollTo(0, 0);
            }
          }}
        >
          {ButtonText}
        </button>
      </header>
    </section>
  );
}

function HomepageSection() {
  return (
    <>
      <SectionHero />
      <Section
        imagePath="../src/assets/images/Nhiemvu.png"
        H2Text="Hoàn thành nhiệm vụ, tích điểm xanh"
        PText="Chọn nhiệm vụ phù hợp, hoàn thành thử thách xanh và nhận điểm thưởng. Càng nhiều nhiệm vụ hoàn thành, bạn càng đóng góp nhiều hơn cho hành tinh!"
        path="/missions"
        ButtonText="Khám phá nhiệm vụ"
      />
      <Section
        imagePath="../src/assets/images/Cho-trao-doi.png"
        H2Text="Chợ Trao Đổi - Biến Điểm Thành Hành Động"
        PText="Dùng điểm tích lũy để đổi lấy những sản phẩm bền vững, giúp bạn tiếp tục duy trì lối sống xanh và bảo vệ hành tinh."
        path="/market"
        ButtonText="Khám phá chợ trao đổi"
        reverse
      />
      <Section
        imagePath="../src/assets/images/hand-drawn-people-planting-a-tree.jpg"
        H2Text="Kết Nối Cộng Đồng - Lan Tỏa Hành Động Xanh"
        PText="Chia sẻ thành tích, tham gia thử thách cùng bạn bè và truyền cảm hứng đến cộng đồng. Mỗi hành động nhỏ tạo nên một phong trào lớn!"
        path="/register"
        ButtonText="Tham gia ngay"
      />
    </>
  );
}

export default HomepageSection;
