import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

interface Trainer {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  specialties: string[];
}

interface TeamProps {
  trainers: Trainer[];
}

const fallbackImages: Record<string, string> = {
  "silviu tanase": "/images/silviu-tanase.jpg",
  "adrian schuller": "/images/adrian-schuller.jpg",
  "robert mihaila": "/images/robert-mihaila.jpg",
  "cristian tudor": "/images/cristian-tudor.jpg",
};

function getTrainerImage(trainer: Trainer): string | null {
  if (trainer.image) return trainer.image;
  const key = trainer.name.toLowerCase();
  return fallbackImages[key] ?? null;
}

function getBackgroundPosition(name: string): string {
  if (name.toLowerCase() === "robert mihaila") return "-223px 0px";
  return "center center";
}

export default function Team({ trainers }: TeamProps) {
  return (
    <>
      {/* Team Intro */}
      <section
        id="echipa"
        className="relative"
        style={{ padding: "6em 1em 1em 1em" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#121212" }}
        />
        {/* Background overlay image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/bg2.png)",
            backgroundPosition: "top left",
            backgroundSize: "20% auto",
            backgroundRepeat: "no-repeat",
            opacity: 0.1,
          }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          <h6
            className="font-body text-h6 uppercase"
            style={{ color: "#E7B913", letterSpacing: "6px" }}
          >
            Antrenorii nostri
          </h6>
          <h2 className="mt-4 font-heading text-h2 uppercase text-white">
            CUNOASTE ECHIPA
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base text-white">
            Antrenorii nostri sunt profesionisti certificati, cu experienta in
            CrossFit, fitness functional si nutritie. Fiecare antrenor este
            dedicat sa te ajute sa iti atingi obiectivele, indiferent de
            nivelul tau de pregatire.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: "#121212",
          padding: "0em 1em 6em 1em",
        }}
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer, index) => {
            const image = getTrainerImage(trainer);
            const isLast = index === trainers.length - 1;
            return (
              <AnimateOnScroll
                key={trainer.id}
                animation="fade-in-up"
                delay={isLast ? 200 : 0}
              >
                <div>
                  {image ? (
                    <div
                      style={{
                        minHeight: "400px",
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: getBackgroundPosition(trainer.name),
                      }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center bg-zinc-800"
                      style={{ minHeight: "400px" }}
                    >
                      <span className="font-heading text-4xl font-bold text-grayText">
                        {trainer.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <h3 className="mt-3 font-heading text-base font-semibold uppercase text-white">
                    {trainer.name}
                  </h3>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </section>
    </>
  );
}
