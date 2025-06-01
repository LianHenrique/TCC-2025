import express from 'express';
import connection from './db.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// --- ROTAS FUNCIONÁRIOS ---
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



// buscando todos os funcionários por id
app.get('/funcionarios/:id_funcionario', (req, res) => {
  const { id_funcionario } = req.params; //coloco com req.params por que estou passando como parametro

  connection.query(
    'SELECT * FROM funcionario where id_funcionario = ?',
    // Agora passo o parametro falando o que é o ?
    [id_funcionario],

    // se der erro, retornar o erro
    (error, resultados) => {
      if (error) { 
        // Retorno o status no console
        return res.status(500).json({ erro: 'Erro ao buscar funcionário'})
      }
      
      if(resultados.length === 0){
        // Se não tiver nada:
        return res.status(404).json({erro :'Funcionário não encontrado'})
      }

      // Se chegou aqui, deu tudo certo
      res.json(resultados[0]);

      }
  )
})

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
      } else {
        res.status(204).send("Estoque ok.")
      }
    }
  )
});



// Buscando todos os itens do cardápio
// No select eu só peguei o que importa pra a parte fake 

app.get('/cardapio', (requisicao, resposta) => {
  connection.query(
    'SELECT * FROM cardapio',
    (error, resultados) => {
      if (error) {
        return resposta.status(500).json({ error: 'Erro ao buscar produtos' });
      }
      resposta.json(resultados);
    }
  );
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

  const sql = `INSERT INTO funcionario (nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario) VALUES (?, ?, ?, ?)`;

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




// Buscar itens do cardapio por ID
app.get('/cardapio/:id_cardapio', (req, res) => {
  const { id_cardapio } = req.params;

  connection.query(
    `SELECT id_cardapio, imagem_url, categoria, nome_item, valor_item, data_cadastro, descricao_item FROM cardapio WHERE id_cardapio = ?`,
    [id_cardapio],
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
  connection.query(
    'SELECT * FROM cardapio',
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar cardápio' });
      res.json(results);
    }
  );
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

// --- ROTA TESTE ESTOQUE ---
app.get('/estoque', (req, res) => {
  res.json({ message: 'Página de estoque encontrada!' });
});

// --- INICIANDO SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;