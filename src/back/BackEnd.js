import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import connection from './db.js';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const app = express();

app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.webp') res.setHeader('Content-Type', 'image/webp');
    else if (ext === '.avif') res.setHeader('Content-Type', 'image/avif');
    else if (ext === '.jpg' || ext === '.jpeg') res.setHeader('Content-Type', 'image/jpeg');
    else if (ext === '.png') res.setHeader('Content-Type', 'image/png');
  }
}));


// 1. Configurações essenciais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuração de arquivos estáticos - ORDEM CORRETA E SEM DUPLICAÇÕES
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'public', 'uploads'), {
  setHeaders: (res, path) => {
    // Corrige MIME types para extensões comuns
    if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
    if (path.endsWith('.avif')) {
      res.setHeader('Content-Type', 'image/avif');
    }
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }

});

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

        const funcionariosComImagens = results.map(func => ({
          ...func,
          imagem_url: func.imagem_url
            ? func.imagem_url.replace(/^public/, '') // remove "public" se existir
            : null
        }));

        res.json(funcionariosComImagens);
      }
    );
  }
});

// buscando todos os funcionários por id
app.get('/funcionarios/:id_funcionario', (req, res) => {
  const { id_funcionario } = req.params;

  connection.query(
    'SELECT * FROM funcionario WHERE id_funcionario = ?',
    [id_funcionario],
    (error, resultados) => {
      if (error) {
        return res.status(500).json({ erro: 'Erro ao buscar funcionário' });
      }

      if (resultados.length === 0) {
        return res.status(404).json({ erro: 'Funcionário não encontrado' });
      }

      const funcionario = resultados[0];

      // Corrige o caminho da imagem removendo "public"
      if (funcionario.imagem_url) {
        funcionario.imagem_url = funcionario.imagem_url.replace(/^public/, '');
      }

      res.json(funcionario);
    }
  );
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
    `SELECT 
      id_insumos, 
      nome_insumos, 
      CONCAT('http://localhost:3000', imagem_url) AS imagem_url,
      categoria, 
      quantidade_insumos, 
      unidade_medida, 
      valor_insumos, 
      data_vencimento 
    FROM insumos`,
    (error, resultados) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
      }
      res.json(resultados);
    }
  );
});

