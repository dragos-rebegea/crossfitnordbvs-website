"use client";

import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { FormEvent, useState } from "react";

const inputStyles =
  "w-full bg-transparent border border-white/20 text-white px-[10px] py-[10px] font-body placeholder:text-grayText focus:outline-none focus:border-white/40";

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #282828 0%, #121212 100%)",
        minHeight: "50vh",
      }}
    >
      {/* Background texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg-texture.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.09,
        }}
      />

      <div className="relative z-10" style={{ padding: "6em 1em" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Column 1 - Map & Logo */}
            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                background:
                  "linear-gradient(180deg, #FB3C3C 0%, #121212 100%)",
                padding: "2em",
              }}
            >
              {/* Inner texture overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: "url(/images/bg-texture.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.05,
                  filter: "brightness(300%)",
                }}
              />

              <div className="relative z-10">
                <Image
                  src="/images/crossfit-llc-white.png"
                  alt="CrossFit LLC"
                  width={150}
                  height={50}
                  className="mb-6"
                />

                <iframe
                  src="https://maps.google.com/maps?q=67-77+Biharia+Street+Bucuresti&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="113"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps - CrossFit Nord BVS"
                />
              </div>
            </div>

            {/* Column 2 - Contact Info */}
            <div className="md:-mt-[11%] md:pl-16">
              <h5 className="font-heading text-h5 uppercase text-brandRed">
                Contact
              </h5>

              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="tel:+40755670628"
                    className="flex items-center gap-3 text-white transition hover:text-brandRed"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brandRed" />
                    <span>+40755670628 Receptie</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+40740540876"
                    className="flex items-center gap-3 text-white transition hover:text-brandRed"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brandRed" />
                    <span>+40740540876 General</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@crossfitnordbvs.ro"
                    className="flex items-center gap-3 text-white transition hover:text-brandRed"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-brandRed" />
                    <span>contact@crossfitnordbvs.ro</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brandRed" />
                  <span>Strada Biharia nr. 67-77, Bucuresti, 013981</span>
                </li>
              </ul>

              <h5 className="mt-5 font-heading text-h5 uppercase text-brandRed">
                social media
              </h5>

              <div className="mt-3 flex items-center gap-4">
                <a
                  href="https://www.facebook.com/CrossFitNordBVS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white transition hover:text-brandRed"
                >
                  <Facebook className="h-5 w-5 fill-current" />
                </a>
                <a
                  href="https://www.instagram.com/crossfitnordbvs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white transition hover:text-brandRed"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Column 3 - Form */}
            <div>
              <h4 className="font-heading text-h4 uppercase text-brandRed">
                Completeaza formularul
              </h4>

              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-[10px]"
              >
                <input
                  type="text"
                  placeholder="Nume"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputStyles}
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={inputStyles}
                />
                <input
                  type="email"
                  placeholder="Adresa Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputStyles}
                />
                <textarea
                  placeholder="Mesaj"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${inputStyles} resize-none`}
                />
                <button
                  type="submit"
                  className="w-full bg-greenAccent py-3 font-heading font-semibold uppercase text-white transition hover:brightness-110"
                >
                  Trimite
                </button>
              </form>
            </div>
          </div>

          {/* Copyright Bar */}
          <div
            className="mt-12 pt-6 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-sm text-grayText">
              Copyright 2023 &copy; CrossFit Nord BVS - Toate drepturile
              rezervate. Creat de webaround.ro
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
