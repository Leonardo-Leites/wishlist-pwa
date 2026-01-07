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
    <main style={{ maxWidth: 600, margin: "auto", fontFamily: "sans-serif" }}>
      <h1>🎁 Wishlist</h1>

      <ul style={{ padding: 0 }}>
        {items.map(item => {
          const esgotado = item.quantidade === 0;
          const comprando = buyingId === item.id;

          return (
            <li
              key={item.id}
              style={{
                listStyle: "none",
                marginBottom: 12,
                opacity: esgotado ? 0.6 : 1
              }}
            >
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: esgotado ? "line-through" : "none",
                  marginRight: 8
                }}
              >
                {item.nome}
              </a>

              <span style={{ marginRight: 8 }}>
                (restam {item.quantidade})
              </span>

              <button
                disabled={esgotado || comprando}
                style={{
                  cursor: esgotado ? "not-allowed" : "pointer",
                  opacity: esgotado ? 0.5 : 1
                }}
                onClick={() => comprar(item.id)}
              >
                {comprando ? "Comprando..." : "Comprar 1"}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}