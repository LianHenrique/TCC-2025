import express from 'express';
import connection from './db.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// --- ROTAS FUNCIONÁRIOS ---

// Buscar funcionário por ID
app.get('/funcionarios/id/:id_funcionario', (req, res) => {
  const { id_funcionario } = req.params;
  connection.query(
    'SELECT * FROM funcionario WHERE id_funcionario = ?',
    [id_funcionario],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar funcionário' });
      if (results.length === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
      res.json(results[0]);
    }
  );
});

// Buscar funcionário por nome via query param
app.get('/funcionarios', (req, res) => {
  const { nome_funcionario } = req.query;

  if (nome_funcionario) {
    connection.query(
      'SELECT * FROM funcionario WHERE nome_funcionario = ?',
      [nome_funcionario],
      (error, results) => {
        if (error) return res.status(500).json({ error: 'Erro ao buscar funcionário' });
        if (results.length === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
        return res.json(results[0]);
      }
    );
  } else {
    // Se não houver query param nome_funcionario, lista todos os funcionários
    connection.query(
      'SELECT * FROM funcionario',
      (error, results) => {
        if (error) return res.status(500).json({ error: 'Erro ao buscar funcionários' });
        res.json(results);
      }
    );
  }
});

//  buscando produto por ID
app.get('/produtos/:id_produto', (requisicao, resposta) => {
    const { id_produto } = requisicao.params;

    connection.query(
        'SELECT id_produto, imagem_url, categoria, nome_produto, QTD_produto, QTD_entrada_produto, data_vencimento_prod FROM insumos WHERE id_produto = ?',
        [id_produto],
        (error, resultados) => {
            if (error) {
                return resposta.status(500).json({ error: 'Erro ao buscar produto' });
            }
            if (resultados.length === 0) {
                return resposta.status(404).json({ error: 'Produto não encontrado' });
            }
            resposta.json(resultados[0]);
        }
    );
});

app.get('/produtos', (req, res) => {
    connection.query(
        'SELECT id_produto, nome_produto, imagem_url, categoria, QTD_produto, QTD_entrada_produto, data_vencimento_prod FROM insumos',
        (error, resultados) => {
            if (error) {
                return res.status(500).json({ error: 'Erro ao buscar produtos' });
            }
            res.json(resultados);
        }
    );
});

// Notificação de quantidade do estoque
app.get('/produtos', (req, res) => {
    connection.query(
        'SELECT QTD_produto, id_produto, nome_produto FROM insumos WHERE QTD_produto <= 10',
        (error, resultados) => {
            if (error) {
                console.log('Erro', error)
            }

            const qtd = resultados[0]?.QTD_produto ?? 0;
            if (qtd <= 10) {
                res.json(resultados);
            } else{
                res.status(204).send("Estoque ok.")
            }
        }
    )
});

app.get('/estoque', (req, res) => {
    res.json({ message: 'Página de estoque encontrada!' });
});



// cadastro adm
app.post("/cliente/insert", (req, res) => {
    const email = req.body.email
    const senha = req.body.senha

    const sql = `INSERT INTO cliente (email_cliente, senha_cliente) VALUES (?, ?)`;
    connection.query(sql, [email, senha], (erro, data) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
        }
        res.status(201).json({ message: 'Cliente cadastrado' });
    });
})

app.post("/insumos/insert", (req, res) => {
    const {
        nome_produto,
        valor_produto,
        filtro, QTD_produto,
        data_vencimento,
        descricao_produto
    } = req.body;

    const sql = `INSERT INTO insumos (nome_produto, valor_produto, filtro, QTD_produto, data_vencimento_prod, descricao_produto) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [nome_produto, valor_produto, filtro, QTD_produto, data_vencimento, descricao_produto], (erro, data) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: 'Erro ao cadastrar insumo' });
        }
        res.status(201).json({ message: 'Insumo cadastrado' });
    });
});

app.post("/funcionarios/insert", (req, res) => {
  const { nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario } = req.body;

  if (!nome_funcionario || !cargo_funcionario || !senha_funcionario || !email_funcionario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const sql = `INSERT INTO funcionario (nome_funcionairo, cargo_funcionario, senha_funcionario, email_funcionario) VALUES (?, ?, ?, ?)`;

  connection.query(sql, [nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }
    res.status(201).json({ message: 'Funcionário cadastrado com sucesso' });
  });
});

// --- ROTAS INSUMOS ---

// Buscar todos insumos
app.get('/insumos', (req, res) => {
  connection.query(
    `SELECT id_produto, nome_produto, valor_produto, filtro, QTD_produto, data_vencimento_prod, descricao_produto FROM insumos`,
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar insumos' });
      res.json(results);
    }
  );
});

// Buscar insumo por id
app.get('/insumos/:id_produto', (req, res) => {
  const { id_produto } = req.params;
  connection.query(
    `SELECT id_produto, nome_produto, valor_produto, filtro, QTD_produto, data_vencimento_prod, descricao_produto FROM insumos WHERE id_produto = ?`,
    [id_produto],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar insumo' });
      if (results.length === 0) return res.status(404).json({ error: 'Insumo não encontrado' });
      res.json(results[0]);
    }
  );
});

// Inserir insumo
app.post('/insumos/insert', (req, res) => {
  const { nome_produto, valor_produto, filtro, QTD_produto, data_vencimento, descricao_produto } = req.body;

  if (!nome_produto || !valor_produto || !filtro || !QTD_produto || !data_vencimento || !descricao_produto) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const sql = `INSERT INTO insumos (nome_produto, valor_produto, filtro, QTD_produto, data_vencimento_prod, descricao_produto) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [nome_produto, valor_produto, filtro, QTD_produto, data_vencimento, descricao_produto], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar insumo' });
    }
    res.status(201).json({ message: 'Insumo cadastrado com sucesso' });
  });
});

