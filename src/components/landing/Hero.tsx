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
      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center w-full">
          {/* Left column - Text content */}
          <div className="w-full lg:w-1/2 py-4 pr-4 pl-4 lg:py-4 lg:pr-20 lg:pl-4">
            <Image
              src="/images/logo-footer.png"
              alt="CrossFit Nord BVS"
              width={150}
              height={50}
              className="mb-6"
            />

            <h6
              className="font-body uppercase mb-4"
              style={{
                color: "#E7B913",
                fontSize: "1.063rem",
                fontWeight: 500,
                letterSpacing: "6px",
              }}
            >
              E MAI MULT DECAT UN SPORT
            </h6>

            <p
              className="font-body mb-8"
              style={{
                color: "white",
                fontSize: "1rem",
                fontWeight: 400,
              }}
            >
              Comunitate. Spirit de echipa. Energie. Cele mai bune antrenamente
              din viata ta te asteapta. Indrazneste sa le descoperi!
            </p>

            <Link href="/pachete" className="btn-outline-red">
              Inscrie-te
            </Link>
          </div>

          {/* Right column */}
          <div className="w-full lg:w-1/2 p-8">
            <div className="flex flex-row">
              {/* Right > Left inner column (image) */}
              <AnimateOnScroll animation="fade-in-left" className="relative z-[1]">
                <Image
                  src="/images/hero-girl.png"
                  alt="Hero"
                  width={560}
                  height={647}
                  style={{
                    transform: "scaleX(-1)",
                    margin: "0% -1% -50% -30%",
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
                  padding: "1em",
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
                  Forta. Putere. Echilibru. Agilitate. Flexibilitate.
                  Anduranta.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
