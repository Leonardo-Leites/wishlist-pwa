# 🎁 Wishlist Online

Uma wishlist simples e funcional, integrada ao **Google Sheets** como backend e publicada online via **Vercel**.  
Permite visualizar itens, acessar links externos e registrar compras de forma segura, evitando compras duplicadas.

🔗 **Projeto online:** *https://wishlist-pwa.vercel.app/*

---

## ✨ Funcionalidades

- 📄 Lista de itens carregada diretamente de uma planilha Google
- 🖼️ Exibição de imagem do item (via link)
- 🔗 Link externo para o produto (abre em nova aba)
- ➖ Controle de quantidade disponível
- 🔒 Prevenção de compras simultâneas (LockService)
- 🚫 Botão desabilitado quando o item está esgotado
- ⚠️ Alerta quando o item já não possui estoque
- 🌐 Frontend em React
- ☁️ Backend serverless com Google Apps Script

---

## 🧱 Arquitetura

React (Vercel)
→ GET / POST
Google Apps Script (API)
→
Google Sheets (Banco de dados)


---

## 📊 Estrutura da Planilha

A planilha deve se chamar **`Wishlist`** e conter as colunas abaixo, **nesta ordem**:

| Coluna | Nome       | Descrição |
|------|------------|-----------|
| A    | id         | Identificador numérico único |
| B    | nome       | Nome do item |
| C    | imagem     | URL da imagem do item |
| D    | link       | URL para compra ou detalhes |
| E    | quantidade | Quantidade disponível |
| F    | comprado   | Boolean (`true` quando quantidade = 0) |

⚠️ **Importante:**  
As posições das colunas são usadas diretamente no script.

---

## 🔌 API (Google Apps Script)

### GET

Retorna todos os itens da wishlist.

### POST

```http
Registra a compra de 1 unidade de um item.
{
  "token": "SEU_TOKEN",
  "id": 1,
  "action": "buy"
}

Respostas possíveis

{
  "status": "ok",
  "data": {
    "id": 1,
    "quantidade": 2
  }
}
{
  "status": "error",
  "message": "Item esgotado"
}
```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
