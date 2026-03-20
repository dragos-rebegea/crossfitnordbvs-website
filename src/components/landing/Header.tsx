"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Acasă", anchor: "#acasa" },
  { label: "Despre noi", anchor: "#despre-noi" },
  { label: "Echipa", anchor: "#echipa" },
  { label: "Înscrie-te", anchor: "#membru" },
  { label: "Pachete", anchor: "#oferte" },
  { label: "Contact", anchor: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#acasa");
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
    if (!isLanding) return;

    const sectionIds = ["acasa", "despre-noi", "echipa", "membru", "oferte", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-100px 0px 0px 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [isLanding]);

  function getHref(anchor: string) {
    return isLanding ? anchor : `/${anchor}`;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 3,
        backgroundColor: "#121212",
        boxShadow: "0px 10px 10px 0px rgba(0,0,0,0.15)",
        minHeight: "12vh",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          minHeight: "12vh",
          padding: "0 40px",
        }}
      >
        {/* Column 1 - Logo */}
        <div
          style={{ width: "20%", flexShrink: 0 }}
          className="max-[1024px]:!w-[50%]"
        >
          <Link href="/" style={{ display: "block", width: "70%" }} className="max-[1024px]:!w-full">
            <Image
              src="/images/logo.png"
              alt="CrossFit Nord BVS"
              width={300}
              height={80}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Link>
        </div>

        {/* Column 2 - Desktop Navigation */}
        <nav
          style={{
            width: "55%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
          className="max-[1024px]:!hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.anchor}
              href={getHref(link.anchor)}
              className={`nav-link${activeSection === link.anchor ? " nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Column 3 - Desktop Buttons */}
        <div
          style={{
            width: "24%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
          }}
          className="max-[1024px]:!hidden"
        >
          <Link href="/login" className="btn-header">
            Intră in cont
          </Link>
          <Link href="/orar" className="btn-header">
            ORAR
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div
          style={{
            width: "50%",
            display: "none",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          className="max-[1024px]:!flex"
        >
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  padding: "8px",
                }}
                aria-label="Meniu"
              >
                <Menu size={28} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              style={{
                backgroundColor: "#121212",
                borderLeft: "1px solid #333",
              }}
            >
              <SheetTitle className="sr-only">Meniu navigare</SheetTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  marginTop: "32px",
                  padding: "0 16px",
                }}
              >
                <nav
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.anchor}
                      href={getHref(link.anchor)}
                      onClick={() => setOpen(false)}
                      className={`nav-link${activeSection === link.anchor ? " nav-link-active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #333",
                  }}
                >
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="btn-header"
                    style={{ textAlign: "center" }}
                  >
                    Intră in cont
                  </Link>
                  <Link
                    href="/orar"
                    onClick={() => setOpen(false)}
                    className="btn-header"
                    style={{ textAlign: "center" }}
                  >
                    ORAR
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
