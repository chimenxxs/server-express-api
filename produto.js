const express = require('express');
const routes = express.Router();

let produtos = [];
let idAtual = 1;

// GET - Listar todos os produtos
routes.get('/', (req, res) => {
  res.status(200).json(produtos);
});

// POST - Criar novo produto
routes.post('/', (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || !descricao || !preco || !estoque) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  const novoProduto = {
    id: idAtual++,
    nome,
    descricao,
    preco,
    estoque
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// PUT - Atualizar produto por ID
routes.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque } = req.body;

  const produto = produtos.find(p => p.id == id);

  if (!produto) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  if (!nome || !descricao || !preco || !estoque) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  produto.nome = nome;
  produto.descricao = descricao;
  produto.preco = preco;
  produto.estoque = estoque;

  res.status(200).json(produto);
});

// DELETE - Remover produto por ID
routes.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = produtos.findIndex(p => p.id == id);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  produtos.splice(index, 1);
  res.status(200).json({ mensagem: `Produto com ID ${id} foi excluído com sucesso.` });
});

module.exports = routes;
