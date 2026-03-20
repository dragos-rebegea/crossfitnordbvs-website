import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg px-4">
      <div className="text-center">
        <h1 className="font-heading text-8xl font-bold text-gold">404</h1>
        <h2 className="mt-4 font-heading text-2xl font-bold text-white">
          Pagina nu a fost gasita
        </h2>
        <p className="mt-2 text-grayText">
          Pagina pe care o cauti nu exista sau a fost mutata.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-gold px-8 py-3 font-bold text-darkBg transition hover:bg-goldHover"
        >
          Inapoi la pagina principala
        </Link>
      </div>
    </div>
  );
}
