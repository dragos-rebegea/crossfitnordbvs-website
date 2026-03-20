import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | CrossFit Nord BVS",
  description:
    "Contacteaza-ne pentru informatii despre abonamente, antrenamente si orice intrebare. CrossFit Nord BVS, Bucuresti.",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Adresa",
    value: "Str. Exemplu nr. 10, Bucuresti, Romania",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+40 700 000 000",
    href: "tel:+40700000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@crossfitnordbvs.ro",
    href: "mailto:contact@crossfitnordbvs.ro",
  },
  {
    icon: Clock,
    label: "Program",
    value: "Luni - Vineri: 07:00 - 21:00 | Sambata: 09:00 - 14:00",
  },
];

export default function ContactPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-heading text-4xl font-bold text-gold">
          CONTACT
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-grayText">
          Ai intrebari? Trimite-ne un mesaj si iti vom raspunde cat mai curand
          posibil.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact form */}
          <ContactForm />

          {/* Contact info + map */}
          <div>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gold/10">
                    <info.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-grayText transition hover:text-gold"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-grayText">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed placeholder */}
            <div className="mt-8 flex h-64 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-cardBg">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8 text-grayText" />
                <p className="mt-2 text-sm text-grayText">
                  Google Maps embed placeholder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