// Notificação de quantidade do estoque
app.get('/produtos/notificacao', (req, res) => {
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
// app.get('/cardapio', (requisicao, resposta) => {
//   connection.query(
//     'SELECT * FROM cardapio',
//     (error, resultados) => {
//       if (error) {
//         return resposta.status(500).json({ error: 'Erro ao buscar produtos' });
//       }
//       resposta.json(resultados);
//     }
//   );
// });


// Inserir funcionário
app.post("/funcionarios/insert", upload.single('imagem'), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  const { nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario, palavra_chave } = req.body;

  if (!req.file || !nome_funcionario || !cargo_funcionario || !senha_funcionario || !email_funcionario || !palavra_chave) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios, incluindo a imagem.' });
  }

  const imagem_url = `/uploads/${req.file.filename}`; // caminho público para acessar depois

  const sql = `INSERT INTO funcionario (nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario, imagem_url, palavra_chave) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario, imagem_url, palavra_chave], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }
    res.status(201).json({ message: 'Funcionário cadastrado com sucesso' });
  });
});


// Editando funcionário
app.put('/AtualizarFuncionario/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const {
    nome_funcionario,
    email_funcionario,
    cargo_funcionario,
    imagem_atual,
    novaPalavraChave // Novo campo
  } = req.body;

  const imagem_url = req.file ? `/uploads/${req.file.filename}` : imagem_atual;

  if (!nome_funcionario || !email_funcionario || !cargo_funcionario || !imagem_url) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Prepara os campos para atualização
  const updateFields = {
    nome_funcionario,
    email_funcionario,
    cargo_funcionario,
    imagem_url
  };

  // Se uma nova palavra-chave foi fornecida, adiciona ao update
  if (novaPalavraChave && novaPalavraChave.trim() !== '') {
    updateFields.palavra_chave = novaPalavraChave;
  }

  // Monta a query dinamicamente
  const setClause = Object.keys(updateFields)
    .map(key => `${key} = ?`)
    .join(', ');

  const values = [...Object.values(updateFields), id];

  const sql = `
    UPDATE funcionario 
    SET ${setClause}
    WHERE id_funcionario = ?
  `;

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Erro ao atualizar funcionário:', error);

      // Trata erro de email duplicado
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Este email já está em uso por outro funcionário.' });
      }

      return res.status(500).json({ error: 'Erro no backend ao atualizar funcionário' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    const mensagem = novaPalavraChave
      ? 'Funcionário e palavra-chave atualizados com sucesso'
      : 'Funcionário atualizado com sucesso';

    res.status(200).json({ message: mensagem });
  });
});


// Deletar funcionário
app.delete("/deletarFuncionario/:id", (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM funcionario WHERE id_funcionario = ?', [id],
    (error, results) => {
      if (error) {
        console.error('Erro ao deletar funcionário');
        return res.status(500).json({ error: 'Erro interno ao deletar funcionário' })
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Funcionário não encontrado' })
      }

      console.log('Funcionário deletado com sucesso')
      return res.status(200).json({ message: 'Tudo certo' })
    }
  )
})



// --- ROTAS INSUMOS ---
// Buscar todos insumos
app.get('/insumos', (req, res) => {
  const sql = `
    SELECT id_insumos, nome_insumos, descricao_insumos, quantidade_insumos, 
           unidade_medida, valor_insumos, data_vencimento, imagem_url, 
           categoria, alertar_dias_antes, alerta_estoque 
    FROM insumos
  `;

  connection.query(sql, (error, results) => {
    if (error) return res.status(500).json({ error: 'Erro ao buscar insumos' });
    res.json(results);
  });
});



// Deletando os insumos por it
app.delete('/InsumosDelete/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM insumos WHERE id_insumos = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: console.log('Erro na requisição:', error) })
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Insumo não encontrado' })
    }
    return res.status(200).json({ message: 'Insumo deletado com sucesso' })
  })
})



// Buscando todos os insumos por id
app.get('/insumos_tudo/:id_insumos', (req, res) => {
  const { id_insumos } = req.params;

  const query = `
  SELECT 
    i.id_insumos,
    i.nome_insumos,
    i.quantidade_insumos,
    i.valor_insumos,
    i.imagem_url,
    i.categoria,
    i.data_vencimento,
    i.alerta_estoque,
    i.alertar_dias_antes,
    f.id_fornecedor,
    f.nome_fornecedor,
    f.telefone_fornecedor,
    f.email_fornecedor
  FROM insumos i
  LEFT JOIN FornecedorInsumo fi ON i.id_insumos = fi.id_insumo
  LEFT JOIN Fornecedor f ON fi.id_fornecedor = f.id_fornecedor
  WHERE i.id_insumos = ?
`;

  connection.query(query, [id_insumos], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar o insumo' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Insumo não encontrado' });
    }

    res.status(200).json(results[0]);
  });
});



// Adicionando coisas a insumos por id 
app.put('/insumos_tudo_POST/:id_insumos', upload.single('imagem'), (req, res) => {
  const { id_insumos } = req.params;
  const {
    nome_insumos,
    quantidade_insumos,
    valor_insumos,
    categoria,
    data_vencimento,
    alerta_estoque,
    alertar_dias_antes,
    id_fornecedor,
    unidade_medida,
    imagem_atual // ← se enviado no formData
  } = req.body;

  if (
    !nome_insumos ||
    !quantidade_insumos ||
    !valor_insumos ||
    !categoria
  ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const imagem_url = req.file ? `/uploads/${req.file.filename}` : imagem_atual;

  const updateInsumoQuery = `
    UPDATE insumos
    SET 
      nome_insumos = ?, 
      quantidade_insumos = ?, 
      valor_insumos = ?, 
      imagem_url = ?,
      categoria = ?, 
      data_vencimento = ?, 
      alerta_estoque = ?, 
      alertar_dias_antes = ?, 
      unidade_medida = ?
    WHERE id_insumos = ?
  `;

  const insumoValores = [
    nome_insumos,
    quantidade_insumos,
    valor_insumos,
    imagem_url,
    categoria,
    data_vencimento,
    alerta_estoque,
    alertar_dias_antes,
    unidade_medida,
    id_insumos
  ];

  connection.query(updateInsumoQuery, insumoValores, (err, resultado) => {
    if (err) {
      console.error('Erro ao atualizar insumo:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o insumo' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Insumo não encontrado' });
    }

    // Atualiza relação fornecedor-insumo
    const deleteQuery = 'DELETE FROM FornecedorInsumo WHERE id_insumo = ?';
    connection.query(deleteQuery, [id_insumos], (err) => {
      if (err) {
        console.error('Erro ao remover fornecedor anterior:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o fornecedor' });
      }

      if (!id_fornecedor) {
        return res.status(200).json({ mensagem: 'Insumo atualizado sem fornecedor' });
      }

      const insertRelacao = `
        INSERT INTO FornecedorInsumo (id_fornecedor, id_insumo)
        VALUES (?, ?)
      `;

      connection.query(insertRelacao, [id_fornecedor, id_insumos], (err) => {
        if (err) {
          console.error('Erro ao associar fornecedor:', err);
          return res.status(500).json({ error: 'Erro ao associar fornecedor ao insumo' });
        }

        res.status(200).json({ mensagem: 'Insumo e fornecedor atualizados com sucesso' });
      });
    });
  });
});



// Rota atualizada: alerta antecipado (<= alerta_estoque + 10) e crítico (<= alerta_estoque)
app.get('/insumos/alerta', (req, res) => {
  const sql = `
  SELECT 
  id_insumos,
  nome_insumos,
  imagem_url,
  quantidade_insumos,
  unidade_medida,  -- <-- adicionado aqui
  valor_insumos,
  categoria,
  data_vencimento,
  alerta_estoque,
  alertar_dias_antes,
  CASE
    WHEN quantidade_insumos <= alerta_estoque THEN 'critico'
    WHEN quantidade_insumos <= alerta_estoque + 10 THEN 'antecipado'
    ELSE NULL
  END AS tipo_alerta_estoque,
  CASE
    WHEN data_vencimento IS NOT NULL 
         AND DATEDIFF(data_vencimento, CURDATE()) <= alertar_dias_antes THEN 'vencendo'
    ELSE NULL
  END AS tipo_alerta_validade
FROM insumos
WHERE 
  quantidade_insumos <= alerta_estoque + 10
  OR (data_vencimento IS NOT NULL AND DATEDIFF(data_vencimento, CURDATE()) <= alertar_dias_antes)
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar alertas:', err);
      return res.status(500).json({ error: 'Erro ao buscar alertas' });
    }
    res.status(200).json(results);
  });
});



