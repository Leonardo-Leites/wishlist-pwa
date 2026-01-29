import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_TOKEN;

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [tagSelecionada, setTagSelecionada] = useState("todas");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      setItems(
        data.map((item) => ({
          ...item,
          id: Number(item.id),
          quantidade: Number(item.quantidade),
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

      if (!confirm("Tem certeza que deseja comprar este item?")) {
        return;
      }
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          token: TOKEN,
          id: id,
          action: "buy",
        }),
      });

      const result = await response.json();

      if (result.status !== "ok") {
        console.error("Erro API:", result.message);

        if (result.message === "Item esgotado") {
          alert("Item esgotado");
          await carregar();
        }

        return;
      }

      await carregar();
    } catch (err) {
      console.error("Erro no fetch:", err);
    } finally {
      setBuyingId(null);
    }
  }

  // 🔽 TAGS ÚNICAS
  const tags = [
    "todas",
    ...new Set(items.map((item) => item.tag).filter(Boolean)),
  ];

  // 🔽 FILTRO
  const itemsFiltrados =
    tagSelecionada === "todas"
      ? items
      : items.filter((item) => item.tag === tagSelecionada);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 40,
        fontFamily: "sans-serif",
      }}
    >
      <main
        style={{
          maxWidth: 640,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginBottom: 24 }}>🎁 Minha Casa, Minha Vida</h1>

        <h4 style={{ textAlign: "center" }}>
          Oi! 👋 <br />
          Aqui é a Bibi e o Léo.
          Este é o nosso Minha Casa, Minha Vida, só que sem governo e com o apoio financeiro (e fundamental) de vocês. 
          💛 <br />
          Aqui você encontra uma lista de itens que ainda precisamos. Ao clicar
          no nome do item, você será redirecionado para o link do produto que
          encontramos com o melhor preço no momento. <br />
          <br />
          Se você quiser ajudar comprando algum item, é só clicar em
          <strong> “Comprar 1”</strong>. Isso vai atualizar a lista e avisar a
          gente (e as outras pessoas) que alguém demonstrou a intenção de compra
          daquele item. <br />
          Importante: este site <strong>não realiza a compra</strong> e não
          garante reserva, ele serve apenas como uma forma de organização e
          comunicação para evitar compras duplicadas 😊 <br />
          <br />
          Não achou nada que caiba no bolso? Sem problemas: aceitamos Pix 😶‍🌫️
          51998767740 ou 51997082811. <br />
          Obrigada por ajudarem esse lar a existir ❤️ <br />
          Bibi & Léo
        </h4>

        {/* DROPDOWN */}
        <select
          value={tagSelecionada}
          onChange={(e) => setTagSelecionada(e.target.value)}
          style={{
            margin: "24px 0",
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <ul style={{ padding: 0, margin: 0, width: "100%" }}>
          {itemsFiltrados.map((item) => {
            const esgotado = item.quantidade === 0;

            return (
              <li
                key={item.id}
                style={{
                  listStyle: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 0",
                }}
              >
                {/* CARD */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 560,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: 12,
                    border: "1px solid #eee",
                    borderRadius: 8,
                    opacity: esgotado ? 0.6 : 1,
                  }}
                >
                  {/* IMAGEM */}
                  {item.imagem && (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}

                  {/* TEXTO */}
                  <div style={{ flex: 1 }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: esgotado ? "line-through" : "none",
                        fontWeight: 500,
                      }}
                    >
                      {item.nome}
                    </a>

                    <div style={{ fontSize: 14, color: "#555" }}>
                      meta {item.quantidade}
                    </div>
                  </div>

                  {/* BOTÃO */}
                  <button
                    onClick={() => comprar(item.id)}
                    disabled={esgotado || buyingId === item.id}
                    style={{
                      padding: "6px 12px",
                      cursor:
                        esgotado || buyingId === item.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {buyingId === item.id ? "Comprando..." : "Comprar 1"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