// --- ROTAS PRODUTOS ---

// Buscar produto por ID
app.get('/produtos/:id_produto', (req, res) => {
  const { id_produto } = req.params;

  connection.query(
    `SELECT id_produto, imagem_url, categoria, nome_produto, QTD_produto, QTD_entrada_produto, data_vencimento_prod FROM insumos WHERE id_produto = ?`,
    [id_produto],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar produto' });
      if (results.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json(results[0]);
    }
  );
});

// Notificação de quantidade do estoque (todos produtos com QTD <= 10)
app.get('/produtos', (req, res) => {
  connection.query(
    'SELECT QTD_produto, nome_produto FROM insumos WHERE QTD_produto <= 10',
    (error, results) => {
      if (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
      }
      if (results.length === 0) {
        return res.json({ message: 'Estoque está ok, sem produtos com quantidade baixa' });
      }
      res.json(results);
    }
  );
});

// --- ROTAS CARDÁPIO ---

// Buscar todos os itens do cardápio
app.get('/cardapio', (req, res) => {
  const query = `
    SELECT 
      c.id_cardapio,
      c.nome_item,
      c.descricao_item,
      c.valor_item,
      c.imagem_url,
      c.filtro,
      GROUP_CONCAT(p.nome_produto SEPARATOR ', ') AS insumos
    FROM cardapio c
    LEFT JOIN cardapio_insumos ci ON c.id_cardapio = ci.id_item
    LEFT JOIN insumos p ON ci.id_insumo = p.id_produto
    GROUP BY c.id_cardapio;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar cardápio com insumos' });
    }
    res.json(results);
  });
});

// Deletar item do cardápio
app.delete('/cardapio/:id', (req, res) => {
  const { id } = req.params;

  // Primeiro, remove os insumos relacionados
  connection.query('DELETE FROM cardapio_insumos WHERE id_item = ?', [id], (erro1) => {
    if (erro1) {
      console.error('Erro ao remover insumos relacionados:', erro1);
      return res.status(500).json({ error: 'Erro ao remover insumos do cardápio' });
    }

    // Em seguida, remove o item do cardápio
    connection.query('DELETE FROM cardapio WHERE id_item = ?', [id], (erro2, resultados) => {
      if (erro2) {
        console.error('Erro ao deletar item do cardápio:', erro2);
        return res.status(500).json({ error: 'Erro ao deletar item do cardápio' });
      }

      if (resultados.affectedRows === 0) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      res.json({ message: 'Item excluído com sucesso' });
    });
  });
});

// Inserir item no cardápio com insumos relacionados
app.post('/cardapio/insert', (req, res) => {
  const { nome_produto, descricao_produto, valor_produto, filtro, insumos } = req.body;

  if (!nome_produto || !descricao_produto || !valor_produto || !filtro || !Array.isArray(insumos) || insumos.length === 0) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios e ao menos um insumo deve ser selecionado.' });
  }

  const insertProdutoQuery = `
    INSERT INTO cardapio (nome_item, descricao_item, valor_item, filtro)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(insertProdutoQuery, [nome_produto, descricao_produto, valor_produto, filtro], (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar o produto' });
    }

    const id_item = result.insertId;
    const values = insumos.map((id_insumo) => [id_item, id_insumo]);

    const insertInsumosQuery = `
      INSERT INTO cardapio_insumos (id_item, id_insumo)
      VALUES ?
    `;

    connection.query(insertInsumosQuery, [values], (errRelacao) => {
      if (errRelacao) {
        console.error('Erro ao associar insumos:', errRelacao);
        return res.status(500).json({ error: 'Produto criado, mas erro ao associar insumos.' });
      }

      return res.status(201).json({ message: 'Produto e insumos cadastrados com sucesso!' });
    });
  });
});

// --- ROTA CLIENTE ---

app.post('/cliente/insert', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const sql = `INSERT INTO cliente (email_cliente, senha_cliente) VALUES (?, ?)`;

  connection.query(sql, [email, senha], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
    res.status(201).json({ message: 'Cliente cadastrado com sucesso' });
  });
});

// --- INICIANDO SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;