// Buscar insumo por id
app.get('/insumos/:id_insumos', (req, res) => {
  const { id_produto } = req.params;
  connection.query(
    `SELECT * from insumos WHERE id_insumos = ?`,
    [id_produto],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar insumo' });
      if (results.length === 0) return res.status(404).json({ error: 'Insumo não encontrado' });
      res.json(results[0]);
    }
  );
});



// Inserir insumo
app.post('/insumos/insert', upload.single('imagem'), async (req, res) => {
  console.log('Recebido no backend:', req.body);

  const {
    nome_insumos,
    valor_insumos,
    categoria,
    unidade_medida,
    quantidade_insumos,
    data_vencimento,
    descricao_insumos,
    alerta_estoque,
    alertar_dias_antes,
    fornecedor_id
  } = req.body;

  const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

  try { 
    const [insumoResult] = await connection.promise().query(
      `INSERT INTO insumos (
        nome_insumos, descricao_insumos, quantidade_insumos, unidade_medida,
        valor_insumos, data_vencimento, imagem_url, categoria,
        alertar_dias_antes, alerta_estoque
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome_insumos, descricao_insumos, quantidade_insumos, unidade_medida,
        valor_insumos, data_vencimento, imagem_url, categoria,
        alertar_dias_antes, alerta_estoque
      ]
    );

    const id_insumo = insumoResult.insertId;
 
    if (fornecedor_id && !isNaN(fornecedor_id)) {
      await connection.promise().query(
        `INSERT INTO FornecedorInsumo (id_fornecedor, id_insumo) VALUES (?, ?)`,
        [fornecedor_id, id_insumo]
      );
    }

    res.status(201).json({
      message: 'Insumo cadastrado com sucesso',
      id_inserido: id_insumo
    });

  } catch (error) {
    console.error('Erro ao cadastrar insumo:', error);
    res.status(500).json({ error: 'Erro ao cadastrar insumo no banco de dados' });
  }
});


// --- ROTAS PRODUTOS ---
// Buscar itens do cardapio por ID
app.get('/cardapio/:id_cardapio', (req, res) => {
  const { id_cardapio } = req.params;
  const sql = `
    SELECT 
      c.id_cardapio,
      c.nome_item,
      c.descricao_item,
      c.valor_item,
      c.imagem_url,
      c.ativo,
      c.data_cadastro,
      c.categoria,
      i.id_insumos AS id_insumo,
      i.nome_insumos,
      ici.quantidade_necessaria,
      ici.unidade_medida_receita
    FROM cardapio c
    LEFT JOIN itemcardapioinsumo ici ON ici.id_item_cardapio = c.id_cardapio
    LEFT JOIN insumos i ON i.id_insumos = ici.id_insumo
    WHERE c.id_cardapio = ?
  `;

  connection.query(sql, [id_cardapio], (error, results) => {
    if (error) {
      console.error('Erro ao buscar item do cardápio:', error);
      return res.status(500).json({ error: 'Erro ao buscar item do cardápio' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const base = results[0];
    const insumos = results.map(row => ({
      id_insumo: row.id_insumo,
      nome_insumos: row.nome_insumos,
      quantidade_necessaria: row.quantidade_necessaria,
      unidade_medida_receita: row.unidade_medida_receita
    })).filter(i => i.id_insumo !== null);

    const item = {
      id_cardapio: base.id_cardapio,
      nome_item: base.nome_item,
      descricao_item: base.descricao_item,
      valor_item: base.valor_item,
      imagem_url: base.imagem_url,
      ativo: base.ativo,
      data_cadastro: base.data_cadastro,
      categoria: base.categoria,
      insumos
    };

    res.json(item);
  });
});

// Rota para notificação de estoque baixo
app.get('/produtos/estoque-baixo', (req, res) => {
  connection.query(
    'SELECT QTD_produto, id_produto, nome_produto FROM insumos WHERE QTD_produto <= 10',
    (error, resultados) => {
      if (error) {
        console.error('Erro', error);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
      }

      if (resultados.length === 0) {
        res.status(204).send("Estoque ok.");
      } else {
        res.json(resultados);
      }
    }
  );
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  // Primeiro tenta logar como funcionário
  const funcionarioQuery = `
    SELECT 
      id_funcionario AS id, 
      nome_funcionario AS nome, 
      email_funcionario AS email, 
      cargo_funcionario AS cargo, 
      'funcionario' AS tipo 
    FROM funcionario 
    WHERE email_funcionario = ? AND senha_funcionario = ?
  `;

  connection.query(funcionarioQuery, [email, senha], (err, results) => {
    if (err) {
      console.error("Erro ao buscar funcionário:", err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length > 0) {
      return res.status(200).json({
        message: 'Login bem-sucedido (funcionário)',
        usuario: results[0]
      });
    }

    // Se não for funcionário, tenta cliente COM CARGO PERMITIDO
    const clienteQuery = `
      SELECT 
        id_cliente AS id, 
        nome_cliente AS nome, 
        email_cliente AS email, 
        cargo,
        'cliente' AS tipo
      FROM cliente 
      WHERE email_cliente = ? AND senha_cliente = ?
    `;

    connection.query(clienteQuery, [email, senha], (err2, results2) => {
      if (err2) {
        console.error("Erro ao buscar cliente:", err2);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (results2.length === 0) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const cliente = results2[0];
      const cargoPermitido = ["ADM", "Gerente"]; // Cargos que têm acesso

      // VERIFICAÇÃO DE CARGO ADICIONADA AQUI
      if (!cargoPermitido.includes(cliente.cargo)) {
        return res.status(403).json({
          error: 'Seu perfil não tem permissão para acessar o sistema.'
        });
      }

      return res.status(200).json({
        message: 'Login bem-sucedido (cliente com permissão)',
        usuario: cliente
      });
    });
  });
});

// --- ROTAS CARDÁPIO ---
// Buscar todos os itens do cardápio 
app.get('/cardapio', (req, res) => {
  const sql = `
    SELECT 
      c.id_cardapio,
      c.nome_item,
      c.descricao_item,
      c.valor_item,
      c.imagem_url,
      c.ativo,
      c.data_cadastro,
      c.categoria
    FROM Cardapio c
  `;

  connection.query(sql, (error, cardapioResults) => {
    if (error) {
      console.error('Erro ao buscar cardápio:', error);
      return res.status(500).json({
        error: 'Erro ao buscar cardápio',
        details: error.message
      });
    }

    // Se não houver itens, retornar array vazio
    if (cardapioResults.length === 0) {
      return res.json([]);
    }

    // Buscar insumos para todos os itens de uma vez
    const cardapioIds = cardapioResults.map(item => item.id_cardapio);
    const insumosQuery = `
      SELECT 
        ici.id_item_cardapio,
        i.id_insumos,
        i.nome_insumos,
        ici.quantidade_necessaria,
        ici.unidade_medida_receita,
        i.quantidade_insumos,
        i.unidade_medida
      FROM ItemCardapioInsumo ici
      JOIN Insumos i ON i.id_insumos = ici.id_insumo
      WHERE ici.id_item_cardapio IN (?)
    `;

    connection.query(insumosQuery, [cardapioIds], (insumosError, insumosResults) => {
      if (insumosError) {
        console.error('Erro ao buscar insumos:', insumosError);
        // Retornar cardápio mesmo sem insumos
        return res.json(cardapioResults.map(item => ({
          ...item,
          insumos: []
        })));
      }

      // Agrupar insumos por item do cardápio
      const insumosPorItem = {};
      insumosResults.forEach(insumo => {
        if (!insumosPorItem[insumo.id_item_cardapio]) {
          insumosPorItem[insumo.id_item_cardapio] = [];
        }
        insumosPorItem[insumo.id_item_cardapio].push({
          id_insumo: insumo.id_insumos,
          nome_insumo: insumo.nome_insumos,
          quantidade_necessaria: insumo.quantidade_necessaria,
          unidade_medida_receita: insumo.unidade_medida_receita,
          quantidade_insumos: insumo.quantidade_insumos,
          unidade_medida: insumo.unidade_medida
        });
      });

      // Combinar resultados
      const resultadosCompletos = cardapioResults.map(item => ({
        ...item,
        insumos: insumosPorItem[item.id_cardapio] || []
      }));

      res.json(resultadosCompletos);
    });
  });
});


// Inserir item no cardápio com insumos relacionados
app.post('/cardapio/insert', upload.single('imagem'), (req, res) => {

  const {
    nome_produto,
    descricao_produto,
    valor_produto,
    categoria
  } = req.body;


  const insumos = JSON.parse(req.body.insumos || '[]');

  if (
    !nome_produto ||
    !descricao_produto ||
    !valor_produto ||
    !req.file || // ← agora a imagem vem de req.file
    !categoria ||
    !Array.isArray(insumos) ||
    insumos.length === 0
  ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios e ao menos um insumo deve ser selecionado.' });
  }

  const imagem_url = `/uploads/${req.file.filename}`;

  const insertProdutoQuery = `
    INSERT INTO cardapio (nome_item, descricao_item, valor_item, imagem_url, categoria)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    insertProdutoQuery,
    [nome_produto, descricao_produto, valor_produto, imagem_url, categoria],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir produto:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar o produto' });
      }

      const id_item_cardapio = result.insertId;

      // Normaliza a quantidade recebida
      const normalizarQuantidade = (valor) => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
          const normalizado = valor.replace(/\./g, '').replace(',', '.');
          return parseFloat(normalizado);
        }
        return 0;
      };

      const values = insumos.map(insumo => {
        const idInsumo = insumo.id_insumo || insumo.id_insumos;
        const quantidade = normalizarQuantidade(insumo.quantidade_necessaria);
        return [
          id_item_cardapio,
          idInsumo,
          quantidade,
          insumo.unidade_medida_receita
        ];
      });

      const insertInsumosQuery = `
        INSERT INTO itemcardapioinsumo 
        (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
        VALUES ?
      `;

      connection.query(insertInsumosQuery, [values], (errRelacao) => {
        if (errRelacao) {
          console.error('Erro ao associar insumos:', errRelacao);
          return res.status(500).json({ error: 'Produto criado, mas erro ao associar insumos.' });
        }

        return res.status(201).json({ message: 'Produto e insumos cadastrados com sucesso!' });
      });
    }
  );
});


