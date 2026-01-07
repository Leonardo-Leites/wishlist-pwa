import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_TOKEN;

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      setItems(
        data.map(item => ({
          ...item,
          quantidade: Number(item.quantidade)
        }))
      );
    } catch (err) {
      alert("Erro ao carregar wishlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

 async function comprar(id) {
  try {
    setBuyingId(id);

    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        token: TOKEN,
        id: id,
        action: "buy"
      })
    });

    if (!response.ok) {
      console.error("Erro HTTP:", response.status);
      return;
    }

    const result = await response.json();

    if (result.status !== "ok") {
      console.error("Erro API:", result.message);
      
       if (result.message === "Item esgotado") {
          alert("Item esgotado");
          window.location.reload();
        }

      return;
    }

    await carregar();

  } catch (err) {
    console.error("Erro no fetch:", err);
  }finally {
      setBuyingId(null);
  }
}

  if (loading) {
    return <p>Carregando...</p>;
  }

   return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 40,
        fontFamily: "sans-serif"
      }}
    >
      <main style={{ width: "100%", maxWidth: 600 }}>
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>
          🎁 Wishlist
        </h1>

        <ul style={{ padding: 0, margin: 0 }}>
          {items.map(item => {
            const esgotado = item.quantidade === 0;

            return (
              <li
                key={item.id}
                style={{
                  listStyle: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee",
                  opacity: esgotado ? 0.6 : 1
                }}
              >
                <div style={{ flex: 1 }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: esgotado ? "line-through" : "none",
                      // color: "#000",
                      fontWeight: 500
                    }}
                  >
                    {item.nome}
                  </a>

                  <div style={{ fontSize: 14, color: "#555" }}>
                    restam {item.quantidade}
                  </div>
                </div>

                <button
                  onClick={() => comprar(item.id)}
                  disabled={esgotado || buyingId === item.id}
                  style={{
                    marginLeft: 16,
                    padding: "6px 12px",
                    cursor:
                      esgotado || buyingId === item.id
                        ? "not-allowed"
                        : "pointer"
                  }}
                >
                  {buyingId === item.id ? "Comprando..." : "Comprar 1"}
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}