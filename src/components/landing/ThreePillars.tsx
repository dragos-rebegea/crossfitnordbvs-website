import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

const pillars = [
  {
    number: "01",
    title: "MOTIVATIE",
    description:
      "Motivatia vine din comunitate. Atmosfera din sala te impinge sa dai totul la fiecare antrenament.",
    bg: "#FB3C3C",
    hasOverlay: true,
    zIndex: 2,
    delay: 0,
  },
  {
    number: "02",
    title: "ANTRENAMENT",
    description:
      "Antrenamentele variate si intense, combinate cu coaching de calitate, te duc la urmatorul nivel.",
    bg: "#CE3030",
    hasOverlay: true,
    zIndex: 1,
    delay: 100,
  },
  {
    number: "03",
    title: "REZULTATE",
    description:
      "Rezultatele vin natural cand ai motivatia si antrenamentul potrivit. Transforma-te fizic si mental.",
    bg: "#282828",
    hasOverlay: false,
    zIndex: 0,
    delay: 200,
  },
];

export default function ThreePillars() {
  return (
    <section
      className="w-full overflow-hidden px-[1em] py-0"
      style={{ marginTop: "-3%" }}
    >
      <div className="flex flex-col md:flex-row">
        {pillars.map((pillar) => (
          <AnimateOnScroll
            key={pillar.number}
            animation="bounce-in-up"
            delay={pillar.delay}
            className="w-full md:w-1/3"
          >
            <div
              className="relative overflow-hidden p-[1em]"
              style={{
                backgroundColor: pillar.bg,
                boxShadow: "10px 0px 10px 0px rgba(0,0,0,0.15)",
                zIndex: pillar.zIndex,
              }}
            >
              {pillar.hasOverlay && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: "url(/images/bg-texture.jpg)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    opacity: 0.1,
                    filter: "brightness(200%)",
                  }}
                />
              )}

              <div className="relative">
                <span
                  className="block font-heading text-[3.75rem] font-bold md:text-large-num"
                  style={{
                    WebkitTextStroke: "1px #5A5A5A",
                    color: "transparent",
                    marginBottom: "-20%",
                  }}
                >
                  {pillar.number}
                </span>

                <h3
                  className="relative z-[1] font-heading text-h2 uppercase text-white"
                >
                  {pillar.title}
                </h3>

                <p className="font-body text-base text-white">
                  {pillar.description}
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