// ROTA DO BOTÃO DE ALTERAR DA TELA DE CADASTRO DE VISUALIZAR CARDÁPIO (update)
app.put('/AtualizarCardapio/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;

  const {
    nome_item,
    descricao_item,
    valor_item,
    categoria // opcional
  } = req.body;

  // Define URL da imagem (nova ou antiga)
  const imagem_url = req.file
    ? `/uploads/${req.file.filename}`
    : (req.body.imagem_url || '').trim();

  // Verifica campos obrigatórios
  if (!nome_item || !descricao_item || !valor_item) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  // Tenta interpretar insumos recebidos
  let insumos = [];
  try {
    insumos = JSON.parse(req.body.insumos || '[]');
  } catch (error) {
    console.error('Erro ao interpretar insumos:', error);
    return res.status(400).json({ error: 'Formato inválido de insumos.' });
  }

  const updateQuery = `
    UPDATE cardapio 
    SET imagem_url = ?, nome_item = ?, descricao_item = ?, valor_item = ?
    WHERE id_cardapio = ?
  `;

  connection.query(updateQuery, [imagem_url, nome_item, descricao_item, valor_item, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar cardápio:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o produto.' });
    }

    // Remove insumos antigos
    const deleteQuery = 'DELETE FROM ItemCardapioInsumo WHERE id_item_cardapio = ?';
    connection.query(deleteQuery, [id], (errDel) => {
      if (errDel) {
        console.error('Erro ao remover insumos antigos:', errDel);
        return res.status(500).json({ error: 'Erro ao remover os insumos antigos.' });
      }

      // Se não houver insumos, finaliza aqui
      if (!Array.isArray(insumos) || insumos.length === 0) {
        return res.status(200).json({ message: 'Produto atualizado (sem insumos).' });
      }

      // Função para garantir valor numérico
      const normalizarQuantidade = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val.trim().replace(',', '.')); // NÃO remove ponto
        return 0;
      };

      const values = insumos.map(insumo => [
        id,
        insumo.id_insumo,
        normalizarQuantidade(insumo.quantidade_necessaria),
        insumo.unidade_medida_receita
      ]);

      const insertQuery = `
        INSERT INTO ItemCardapioInsumo
        (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
        VALUES ?
      `;

      connection.query(insertQuery, [values], (errInsert) => {
        if (errInsert) {
          console.error('Erro ao inserir novos insumos:', errInsert);
          return res.status(500).json({ error: 'Erro ao associar novos insumos.' });
        }

        return res.status(200).json({ message: 'Produto e insumos atualizados com sucesso!' });
      });
    });
  });
});

