
"use strict";

const API_URL = "http://localhost:3001/produtos";

const formulario = document.getElementById("form-produto");
const listaAdmin = document.getElementById("lista-admin");

const formularioEdicao = document.getElementById("form-editar");
const areaEdicao = document.getElementById("form-edicao");

// LISTAR PRODUTOS

async function carregarProdutos() {
    const resposta = await fetch(API_URL);
    const produtos = await resposta.json();

    listaAdmin.innerHTML = "";

    produtos.forEach(produto => {
        const card = document.createElement("article");

        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>Categoria: ${produto.categoria}</p>
            <p>Volume: ${produto.volume}</p>
            <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
            <p>Estoque: ${produto.estoque}</p>

            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        `;

        card.querySelector(".editar").addEventListener("click", () => {
            areaEdicao.style.display = "block";

            document.getElementById("editar-id").value = produto.id;
            document.getElementById("editar-nome").value = produto.nome;
            document.getElementById("editar-categoria").value = produto.categoria;
            document.getElementById("editar-volume").value = produto.volume;
            document.getElementById("editar-preco").value = produto.preco;
            document.getElementById("editar-estoque").value = produto.estoque;
            document.getElementById("editar-imagem").value = produto.imagem;
            document.getElementById("editar-descricao").value = produto.descricao;
        });

        card.querySelector(".excluir").addEventListener("click", async () => {
            const confirmar = confirm("Deseja excluir este produto?");

            if (confirmar) {
                await fetch(`${API_URL}/${produto.id}`, {
                    method: "DELETE"
                });

                carregarProdutos();
            }
        });

        listaAdmin.appendChild(card);
    });
}

// CADASTRAR PRODUTO

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const novoProduto = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        volume: document.getElementById("volume").value,
        preco: Number(document.getElementById("preco").value),
        estoque: Number(document.getElementById("estoque").value),
        imagem: document.getElementById("imagem").value,
        descricao: document.getElementById("descricao").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoProduto)
    });

    alert("Produto cadastrado!");

    formulario.reset();

    carregarProdutos();
});

// EDITAR PRODUTO

formularioEdicao.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const id = document.getElementById("editar-id").value;

    const produtoAtualizado = {
        id: id,
        nome: document.getElementById("editar-nome").value,
        categoria: document.getElementById("editar-categoria").value,
        volume: document.getElementById("editar-volume").value,
        preco: Number(document.getElementById("editar-preco").value),
        estoque: Number(document.getElementById("editar-estoque").value),
        imagem: document.getElementById("editar-imagem").value,
        descricao: document.getElementById("editar-descricao").value
    };

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoAtualizado)
    });

    alert("Produto atualizado!");

    formularioEdicao.reset();
    areaEdicao.style.display = "none";

    carregarProdutos();
});

// CANCELAR EDIÇÃO

document.getElementById("cancelar-edicao").addEventListener("click", () => {
    formularioEdicao.reset();
    areaEdicao.style.display = "none";
});

// INICIAR LISTAGEM

carregarProdutos();
