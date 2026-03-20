"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="font-heading text-large-num text-white">
      {count}
      {suffix}
    </span>
  );
}

const offerings = [
  "Antrenamente de CrossFit de grup",
  "Programare individualizata",
  "Comunitate puternica",
  "Coaching profesionist",
  "Echipament complet",
];

export default function AboutUs() {
  return (
    <section
      id="despre-noi"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#121212",
        padding: "6em 1em",
      }}
    >
      {/* Background overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg2.png)",
          backgroundPosition: "top right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "20% auto",
          opacity: 0.1,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col">
            <AnimateOnScroll animation="fade-in-up">
              <Image
                src="/images/about-girl.png"
                alt="CrossFit training"
                width={755}
                height={726}
                className="w-full object-cover"
              />
            </AnimateOnScroll>

            {/* Decorative gradient bar */}
            <div
              className="h-2 w-full"
              style={{
                background:
                  "linear-gradient(220deg, #121212 0%, #5A5A5A 100%)",
              }}
            />

            {/* LET'S MEET block with counter */}
            <div
              className="flex items-center gap-6 p-6"
              style={{
                background:
                  "linear-gradient(220deg, #121212 0%, #5A5A5A 100%)",
              }}
            >
              <div className="flex flex-col">
                <span className="font-heading text-lg font-semibold uppercase tracking-widest text-white">
                  LET&apos;S MEET
                </span>
              </div>
              <div className="flex flex-col items-center">
                <AnimatedCounter target={100} suffix="+" duration={2000} />
                <span className="font-body text-sm text-white">membri</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <AnimateOnScroll animation="fade-in-right">
            <div className="flex flex-col gap-6">
              <h6
                className="font-body text-h6 font-medium uppercase"
                style={{ color: "#E7B913", letterSpacing: "6px" }}
              >
                Despre noi
              </h6>

              <h2 className="font-heading text-h2 uppercase text-white">
                SALA AFILIATA
                <br />
                CrossFit Inc. DIN 2016
              </h2>

              <p className="font-body text-base leading-relaxed text-white">
                CrossFit Nord BVS este mai mult decat o sala de fitness. Suntem o
                comunitate dedicata performantei si bunastarii. Cu antrenori
                certificati si un mediu motivant, te ajutam sa iti atingi
                potentialul maxim, indiferent de nivelul tau de pregatire.
              </p>

              <h5 className="font-heading text-h5 uppercase text-white">
                CE ITI OFERIM
              </h5>

              <ul className="space-y-3">
                {offerings.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: "#FB3C3C" }}
                    />
                    <span className="font-body text-base text-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