// --- ROTA CLIENTE ---
app.post('/cliente/insert', (req, res) => {
  const { nome, email, senha, palavra_chave } = req.body;

  if (!nome || !email || !senha || !palavra_chave) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const checkSql = `SELECT * FROM cliente WHERE palavra_chave = ?`;
  connection.query(checkSql, [palavra_chave], (checkError, results) => {
    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ error: 'Erro ao verificar palavra-chave.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Palavra-chave já está em uso.' });
    }

    const insertSql = `INSERT INTO cliente (nome_cliente, email_cliente, senha_cliente, palavra_chave) VALUES (?, ?, ?, ?)`;
    connection.query(insertSql, [nome, email, senha, palavra_chave], (insertError) => {
      if (insertError) {
        console.error(insertError);
        return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
      }

      res.status(201).json({ message: 'Cliente cadastrado com sucesso.' });
    });
  });
});


// --- ROTA ESTOQUE ---
// Pegando todos os itend de estoque

app.get('/estoque', (req, res) => {
  connection.query(
    'SELECT * FROM insumos',
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao buscar estoque' });
      }
      res.json(results);
    }
  );
});

// Rota para saída de venda
// Função auxiliar para buscar os insumos do item do cardápio
function getInsumosDoItem(id_cardapio) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        i.id_insumos,
        i.nome_insumos,
        i.quantidade_insumos AS estoque_atual,            
        i.unidade_medida AS unidade_estoque,             
        ici.quantidade_necessaria,
        ici.unidade_medida_receita AS unidade_receita     
      FROM
        ItemCardapioInsumo AS ici
      JOIN Insumos AS i ON ici.id_insumo = i.id_insumos
      WHERE ici.id_item_cardapio = ?
    `;

    connection.query(sql, [id_cardapio], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function normalizeUnidade(unidade) {
  const u = unidade?.toLowerCase().trim();

  if (['un', 'unidade', 'unidades'].includes(u)) return 'unidade';
  if (['g', 'grama', 'gramas'].includes(u)) return 'g';
  if (['kg', 'quilo', 'kilograma', 'quilos'].includes(u)) return 'kg';
  if (['ml', 'mililitro', 'mililitros'].includes(u)) return 'ml';
  if (['l', 'litro', 'litros'].includes(u)) return 'l';

  return u;
}

function convertToStockUnit(quantidade, unidadeReceita, unidadeEstoque) {
  const receita = normalizeUnidade(unidadeReceita);
  const estoque = normalizeUnidade(unidadeEstoque);

  if (receita === estoque) return quantidade;

  // Regras de conversão
  if (receita === 'g' && estoque === 'kg') return quantidade / 1000;
  if (receita === 'kg' && estoque === 'g') return quantidade * 1000;
  if (receita === 'ml' && estoque === 'l') return quantidade / 1000;
  if (receita === 'l' && estoque === 'ml') return quantidade * 1000;

  return undefined; // unidades incompatíveis
}


app.post('/saida-venda', async (req, res) => {
  const { id_cardapio } = req.body;

  console.log("ID recebido na API:", id_cardapio);

  if (!id_cardapio) {
    return res.status(400).json({ error: "id_cardapio ausente" });
  }

  try {
    let insumos = await getInsumosDoItem(id_cardapio);

    // Filtro para ignorar insumos inválidos
    insumos = insumos.filter(insumo =>
      insumo.nome_insumos &&
      isFinite(insumo.quantidade_necessaria) &&
      isFinite(insumo.estoque_atual) &&
      insumo.unidade_receita &&
      insumo.unidade_estoque
    );

    let erroEstoque = null;
    const insumosValidados = [];

    for (const insumo of insumos) {
      const quantidadeConvertida = convertToStockUnit(
        insumo.quantidade_necessaria,
        insumo.unidade_receita,
        insumo.unidade_estoque
      );

      if (
        quantidadeConvertida === undefined ||
        quantidadeConvertida === null ||
        isNaN(quantidadeConvertida)
      ) {
        erroEstoque = `Não foi possível converter unidade do insumo: ${insumo.nome_insumos}`;
        break;
      }

      const numeroConvertido = Number(quantidadeConvertida);
      if (isNaN(numeroConvertido)) {
        erroEstoque = `Conversão inválida para o insumo: ${insumo.nome_insumos}`;
        break;
      }
      const quantidadeParaDeduzir = parseFloat(numeroConvertido.toFixed(3));

      if (insumo.estoque_atual < quantidadeParaDeduzir) {
        erroEstoque = `Estoque insuficiente de ${insumo.nome_insumos}`;
        break;
      }

      insumo.estoque_atual -= quantidadeParaDeduzir;
      insumosValidados.push({ ...insumo, quantidadeParaDeduzir });
    }

    if (erroEstoque) {
      return res.status(400).json({ error: erroEstoque });
    }

    // Dedução do estoque e registro da saída
    for (const insumo of insumosValidados) {
      await new Promise((resolve, reject) => {
        connection.query(
          `UPDATE Insumos 
