import { NextPageContext } from "next";

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        color: "#f5f5f5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", color: "#E7B913", margin: 0 }}>
          {statusCode || "Eroare"}
        </h1>
        <p style={{ color: "#7A7A7A", marginTop: "1rem" }}>
          {statusCode === 404
            ? "Pagina nu a fost gasita"
            : "A aparut o eroare"}
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            backgroundColor: "#E7B913",
            color: "#121212",
            padding: "12px 32px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Inapoi la pagina principala
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
