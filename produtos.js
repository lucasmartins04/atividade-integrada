
"use strict";

const API_URL = "http://localhost:3001/produtos";

const listaProdutos = document.getElementById("lista-produtos");
const pesquisa = document.getElementById("pesquisa");
const categoria = document.getElementById("categoria");

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

        const disponibilidade = produto.estoque > 0
            ? "Disponível"
            : "Esgotado";

        card.innerHTML = `
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

carregarProdutos();
