
"use strict";

const API_URL = "http://localhost:3001/produtos";

const listaProdutos = document.getElementById("lista-produtos");
const pesquisa = document.getElementById("pesquisa");
const categoria = document.getElementById("categoria");
const modal = document.getElementById("modal-produto");
const detalhesProduto = document.getElementById("detalhes-produto");
const fecharModal = document.getElementById("fechar-modal");

let produtos = [];

async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);

        produtos = await resposta.json();

        mostrarProdutos(produtos);

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

function mostrarProdutos(lista) {
    listaProdutos.innerHTML = "";

    if (lista.length === 0) {
        listaProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    lista.forEach(produto => {
        const card = document.createElement("article");

        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            abrirModal(produto);
        });

        const disponibilidade = produto.estoque > 0
            ? "Disponível"
            : "Esgotado";

        card.innerHTML = `
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                class="imagem-produto"
            >

            <h3>${produto.nome}</h3>
            <p>Categoria: ${produto.categoria}</p>
            <p>Volume: ${produto.volume}</p>
            <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
            <p>Estoque: ${disponibilidade}</p>
            <p>${produto.descricao}</p>
        `;

        listaProdutos.appendChild(card);
    });
}

function abrirModal(produto) {
    detalhesProduto.innerHTML = `
        <h2>${produto.nome}</h2>
        <p><strong>Categoria:</strong> ${produto.categoria}</p>
        <p><strong>Volume:</strong> ${produto.volume}</p>
        <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
        <p><strong>Estoque:</strong> ${produto.estoque > 0 ? "Disponível" : "Esgotado"}</p>
        <p><strong>Descrição:</strong> ${produto.descricao}</p>
    `;

    modal.style.display = "flex";
}

pesquisa.addEventListener("input", filtrarProdutos);
categoria.addEventListener("change", filtrarProdutos);

function filtrarProdutos() {
    const texto = pesquisa.value.toLowerCase();
    const categoriaSelecionada = categoria.value;

    const resultado = produtos.filter(produto => {
        const correspondeNome = produto.nome.toLowerCase().includes(texto);

        const correspondeCategoria = categoriaSelecionada === ""
            || produto.categoria === categoriaSelecionada;

        return correspondeNome && correspondeCategoria;
    });

    mostrarProdutos(resultado);
}

fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
        modal.style.display = "none";
    }
});

carregarProdutos();
