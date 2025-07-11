// Importar os módulos
const express = require('express');
const routes = express.Router();

// importa a conexão com o banco de dados
const db = require('../db/connect');

// GET (Read)
// Rota para listar todos os produtos
routes.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM produto');
  res.status(200).json(result.rows);
});

// POST (Create)
// Rota para adicionar um novo produto
routes.post('/', async (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || !descricao || !preco || !estoque) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios.',
    });
  }

  const sql = `
    INSERT INTO produto (nome, descricao, preco, estoque)
    VALUES ($1, $2, $3, $4) RETURNING *
  `;

  const valores = [nome, descricao, preco, estoque];
  const result = await db.query(sql, valores);

  res.status(201).json(result.rows[0]);
});

// PUT (Update)
// Rota para atualizar os dados de um produto
routes.put('/:id', async (req, res) => {
  const { id } = req.params;

  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || !descricao || !preco || !estoque) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios.',
    });
  }

  const sql = `
    UPDATE produto
    SET nome = $1, descricao = $2, preco = $3, estoque = $4
    WHERE id = $5
    RETURNING *
  `;

  const valores = [nome, descricao, preco, estoque, id];
  const result = await db.query(sql, valores);

  if (result.rows.length === 0) {
    return res.status(404).json({
      mensagem: 'Produto não encontrado.',
    });
  }

  res.status(200).json(result.rows[0]);
});

// DELETE (Delete)
// Rota para deletar um produto do banco de dados
routes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM produto
    WHERE id = $1
    RETURNING *
  `;

  const valores = [id];
  const result = await db.query(sql, valores);

  if (result.rows.length === 0) {
    return res.status(404).json({
      mensagem: 'Produto não encontrado.',
    });
  }

  res.status(200).json({
    mensagem: `Produto com ID ${id} foi excluído com sucesso.`,
  });
});

// Exportar o módulo com as rotas
module.exports = routes;
