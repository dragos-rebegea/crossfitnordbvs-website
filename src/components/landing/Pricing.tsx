import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

interface Package {
  id: string;
  name: string;
  type: string;
  sessions: number | null;
  duration: number;
  price: number;
  isPopular: boolean;
}

interface PricingProps {
  packages: Package[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Pricing({ packages }: PricingProps) {
  return (
    <section
      id="oferte"
      style={{
        background: "linear-gradient(180deg, #282828 0%, #121212 35%)",
        padding: "6em 1em",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div
            className="rounded-lg"
            style={{
              background: "linear-gradient(220deg, #121212 0%, #5A5A5A 100%)",
              padding: "2em",
            }}
          >
            <h6
              className="font-body uppercase"
              style={{
                color: "#E7B913",
                fontSize: "1.063rem",
                fontWeight: 500,
                letterSpacing: "6px",
              }}
            >
              Devino membru!
            </h6>

            <h2 className="mt-4 font-heading text-h2 uppercase text-white">
              CrossFit NUTRITIE PRIVATE TRAINING
            </h2>

            <p className="mt-4 text-grayText">
              Fie ca vrei sa te antrenezi in grup la clasele de CrossFit, sa iti
              imbunatatesti nutritia cu ajutorul unui specialist sau sa
              beneficiezi de sesiuni personalizate de private training, avem
              pachetul potrivit pentru tine.
            </p>

            <div className="my-8" />

            <h3 className="font-heading text-h3 uppercase text-white">
              NU UITA!
            </h3>

            <p className="mt-3 text-grayText">
              Prima sedinta de CrossFit este gratuita. Vino sa ne cunosti echipa
              si sa descoperi ce inseamna antrenamentul functional!
            </p>
          </div>

          {/* Right Column - Image Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 - CrossFit */}
            <AnimateOnScroll animation="fade-in-up">
              <a href="/pachete" className="group block">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/images/crossfit-card.jpg"
                    alt="CrossFit"
                    width={400}
                    height={600}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 transition-transform duration-300 group-hover:scale-[1.04]">
                  <span className="font-heading text-h6 font-semibold uppercase text-white">
                    CrossFit
                  </span>
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </a>
            </AnimateOnScroll>

            {/* Card 2 - Nutritie & Training */}
            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <a href="/pachete" className="group block">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/images/training-card.jpg"
                    alt="1:1 Nutritie si Training"
                    width={400}
                    height={600}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 transition-transform duration-300 group-hover:scale-[1.04]">
                  <span className="font-heading text-h6 font-semibold uppercase text-white">
                    1:1 Nutritie si Training
                  </span>
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </a>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
