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
        return res.status(500).json({ erro: 'Erro ao buscar funcionário' })
      }

      if (resultados.length === 0) {
        // Se não tiver nada:
        return res.status(404).json({ erro: 'Funcionário não encontrado' })
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
    'SELECT id_insumos, nome_insumos, imagem_url, categoria, quantidade_insumos, unidade_medida, valor_insumos, data_vencimento FROM insumos',
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
app.post("/funcionarios/insert", (req, res) => {
  const { nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario, imagem_url } = req.body;

  if (!nome_funcionario || !cargo_funcionario || !senha_funcionario || !email_funcionario || !imagem_url) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const sql = `INSERT INTO funcionario (nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario, imagem_url) VALUES (?, ?, ?, ?, ?)`;

  connection.query(sql, [nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario, imagem_url], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }
    res.status(201).json({ message: 'Funcionário cadastrado com sucesso' });
  });
});



// Editando funcionário
app.put('/AtualizarFuncionario/:id', (req, res) => {
  const { id } = req.params;
  const { nome_funcionario, email_funcionario, cargo_funcionario, imagem_url } = req.body;

  if (!nome_funcionario || !email_funcionario || !cargo_funcionario || !imagem_url) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const sql = `
    UPDATE funcionario 
    SET nome_funcionario = ?, email_funcionario = ?, cargo_funcionario = ?, imagem_url = ? 
    WHERE id_funcionario = ?
  `;

  connection.query(sql, [nome_funcionario, email_funcionario, cargo_funcionario, imagem_url, id], (error, results) => {
    if (error) {
      console.error('Erro ao atualizar funcionário:', error);
      return res.status(500).json({ error: 'Erro no backend ao atualizar funcionário' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.status(200).json({ message: 'Funcionário atualizado com sucesso' });
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
app.put('/insumos_tudo_POST/:id_insumos', (req, res) => {
  const { id_insumos } = req.params;
  const {
    nome_insumos,
    quantidade_insumos,
    valor_insumos,
    imagem_url,
    categoria,
    data_vencimento,
    alerta_estoque,
    alerta_vencimento,
    id_fornecedor,
    unidade_medida
  } = req.body;


  // Atualiza os dados do insumo
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
    alerta_vencimento,
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

    // Atualiza ou insere o relacionamento com o fornecedor
    const deleteQuery = 'DELETE FROM FornecedorInsumo WHERE id_insumo = ?';
    connection.query(deleteQuery, [id_insumos], (err) => {
      if (err) {
        console.error('Erro ao remover relacionamento anterior com fornecedor:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o fornecedor relacionado' });
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
app.post('/insumos/insert', (req, res) => {
  console.log('Recebido no backend:', req.body);

  const {
    nome_insumos,
    imagem_url,
    valor_insumos,
    categoria,
    quantidade_insumos,
    data_vencimento,
    descricao_insumos,
    alertar_dias_antes,
    alerta_estoque,
    unidade_medida
  } = req.body;

  const data_entrada_insumos = new Date().toISOString().split('T')[0];

  const camposObrigatorios = {
    nome_insumos,
    imagem_url,
    valor_insumos,
    categoria,
    quantidade_insumos,
    data_vencimento,
    descricao_insumos,
    alertar_dias_antes,
    alerta_estoque,
    unidade_medida
  };

  const camposVazios = Object.entries(camposObrigatorios)
    .filter(([_, valor]) => valor === undefined || valor === null || valor === '')
    .map(([chave]) => chave);

  if (camposVazios.length > 0) {
    return res.status(400).json({ error: `Campos obrigatórios ausentes: ${camposVazios.join(', ')}` });
  }

  const sql = `
    INSERT INTO insumos (
      nome_insumos,
      descricao_insumos,
      quantidade_insumos,
      unidade_medida,
      valor_insumos,
      data_entrada_insumos,
      data_vencimento,
      imagem_url,
      categoria,
      alertar_dias_antes,
      alerta_estoque
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome_insumos,
    descricao_insumos,
    quantidade_insumos,
    unidade_medida,
    valor_insumos,
    data_entrada_insumos,
    data_vencimento,
    imagem_url,
    categoria,
    alertar_dias_antes,
    alerta_estoque
  ];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('[Erro ao inserir insumo]:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar insumo no banco de dados' });
    }

    res.status(201).json({ message: 'Insumo cadastrado com sucesso', id_inserido: results.insertId });
  });
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

  const query = `SELECT * FROM cliente WHERE email_cliente = ? AND senha_cliente = ?`;

  connection.query(query, [email, senha], (error, results) => {
    if (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Se quiser, pode retornar dados do usuário ou token
    return res.status(200).json({ message: 'Login bem-sucedido', usuario: results[0] });
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
      c.categoria,
      GROUP_CONCAT(
        CONCAT(
          '{"nome_insumo":"', IFNULL(i.nome_insumos, ''), '",',
          '"quantidade":"', IFNULL(ici.quantidade_necessaria, ''), '",',
          '"unidade_medida":"', IFNULL(ici.unidade_medida_receita, ''), '"}'
        )
      ) AS insumos
    FROM Cardapio c
    LEFT JOIN ItemCardapioInsumo ici ON ici.id_item_cardapio = c.id_cardapio
    LEFT JOIN Insumos i ON i.id_insumos = ici.id_insumo
    GROUP BY c.id_cardapio
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Erro ao buscar cardápio:', error);
      return res.status(500).json({ error: 'Erro ao buscar cardápio' });
    }

    // Corrige o parse do campo insumos para array de objetos
    const formattedResults = results.map(item => ({
      ...item,
      insumos: (() => {
        if (!item.insumos) return [];
        try {
          return JSON.parse(`[${item.insumos}]`);
        } catch {
          return [];
        }
      })()
    }));

    res.json(formattedResults);
  });
});



// Inserir item no cardápio com insumos relacionados
app.post('/cardapio/insert', (req, res) => {
  const {
    nome_produto,
    descricao_produto,
    valor_produto,
    imagem_url,
    filtro: categoria,
    insumos
  } = req.body;

  if (
    !nome_produto ||
    !descricao_produto ||
    !valor_produto ||
    !imagem_url ||
    !categoria ||
    !Array.isArray(insumos) ||
    insumos.length === 0
  ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios e ao menos um insumo deve ser selecionado.' });
  }

  const insertProdutoQuery = `
    INSERT INTO cardapio (nome_item, descricao_item, valor_item, imagem_url, categoria)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(insertProdutoQuery, [nome_produto, descricao_produto, valor_produto, imagem_url, categoria], (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar o produto' });
    }

    const id_item_cardapio = result.insertId;

    // Função segura para parsear números vindo do frontend
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
      INSERT INTO itemcardapioinsumo (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
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


// ROTA DO BOTÃO DE ALTERAR DA TELA DE CADASTRO DE VISUALIZAR CARDÁPIO (update)
app.put('/AtualizarCardapio/:id', (req, res) => {
  const { id } = req.params;
  const { imagem_url, nome_item, descricao_item, valor_item, insumos } = req.body;

  console.log('Atualizando cardápio ID:', id);
  console.log('Dados recebidos:', req.body);

  const updateCardapioQuery = `
    UPDATE cardapio 
    SET imagem_url = ?, nome_item = ?, descricao_item = ?, valor_item = ? 
    WHERE id_cardapio = ?
  `;

  connection.query(
    updateCardapioQuery,
    [imagem_url, nome_item, descricao_item, valor_item, id],
    (error, results) => {
      if (error) {
        console.error('Erro ao atualizar cardápio:', error);
        return res.status(500).json({ error: "Erro ao atualizar produto do cardápio." });
      }

      // Deleta insumos antigos do item do cardápio
      const deleteInsumosQuery = 'DELETE FROM ItemCardapioInsumo WHERE id_item_cardapio = ?';
      connection.query(deleteInsumosQuery, [id], (error) => {
        if (error) {
          console.error('Erro ao deletar insumos antigos:', error);
          return res.status(500).json({ error: "Erro ao remover insumos antigos." });
        }

        if (!Array.isArray(insumos) || insumos.length === 0) {
          console.warn('Nenhum insumo recebido ou lista vazia:', insumos);
          return res.status(200).json({ message: 'Produto atualizado sem insumos.' });
        }

        const values = insumos.map(insumo => {
          console.log('Insumo processado:', insumo);
          return [
            id, // id_item_cardapio
            insumo.id_insumo,
            insumo.quantidade_necessaria,
            insumo.unidade_medida_receita
          ];
        });

        console.log('Valores para INSERT:', values);

        const insertInsumoQuery = `
          INSERT INTO ItemCardapioInsumo 
          (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
          VALUES ?
        `;

        connection.query(insertInsumoQuery, [values], (error) => {
          if (error) {
            console.error('Erro ao inserir insumos:', error);
            return res.status(500).json({ error: "Erro ao adicionar novos insumos." });
          }

          console.log('Produto e insumos atualizados com sucesso!');
          res.status(200).json({ message: 'Produto e insumos atualizados com sucesso!' });
        });
      });
    }
  );
});



// --- ROTA CLIENTE ---
app.post('/cliente/insert', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  const sql = `INSERT INTO cliente (nome_cliente, email_cliente, senha_cliente) VALUES (?, ?, ?)`;

  connection.query(sql, [nome, email, senha], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
    res.status(201).json({ message: 'Cliente cadastrado com sucesso' });
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
      FROM itemcardapioinsumo ici
      JOIN insumos i ON ici.id_insumo = i.id_insumos
      WHERE ici.id_item_cardapio = ?
    `;

    connection.query(sql, [id_cardapio], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Conversão de unidades para checagem e dedução de estoque
function convertToStockUnit(qtdReceita, unidadeReceita, unidadeEstoque) {
  const from = unidadeReceita.toLowerCase();
  const to = unidadeEstoque.toLowerCase();

  if (from === to) return qtdReceita;

  const conversion = {
    g: { kg: (v) => v / 1000 },
    kg: { g: (v) => v * 1000 },
    ml: { l: (v) => v / 1000 },
    l: { ml: (v) => v * 1000 },
  };

  if (conversion[from] && conversion[from][to]) {
    return conversion[from][to](qtdReceita);
  }

  console.warn(`❗ Conversão não suportada: ${from} -> ${to}. Assumindo 1:1.`);
  return qtdReceita;
}

// Aqui começa a rota 
app.post('/saida-venda', async (req, res) => {
  const { id_cardapio } = req.body;

  try {
    const insumos = await getInsumosDoItem(id_cardapio);

    // 1. Verificação de estoque segura (em memória, antes de atualizar o banco)
    let erroEstoque = null;
    const insumosValidados = [];

    for (const insumo of insumos) {
      const quantidadeConvertida = convertToStockUnit(
        insumo.quantidade_necessaria,
        insumo.unidade_receita,
        insumo.unidade_estoque
      );
      const quantidadeParaDeduzir = parseFloat(quantidadeConvertida.toFixed(3));

      if (insumo.estoque_atual < quantidadeParaDeduzir) {
        erroEstoque = `Estoque insuficiente de ${insumo.nome_insumos}`;
        break;
      }

      // Simula a dedução para garantir que não ultrapasse
      insumo.estoque_atual -= quantidadeParaDeduzir;
      insumosValidados.push({ ...insumo, quantidadeParaDeduzir });
    }

    if (erroEstoque) {
      return res.status(400).json({ error: erroEstoque });
    }

    // 2. Deduz do banco e registra saída
    for (const insumo of insumosValidados) {
      console.log('🔧 Atualizando estoque do insumo:', insumo.id_insumos, 'Deduzindo:', insumo.quantidadeParaDeduzir);

      await new Promise((resolve, reject) => {
        connection.query(
          `UPDATE Insumos SET quantidade_insumos = quantidade_insumos - ? WHERE id_insumos = ?`,
          [insumo.quantidadeParaDeduzir, insumo.id_insumos],
          (err, result) => {
            if (err) return reject(err);
            console.log('✅ Resultado do UPDATE:', result);
            resolve();
          }
        );
      });

      // Registro da saída
      await new Promise((resolve, reject) => {
        const data_saida = new Date().toISOString().split('T')[0];
        const motivo_saida = 'Venda';

        connection.query(
          `INSERT INTO registrosaidaproduto (id_insumos_registroSaidaProduto, quantidade_saida, data_saida, motivo_saida)
           VALUES (?, ?, ?, ?)`,
          [insumo.id_insumos, insumo.quantidadeParaDeduzir, data_saida, motivo_saida],
          (err, result) => {
            if (err) return reject(err);
            console.log('📝 Registro de saída inserido:', result.insertId);
            resolve();
          }
        );
      });
    }

    return res.status(200).json({ message: 'Pedido realizado com sucesso e estoque atualizado.' });

  } catch (err) {
    console.error('❌ Erro ao processar pedido:', err);
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
      ORDER BY dia DESC, quantidade_total DESC
    `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar relatório de insumos:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório' });
      }

      // Organizar os dados por dia
      const relatorioPorDia = {};
      results.forEach(row => {
        if (!relatorioPorDia[row.dia]) {
          relatorioPorDia[row.dia] = [];
        }
        relatorioPorDia[row.dia].push({
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
    console.error('Erro no relatório de insumos:', err);
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
      f.telefone_fornecedor
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
          telefone: row.telefone_fornecedor
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


// --- INICIANDO SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;