SET quantidade_insumos = ROUND(quantidade_insumos - ?, 3) 
WHERE id_insumos = ?
`,
          [insumo.quantidadeParaDeduzir, insumo.id_insumos],
          (err, result) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      await new Promise((resolve, reject) => {
        const data_saida = new Date().toISOString().split('T')[0];
        connection.query(
          `INSERT INTO registrosaidaproduto (id_insumos_registroSaidaProduto, quantidade_saida, data_saida, motivo_saida)
           VALUES (?, ?, ?, ?)`,
          [insumo.id_insumos, insumo.quantidadeParaDeduzir, data_saida, 'Venda'],
          (err, result) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    return res.status(200).json({ message: 'Pedido realizado com sucesso e estoque atualizado.' });

  } catch (err) {
    console.error('Erro ao processar pedido:', err);
    return res.status(500).json({ error: 'Erro interno ao processar pedido.' });
  }
});



// Deletando item do estoque
app.delete('/insumos/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM insumos WHERE id_insumos = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao deletar insumo do estoque' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Insumo não encontrado' });
    }
    res.status(200).json({ message: 'Insumo deletado com sucesso' });
  });
});




// REQUISIÇÕES PARA RELATÓRIOS
// Rota para relatório de insumos com maiores saídas por dia
// Endpoint para relatório diário de insumos mais vendidos
app.get('/relatorios/insumos-diario', async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE(r.data_saida) AS dia,
        i.nome_insumos,
        i.categoria,
        SUM(r.quantidade_saida) AS quantidade_total,
        i.unidade_medida
      FROM registrosaidaproduto r
      JOIN insumos i ON r.id_insumos_registroSaidaProduto = i.id_insumos
      WHERE r.motivo_saida = 'Venda'
      GROUP BY DATE(r.data_saida), i.nome_insumos, i.categoria, i.unidade_medida
      ORDER BY dia DESC
      LIMIT 7  -- Retorna apenas os últimos 7 dias
    `;

    connection.query(query, (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao gerar relatório' });

      const relatorioPorDia = {};
      results.forEach(row => {
        const dia = row.dia.toISOString().split('T')[0];
        if (!relatorioPorDia[dia]) {
          relatorioPorDia[dia] = [];
        }
        relatorioPorDia[dia].push({
          nome: row.nome_insumos,
          categoria: row.categoria,
          quantidade: row.quantidade_total,
          unidade: row.unidade_medida
        });
      });

      res.json({
        dias: Object.keys(relatorioPorDia),
        dados: relatorioPorDia
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Endpoint para relatório semanal de insumos mais vendidos
app.get('/relatorios/insumos-semanal', async (req, res) => {
  try {
    const query = `
      SELECT 
        YEARWEEK(r.data_saida) AS semana,
        i.nome_insumos,
        i.categoria,
        SUM(r.quantidade_saida) AS quantidade_total,
        i.unidade_medida
      FROM registrosaidaproduto r
      JOIN insumos i ON r.id_insumos_registroSaidaProduto = i.id_insumos
      WHERE r.motivo_saida = 'Venda'
      GROUP BY YEARWEEK(r.data_saida), i.nome_insumos, i.categoria, i.unidade_medida
      ORDER BY semana DESC, quantidade_total DESC
    `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar relatório semanal de insumos:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório semanal' });
      }

      // Organizar os dados por semana
      const relatorioPorSemana = {};
      results.forEach(row => {
        if (!relatorioPorSemana[row.semana]) {
          relatorioPorSemana[row.semana] = [];
        }
        relatorioPorSemana[row.semana].push({
          nome: row.nome_insumos,
          categoria: row.categoria,
          quantidade: row.quantidade_total,
          unidade: row.unidade_medida
        });
      });

      res.json({
        semanas: Object.keys(relatorioPorSemana),
        dados: relatorioPorSemana
      });
    });
  } catch (err) {
    console.error('Erro no relatório semanal de insumos:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});



// Buscando itens do cardápio por filtro (categoria)
app.get('/filtroCardapio/', async (req, res) => {
  try {
    const categoria = req.query.categoria;
    connection.query('SELECT * FROM cardapio WHERE categoria = ?', [categoria],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao buscar dados' })
        }
        res.json(results)
      }
    )
  } catch (err) {
    console.log(err, 'Erro ao fazer requisição');
    res.status(500).json({ error: 'Erro interno no server' })
  }
})


//DELETANDO ITTEM DO CARDÁPIO
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM cardapio WHERE id_cardapio = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar item:', err);
      return res.status(500).json({ error: 'Erro ao deletar item' });
    }

    return res.status(200).json({ message: 'Produto deletado com sucesso' });
  });
});

