import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export default function Hero() {
  return (
    <section
      id="acasa"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #282828 0%, #121212 60%)",
      }}
    >
      {/* Watermark overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/watermark.png)",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-10">
        <div className="flex flex-col-reverse lg:flex-row items-center w-full">
          {/* Left column - Text content */}
          <div className="w-full lg:w-[45%] py-4 pr-4 pl-4 lg:py-4 lg:pr-16 lg:pl-4">
            <Image
              src="/images/logo-footer.png"
              alt="CrossFit Nord BVS"
              width={200}
              height={87}
              className="mb-8"
            />

            <h1
              className="font-heading uppercase mb-6 text-white text-[2rem] md:text-[3.5rem] lg:text-[5.125rem]"
              style={{
                fontWeight: 700,
                lineHeight: "1em",
              }}
            >
              E mai mult decât un sport
            </h1>

            <p
              className="font-body mb-8 max-w-[600px]"
              style={{
                color: "white",
                fontSize: "1rem",
                fontWeight: 400,
                lineHeight: "1.6",
              }}
            >
              Comunitate. Spirit de echipă. Energie. Dedicare. Pasiune pentru sport. Evoluție. Forță. Sănătate. Toate acestea și mai multe conținute într-un cuvânt: CrossFit. Indiferent de experiența în CrossFit sau de nivelul condiției tale fizice, ai ajuns în locul potrivit.
            </p>

            <Link href="/pachete" className="btn-outline-red">
              Înscrie-te
            </Link>
          </div>

          {/* Right column */}
          <div className="w-full lg:w-[55%] p-8">
            <div className="flex flex-row">
              {/* Right > Left inner column (image) */}
              <AnimateOnScroll animation="fade-in-left" className="relative z-[1]">
                <Image
                  src="/images/hero-girl.png"
                  alt="Hero"
                  width={800}
                  height={925}
                  style={{
                    transform: "scaleX(-1)",
                    margin: "0% 0% -50% 0%",
                    filter:
                      "brightness(98%) contrast(100%) saturate(41%)",
                  }}
                />
              </AnimateOnScroll>

              {/* Right > Right inner column (red text block) */}
              <div
                className="relative flex items-center overflow-hidden"
                style={{
                  background:
                    "linear-gradient(220deg, #FB3C3C 0%, #CE3030 100%)",
                  padding: "1.5em",
                  minWidth: "380px",
                }}
              >
                {/* Texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "url(/images/bg-texture.jpg)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    opacity: 0.1,
                    filter: "brightness(300%) saturate(0%)",
                  }}
                />

                <h2
                  className="relative z-[1] font-heading uppercase text-[1.5rem] lg:text-[2.875rem]"
                  style={{
                    fontWeight: 700,
                    lineHeight: "1em",
                    color: "#121212",
                  }}
                >
                  Forță.<br />Putere.<br />Echilibru.<br />Agilitate.<br />Flexibilitate.<br />Anduranță.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
