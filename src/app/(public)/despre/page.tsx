import { Metadata } from "next";
import { Check, Dumbbell, Heart, Users, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Despre Noi | CrossFit Nord BVS",
  description:
    "Afla mai multe despre CrossFit Nord BVS - istoria noastra, valorile si echipa de antrenori certificati.",
};

const values = [
  {
    icon: Dumbbell,
    title: "Performanta",
    description:
      "Ne concentram pe progresul fiecarui membru, indiferent de nivelul de experienta. Fiecare antrenament este o oportunitate de a deveni mai bun.",
  },
  {
    icon: Users,
    title: "Comunitate",
    description:
      "Suntem mai mult decat o sala. Suntem o familie care se sustine reciproc, se motiveaza si sarbatoreste fiecare victorie impreuna.",
  },
  {
    icon: Heart,
    title: "Sanatate",
    description:
      "Credem ca fitness-ul trebuie sa fie sustenabil. Promovam un stil de viata echilibrat, cu accent pe miscare corecta si recuperare.",
  },
  {
    icon: Trophy,
    title: "Excelenta",
    description:
      "Ridicam standardele in tot ceea ce facem - de la calitatea antrenamentelor la echipamente si la modul in care interactionam cu membrii nostri.",
  },
];

const certifications = [
  "CrossFit Affiliate acreditat",
  "Antrenori cu certificare Level 3",
  "Certificare de prim ajutor",
  "Cursuri de nutritie sportiva",
  "Specializare in mobilitate si recuperare",
];

export default function DesprePage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <h1 className="text-center font-heading text-4xl font-bold text-gold">
          DESPRE NOI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-grayText">
          Descopera povestea CrossFit Nord BVS si ce ne face diferiti.
        </p>

        {/* History section */}
        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold tracking-widest text-gold">
              POVESTEA NOASTRA
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-white">
              MAI MULT DE 7 ANI DE EXPERIENTA
            </h2>
            <p className="mt-6 leading-relaxed text-grayText">
              CrossFit Nord BVS a fost fondat cu o viziune simpla: sa creeze un
              spatiu unde oamenii pot deveni cea mai buna versiune a lor. De la
              inceputurile noastre modeste, am crescut intr-o comunitate
              puternica de sute de membri pasionati de miscare si performanta.
            </p>
            <p className="mt-4 leading-relaxed text-grayText">
              De-a lungul anilor, am investit constant in echipamente de ultima
              generatie, am atras antrenori de top si am dezvoltat programe care
              se adapteaza nevoilor fiecarui membru. Fie ca esti la primul
              antrenament sau te pregatesti pentru competitii, aici gasesti tot
              ce ai nevoie.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-64 rounded-lg bg-cardBg" />
            <div className="h-64 rounded-lg bg-cardBg" />
          </div>
        </div>

        {/* Values section */}
        <div className="mt-24">
          <h2 className="text-center font-heading text-3xl font-bold text-white">
            VALORILE NOASTRE
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-lg border border-zinc-800 bg-cardBg p-6 transition hover:border-gold/30"
              >
                <value.icon className="h-8 w-8 text-gold" />
                <h3 className="mt-4 font-heading text-lg font-bold text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grayText">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications section */}
        <div className="mt-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="h-80 rounded-lg bg-cardBg" />
          <div>
            <span className="text-sm font-semibold tracking-widest text-gold">
              CERTIFICARI
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-white">
              ANTRENORI CERTIFICATI
            </h2>
            <p className="mt-6 leading-relaxed text-grayText">
              Echipa noastra este formata din antrenori cu certificari
              internationale, dedicati sa ofere antrenamente sigure, eficiente si
              adaptate fiecarui nivel de pregatire.
            </p>
            <ul className="mt-8 space-y-3">
              {certifications.map((cert) => (
                <li key={cert} className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-gold" />
                  <span className="text-white">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-24 rounded-lg border border-zinc-800 bg-cardBg p-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            GATA SA INCEPI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-grayText">
            Vino sa faci parte din comunitatea CrossFit Nord BVS. Prima
            sedinta de antrenament este gratuita!
          </p>
          <a
            href="/contact"
            className="mt-8 inline-block rounded bg-gold px-8 py-3 font-bold text-darkBg transition hover:bg-goldHover"
          >
            CONTACTEAZA-NE
          </a>
        </div>
      </div>
    </section>
  );
}