// Cadastrando Fornecedor
app.post("/cadastro/fornecedor", (req, res) => {
  const { nome, telefone, email } = req.body;

  const sql = 'INSERT INTO fornecedor (nome_fornecedor, telefone_fornecedor, email_fornecedor) VALUES (?, ?, ?)';
  connection.query(sql, [nome, telefone, email], (erro, data) => {
    if (erro) {
      console.error("Erro ao cadastrar fornecedor:", erro);
      return res.status(500).json({ error: 'Erro ao cadastrar fornecedor' });
    }
    return res.status(200).json({ message: 'Fornecedor cadastrado com sucesso' });
  });
});

app.get("/fornecedores", (req, res) => {
  const sql = "SELECT id_fornecedor, nome_fornecedor FROM fornecedor";

  connection.query(sql, (erro, results) => {
    if (erro) {
      console.error("Erro ao buscar fornecedores:", erro);
      return res.status(500).json({ error: "Erro ao buscar fornecedores" });
    }
    res.status(200).json(results);
  });
});

// Rota para alinhar as datas de vencimento em ordem crescente
app.get('/alertas/vencimentos', (req, res) => {
  const sql = `
    SELECT 
      i.id_insumos,
      i.nome_insumos,
      i.data_vencimento,
      i.imagem_url,
      f.id_fornecedor,
      f.nome_fornecedor,
      f.telefone_fornecedor, -- VÍRGULA ADICIONADA AQUI
      f.email_fornecedor 
    FROM insumos i
    LEFT JOIN FornecedorInsumo fi ON i.id_insumos = fi.id_insumo
    LEFT JOIN Fornecedor f ON fi.id_fornecedor = f.id_fornecedor
    WHERE i.data_vencimento IS NOT NULL
    ORDER BY i.data_vencimento ASC
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Erro ao buscar datas de vencimento:', error);
      return res.status(500).json({ error: 'Erro ao buscar vencimentos.' });
    }

    // Agrupando fornecedores por insumo
    const insumosMap = {};

    results.forEach(row => {
      if (!insumosMap[row.id_insumos]) {
        insumosMap[row.id_insumos] = {
          id_insumos: row.id_insumos,
          nome_insumos: row.nome_insumos,
          data_vencimento: row.data_vencimento,
          imagem_url: row.imagem_url,
          fornecedores: []
        };
      }

      if (row.nome_fornecedor) {
        insumosMap[row.id_insumos].fornecedores.push({
          nome: row.nome_fornecedor,
          telefone: row.telefone_fornecedor,
          email: row.email_fornecedor // EMAIL ADICIONADO AQUI
        });
      }
    });

    res.json(Object.values(insumosMap));
  });
});


// Unidades de medida get
app.get('/unidades-medida', (req, res) => {
  const query = `
    SHOW COLUMNS FROM insumos LIKE 'unidade_medida'
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar ENUM de unidade_medida:', err);
      return res.status(500).json({ error: 'Erro ao buscar unidades de medida.' });
    }

    const enumStr = results[0].Type;
    const match = enumStr.match(/enum\((.*)\)/i);

    if (!match) {
      return res.status(500).json({ error: 'Formato de ENUM inválido.' });
    }

    const values = match[1]
      .split(',')
      .map(val => val.trim().replace(/(^'|'$)/g, ''));

    return res.json(values);
  });
});


