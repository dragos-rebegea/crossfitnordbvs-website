"use client";

import { useState } from "react";
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
  { label: "Acasa", anchor: "#acasa" },
  { label: "Despre noi", anchor: "#despre-noi" },
  { label: "Echipa", anchor: "#echipa" },
  { label: "Inscrie-te", anchor: "#membru" },
  { label: "Pachete", anchor: "#oferte" },
  { label: "Contact", anchor: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

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
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          minHeight: "12vh",
          padding: "0 15px",
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
              className="group"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.063rem",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#FFFFFF",
                textDecoration: "none",
                position: "relative",
                paddingBottom: "4px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FB3C3C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
              }}
            >
              {link.label}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#FB3C3C",
                  transform: "scaleX(0)",
                  transformOrigin: "center",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  opacity: 0,
                }}
                className="group-hover:!scale-x-100 group-hover:!opacity-100"
              />
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
          }}
          className="max-[1024px]:!hidden"
        >
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.063rem",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "transparent",
              border: "2px solid #FB3C3C",
              borderRadius: "1px",
              padding: "10px",
              textDecoration: "none",
              transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FB3C3C";
              e.currentTarget.style.borderColor = "#FB3C3C";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#FB3C3C";
              e.currentTarget.style.color = "#FFFFFF";
            }}
          >
            INTRA IN CONT
          </Link>
          <Link
            href="/orar"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.063rem",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "transparent",
              border: "2px solid #FB3C3C",
              borderRadius: "1px",
              padding: "10px",
              textDecoration: "none",
              marginLeft: "20px",
              transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FB3C3C";
              e.currentTarget.style.borderColor = "#FB3C3C";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#FB3C3C";
              e.currentTarget.style.color = "#FFFFFF";
            }}
          >
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
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.063rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FB3C3C";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
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
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.063rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      backgroundColor: "transparent",
                      border: "2px solid #FB3C3C",
                      borderRadius: "1px",
                      padding: "10px",
                      textDecoration: "none",
                      textAlign: "center",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FB3C3C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    INTRA IN CONT
                  </Link>
                  <Link
                    href="/orar"
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.063rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      backgroundColor: "transparent",
                      border: "2px solid #FB3C3C",
                      borderRadius: "1px",
                      padding: "10px",
                      textDecoration: "none",
                      textAlign: "center",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FB3C3C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
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
