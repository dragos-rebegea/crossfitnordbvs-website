import Link from "next/link";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export default function Membership() {
  return (
    <section
      id="membru"
      className="relative flex items-center justify-center"
      style={{ minHeight: "80vh" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/member-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#121212", opacity: 0.7 }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 py-16 text-center sm:px-6 md:py-24">
        <AnimateOnScroll animation="fade-in-up">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-heading text-[2rem] font-bold uppercase text-white md:text-h1">
              DEVINO MEMBRU
            </h1>

            <p className="mt-6 font-body text-base text-white">
              Alatura-te comunitatii CrossFit Nord BVS si incepe-ti
              transformarea inca de astazi. Oferim pachete flexibile pentru
              toate nivelurile de experienta, de la incepatori la avansati.
            </p>

            <p className="mt-4 font-body text-base text-white">
              Indiferent daca vrei sa slabesti, sa castigi masa musculara sau
              sa iti imbunatatesti conditia fizica generala, echipa noastra de
              antrenori te va ghida la fiecare pas.
            </p>

            <div className="mt-10">
              <Link href="/pachete" className="btn-outline-red">
                Inscrie-te
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