// Recuperar senha
// Backend: Corrigindo a rota /recuperar-senha
app.post('/recuperar-senha', async (req, res) => {
  const { email, palavraChave } = req.body;

  if (!email || !palavraChave) {
    return res.status(400).json({
      error: 'Email e palavra-chave são obrigatórios',
      details: 'Por favor, preencha todos os campos'
    });
  }

  try {
    // 1. Busca como funcionário (CORRIGIDO)
    const funcionarioQuery = `
      SELECT 
        id_funcionario as id,
        nome_funcionario as nome,
        email_funcionario as email,
        senha_funcionario as senha
      FROM Funcionario 
      WHERE email_funcionario = ? 
      AND palavra_chave = ?  -- CORREÇÃO: nome da coluna estava errado
    `;

    connection.query(funcionarioQuery, [email, palavraChave], (error, funcionarioResults) => {
      if (error) {
        console.error('Erro ao buscar funcionário:', error);
        return res.status(500).json({ error: 'Erro no servidor ao buscar funcionário' });
      }

      if (funcionarioResults.length > 0) {
        const funcionario = funcionarioResults[0];
        return res.status(200).json({
          success: true,
          message: 'Senha recuperada com sucesso (funcionário)',
          senha: funcionario.senha,
          usuario: {
            id: funcionario.id,
            nome: funcionario.nome,
            email: funcionario.email,
            tipo: 'funcionario'
          }
        });
      }

      // 2. Busca como cliente (mantido igual)
      // ... [código existente] ...
    });
  } catch (err) {
    console.error('Erro geral na recuperação de senha:', err);
    return res.status(500).json({
      error: 'Erro interno no servidor',
      details: err.message
    });
  }
});

app.post('/checar-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email obrigatório' });
  }

  const sqlCliente = 'SELECT email_cliente AS email FROM cliente WHERE email_cliente = ?';
  const sqlFuncionario = 'SELECT email_funcionario AS email FROM funcionario WHERE email_funcionario = ?';

  connection.query(sqlCliente, [email], (err, resultCliente) => {
    if (err) {
      console.error('Erro ao buscar no cliente:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (resultCliente.length > 0) {
      return res.status(200).json({ email: resultCliente[0].email, tipo: 'cliente' });
    }

    connection.query(sqlFuncionario, [email], (errFunc, resultFuncionario) => {
      if (errFunc) {
        console.error('Erro ao buscar no funcionario:', errFunc);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (resultFuncionario.length > 0) {
        return res.status(200).json({ email: resultFuncionario[0].email, tipo: 'funcionario' });
      }

      return res.status(404).json({ error: 'Email não encontrado' });
    });
  });
});


app.put('/alterar-palavra-chave', (req, res) => {
  const { email, novaPalavraChave } = req.body;

  if (!email || !novaPalavraChave) {
    return res.status(400).json({ error: 'Email e nova palavra-chave obrigatórios' });
  }

  // Tenta primeiro na tabela CLIENTE
  const selectCliente = 'SELECT palavra_chave FROM cliente WHERE email_cliente = ?';

  connection.query(selectCliente, [email], (errCliente, resultsCliente) => {
    if (errCliente) {
      console.error('Erro ao buscar no cliente:', errCliente);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (resultsCliente.length > 0) {
      const atual = resultsCliente[0].palavra_chave;

      if (novaPalavraChave === atual) {
        return res.status(400).json({ error: 'A nova palavra-chave deve ser diferente da anterior.' });
      }

      const updateCliente = 'UPDATE cliente SET palavra_chave = ? WHERE email_cliente = ?';
      return connection.query(updateCliente, [novaPalavraChave, email], (errUpdate) => {
        if (errUpdate) {
          console.error('Erro ao atualizar cliente:', errUpdate);
          return res.status(500).json({ error: 'Erro no servidor' });
        }
        return res.status(200).json({ success: true, message: 'Palavra-chave atualizada com sucesso (cliente).' });
      });
    }

    // Se não achou no cliente, tenta na tabela FUNCIONARIO
    const selectFuncionario = 'SELECT palavra_chave FROM funcionario WHERE email_funcionario = ?';
    connection.query(selectFuncionario, [email], (errFunc, resultsFunc) => {
      if (errFunc) {
        console.error('Erro ao buscar no funcionario:', errFunc);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (resultsFunc.length === 0) {
        return res.status(404).json({ error: 'Email não encontrado em nenhuma conta' });
      }

      const atual = resultsFunc[0].palavra_chave;

      if (novaPalavraChave === atual) {
        return res.status(400).json({ error: 'A nova palavra-chave deve ser diferente da anterior.' });
      }

      const updateFuncionario = 'UPDATE funcionario SET palavra_chave = ? WHERE email_funcionario = ?';
      return connection.query(updateFuncionario, [novaPalavraChave, email], (errUpdateFunc) => {
        if (errUpdateFunc) {
          console.error('Erro ao atualizar funcionario:', errUpdateFunc);
          return res.status(500).json({ error: 'Erro no servidor' });
        }
        return res.status(200).json({ success: true, message: 'Palavra-chave atualizada com sucesso (funcionário).' });
      });
    });
  });
});

// --- INICIANDO SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
export default app;