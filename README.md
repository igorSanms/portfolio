# 👨‍💻 Portfólio Pessoal - Igor Santana

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

> "Transformando dados em Inteligência."

---

## 📖 Sobre o Projeto

Este projeto foi construído do zero utilizando **React**, **Vite** e **Tailwind CSS**. Muito mais do que uma vitrine estática para meus projetos acadêmicos e pessoais durante a graduação em Ciência da Computação (UFC), esta Single Page Application (SPA) foi desenhada para ser um laboratório de experimentação.

A identidade visual foi criada em torno do modo escuro (*Dark Mode*) com detalhes na cor **Nardo Gray**.

## ✨ Funcionalidades em Destaque

* **🧪 Lab (Playground):**
  * **Simulador de Clusters:** Implementação interativa dos algoritmos K-Means e DBSCAN, permitindo gerar pontos e visualizar o agrupamento de dados em tempo real no Canvas.
  * **Xadrez vs IA (Auto-Evolutiva):** Jogo de xadrez integrado à API do Stockfish, com sistema de dificuldade dinâmica e evolui conforme a partida avança.
* **🌌 Animações Canvas Personalizadas:** 
  * Fundo de rede de partículas responsivas conectadas por proximidade na seção Hero.
  * Esfera em 3D de "Espaço Latente" acompanhando o movimento do mouse no rodapé.
* **📂 Galeria de Projetos Dinâmica:**
  * Cards inteligentes com badges dinâmicos de status (ex: "Privado", "Em andamento").
  * Lógica de expansão "Veja mais/Ver menos" e redirecionamento de links externos.
* **🎭 Efeito Curtain-Reveal:** Transição suave e moderna que revela o rodapé fixo ao final da rolagem da página.
* **📧 Contato Inteligente:** Formulário modal com integração direta para abertura do Gmail com assunto e corpo da mensagem pré-formatados.

## 🛠️ Tecnologias Utilizadas

* **Framework & Build:** React.js + Vite
* **Estilização:** Tailwind CSS (com classes utilitárias e gradientes customizados)
* **Ícones & UI:** Lucide React e React Icons
* **Lógica Avançada:** `chess.js` e `react-chessboard` para o motor do jogo, e HTML5 Canvas API para renderização gráfica e física de partículas.
* **Deploy:** GitHub Pages (via `gh-pages` package)

## 🚀 Como Rodar o Projeto Localmente

Pré-requisitos: É necessário ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/igorSanms/portfolio.git](https://github.com/igorSanms/portfolio.git)
    ```

2.  **Navegue até a pasta do frontend:**
    ```bash
    cd portfolio/frontend
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 📂 Estrutura de Pastas

A arquitetura foi dividida de forma limpa para isolar a lógica complexa dos componentes de UI:

```text
📦 portfolio/frontend/src
 ┣ 📂 components
 ┃ ┣ 📜 About.jsx          # Seção sobre mim e biografia
 ┃ ┣ 📜 Footer.jsx         # Rodapé curtain-reveal com modal de contato e Canvas 3D
 ┃ ┣ 📜 Hero.jsx           # Cabeçalho principal
 ┃ ┣ 📜 Navbar.jsx         # Navegação com Smooth Scroll dinâmico
 ┃ ┣ 📜 NetworkCanvas.jsx  # Lógica do fundo de rede de nós
 ┃ ┣ 📜 Playground.jsx     # Lab (K-Means, DBSCAN, Stockfish Chess)
 ┃ ┗ 📜 Projects.jsx       # Renderização dinâmica dos cards
 ┣ 📜 App.jsx              # Ponto de montagem da SPA
 ┣ 📜 index.css            # Estilos globais (Tailwind e variáveis customizadas)
 ┗ 📜 main.jsx             # Inicialização do React