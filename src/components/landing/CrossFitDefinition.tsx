import { UserCheck, ClipboardCheck, TrendingUp, Apple } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

const benefits = [
  {
    icon: UserCheck,
    text: "imbunatatirea sanatatii cardiovasculare",
  },
  {
    icon: ClipboardCheck,
    text: "imbunatatirea functiei articulatiilor si muschilor",
  },
  {
    icon: TrendingUp,
    text: "cresterea masei musculare",
  },
  {
    icon: Apple,
    text: "cresterea ratei metabolice",
  },
];

export default function CrossFitDefinition() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #282828 0%, #121212 35%)",
        padding: "6em 1em 0em 1em",
      }}
    >
      {/* Header & description */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-h2 uppercase text-white">
          CE INSEAMNA <span className="capitalize">CrossFit</span>
        </h2>

        <p className="mt-6 font-body text-base text-white">
          CrossFit este un program de antrenament de inalta intensitate care
          combina miscari functionale variate, executate la o intensitate
          ridicata. Antrenamentele sunt concepute sa imbunatateasca capacitatea
          fizica generala, incluzand forta, rezistenta cardiovasculara,
          flexibilitatea, puterea, viteza, coordonarea, agilitatea, echilibrul
          si precizia.
        </p>

        <p className="mt-4 font-body text-base text-white">
          Programele de CrossFit sunt scalabile si adaptabile pentru orice
          nivel de fitness, de la incepatori la atleti de performanta.
          Antrenamentele zilnice, cunoscute sub numele de WOD (Workout of the
          Day), variaza constant pentru a preveni plafonarea si a mentine
          corpul in continua adaptare.
        </p>
      </div>

      {/* Benefits heading */}
      <div className="mx-auto mt-16 max-w-4xl text-center">
        <h2 className="font-heading text-h2 uppercase text-white">
          Beneficiile antrenamentelor de CrossFit
        </h2>
      </div>

      {/* Benefits grid */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <AnimateOnScroll
              key={benefit.text}
              animation="bounce-in-up"
              delay={index * 100}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="mb-4 h-12 w-12 text-white" strokeWidth={1.5} />
                <p className="font-body text-base text-white">{benefit.text}</p>
              </div>
            </AnimateOnScroll>
          );
        })}
      </div>

      {/* Decorative watermark */}
      <div
        className="pointer-events-none mt-12 select-none text-center font-heading uppercase"
        style={{
          fontSize: "clamp(4rem, 12vw, 15rem)",
          fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255, 255, 255, 0.05)",
          lineHeight: "0.8em",
          overflow: "hidden",
        }}
      >
        workoution
      </div>
    </section>
  );
}
