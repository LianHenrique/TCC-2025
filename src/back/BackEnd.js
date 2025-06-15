
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
    nome_insumos,
    valor_insumos,
    categoria, 
    quantidade_insumos,
    data_vencimento,
    descricao_insumos
  } = req.body;

  const sql = `INSERT INTO insumos (nome_insumos, valor_insumos, categoria, quantidade_insumo, data_vencimento, descricao_insumos) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [nome_insumos, valor_insumos, categoria, quantidade_insumos, data_vencimento, descricao_insumos], (erro, data) => {
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
    `SELECT * FROM insumos`,
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Erro ao buscar insumos' });
      res.json(results);
    }
  );
});


// Buscando todos os insumos por id
app.get('/insumos_tudo/:id_insumos', (req, res) => {
  const { id_insumos } = req.params;

  connection.query('SELECT * FROM insumos WHERE id_insumos = ?', [id_insumos],
    (error, resultados) => {
      if (error) {
        return res.status(500).json({ erro: 'Erro ao buscar insumo' });
      }
      if (resultados.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(resultados[0]);
    }
  )
});



// Adicionando coisas a insumos por id
app.put('/insumos_tudo_POST/:id_insumos', (req, res) => {
  const { id_insumos } = req.params;
  const { quantidade_insumos } = req.body;
  const { nome_insumos } = req.body
  const { imagem_url } = req.body

  const query = 'UPDATE insumos SET quantidade_insumos = ?, nome_insumos = ?, imagem_url = ? WHERE id_insumos = ?';

  connection.query(query, [quantidade_insumos, nome_insumos, imagem_url, id_insumos], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao atualizar insumo' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Insumo não encontrado' });
    }

    res.json({ message: 'Insumo atualizado com sucesso' })
  })
})



  // Notificação de quantidade do estoque (todos produtos com QTD <= 10)
  app.get('/insumos/alerta', (req, res) => {
    connection.query('SELECT * FROM insumos WHERE quantidade_insumos <= 20', (error, results) => {
      if (error) {
        console.error('Erro ao buscar insumos', error.message);
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar insumos:' })
      }
      return res.json(results);
    })
  })



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
    FROM cardapio c
    LEFT JOIN itemcardapioinsumo ici ON ici.id_item_cardapio = c.id_cardapio
    LEFT JOIN insumos i ON i.id_insumos = ici.id_insumo
    WHERE c.id_cardapio = ?
    GROUP BY c.id_cardapio
  `;

    connection.query(sql, [id_cardapio], (error, results) => {
      if (error) {
        console.error('Erro ao buscar item do cardápio:', error);
        return res.status(500).json({ error: 'Erro ao buscar item do cardápio' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const item = results[0];
      try {
        item.insumos = item.insumos ? JSON.parse(`[${item.insumos}]`) : [];
      } catch (e) {
        item.insumos = [];
      }

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
FROM cardapio c
LEFT JOIN itemcardapioinsumo ici ON ici.id_item_cardapio = c.id_cardapio
LEFT JOIN insumos i ON i.id_insumos = ici.id_insumo
GROUP BY c.id_cardapio
  `;

    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Erro ao buscar cardápio:', error);
        return res.status(500).json({ error: 'Erro ao buscar cardápio' });
      }

      const formattedResults = results.map(item => ({
        ...item,
        insumos: (() => {
          try {
            return typeof item.insumos === 'string' ? JSON.parse(item.insumos) : item.insumos;
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
    const { nome_produto, descricao_produto, valor_produto, imagem_url, filtro: categoria, insumos } = req.body;

    if (!nome_produto || !descricao_produto || !valor_produto || !imagem_url || !categoria || !Array.isArray(insumos) || insumos.length === 0) {
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

      const values = insumos.map(insumo => {
        const idInsumo = insumo.id_insumo || insumo.id_insumos;
        return [id_item_cardapio, idInsumo, parseFloat(insumo.quantidade_necessaria), insumo.unidade_medida_receita];
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
    const { imagem_url, nome_item, descricao_item, valor_item } = req.body;
    const query = 'UPDATE cardapio SET imagem_url = ?, nome_item = ?, descricao_item = ?, valor_item = ? WHERE id_cardapio = ?'
    connection.query(
      query,
      [imagem_url, nome_item, descricao_item, valor_item, id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Erro ao atualizar produto do cardápio." });
        }
        res.status(200).json({ message: 'Livro atualizado com sucesso!' })
      }
    )
  })



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






  // --- ROTA ESTOQUE ---
  // Pegando todos os itend de estoque
  app.get('/estoque', (req, res) => {
    connection.query(
      'select * from insumos',
      (error, results) => {
        if (error) return res.status(500).json({ error: 'Erro ao buscar estoque' });
        res.json(results);
      }
    );
  });



  // Rota para saída de venda
  app.post('/saida-venda', (req, res) => {
    const { id_cardapio } = req.body;

    if (!id_cardapio) {
      return res.status(400).json({ error: 'ID do item do cardápio não fornecido' });
    }

    const data_saida = new Date().toISOString().slice(0, 10);

    const buscarInsumosQuery = `
    SELECT id_insumo, quantidade_necessaria
    FROM itemcardapioinsumo
    WHERE id_item_cardapio = ?
  `;

    connection.query(buscarInsumosQuery, [id_cardapio], (err, insumos) => {
      if (err) {
        console.error('Erro ao buscar insumos do item:', err);
        return res.status(500).json({ error: 'Erro ao buscar insumos' });
      }

      if (insumos.length === 0) {
        return res.status(404).json({ error: 'Nenhum insumo relacionado a este item' });
      }

      const registros = insumos.map(insumo => [
        insumo.id_insumo,
        insumo.quantidade_necessaria,
        data_saida,
        'Venda'
      ]);

      const insertSaidaQuery = `
      INSERT INTO registrosaidaproduto
      (id_insumos_registroSaidaProduto, quantidade_saida, data_saida, motivo_saida)
      VALUES ?
    `;

      connection.query(insertSaidaQuery, [registros], (errInsert) => {
        if (errInsert) {
          console.error('Erro ao registrar saída:', errInsert);
          return res.status(500).json({ error: 'Erro ao registrar saída' });
        }

        // atualiza o estoque, e só depois disso retorna a resposta
        const updates = insumos.map(insumo => {
          return new Promise((resolve, reject) => {
            const updateQuery = `
            UPDATE insumos SET quantidade_insumos = quantidade_insumos - ?
            WHERE id_insumos = ?
          `;
            connection.query(updateQuery, [insumo.quantidade_necessaria, insumo.id_insumo], (errUpdate) => {
              if (errUpdate) {
                console.error('Erro ao atualizar estoque:', errUpdate);
                reject(errUpdate);
              } else {
                resolve();
              }
            });
          });
        });

        Promise.all(updates)
          .then(() => {
            res.status(201).json({ message: 'Saída registrada e estoque atualizado com sucesso!' });
          })
          .catch(err => {
            console.error('Erro ao atualizar estoque:', err);
            res.status(500).json({ error: 'Erro ao atualizar o estoque' });
          });
      });
    });
  });


  // Deletando item do estoque
  app.delete('/estoqueDeletarIten/:id', async (req, res) => {
    const id = req.params.id
    console.log('Recebido para deletar id:', id)

    connection.query('DELETE FROM insumos WHERE id_insumos = ?', [id], (error, results) =>{
      if(error){
        return res.status(500).json({error: 'Erro ao deletar iten do estoque'})
      }
      res.status(200).json({message: 'Insumo deletado com sucesso'})
    })
  })



  // REQUISIÇÕES PARA RELATÓRIOS
  app.get('/relatorios/diario', async (req, res) => {
    try {
      // Definir o período (últimos 7 dias)
      const dataFim = new Date();
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - 7);

      // 1. Buscar vendas e faturamento por dia
      const vendasQuery = `
      SELECT 
        DATE(data_saida) as dia,
        COUNT(DISTINCT id_registro_saida) as qtd_vendas,
        SUM(c.valor_item) as faturamento
      FROM registrosaidaproduto r
      JOIN itemcardapioinsumo ici ON ici.id_insumo = r.id_insumos_RegistroSaidaProduto
      JOIN cardapio c ON c.id_cardapio = ici.id_item_cardapio
      WHERE motivo_saida = 'Venda'
        AND data_saida BETWEEN ? AND ?
      GROUP BY DATE(data_saida)
      ORDER BY dia ASC
    `;

      // 2. Buscar custos dos insumos por dia
      const custosQuery = `
      SELECT 
        DATE(data_saida) as dia,
        SUM(i.valor_insumos * r.quantidade_saida) as custo_total,
        COUNT(DISTINCT r.id_registro_saida) as qtd_vendas
      FROM registrosaidaproduto r
      JOIN itemcardapioinsumo ici ON ici.id_insumo = r.id_insumos_RegistroSaidaProduto
      JOIN insumos i ON i.id_insumos = ici.id_insumo
      WHERE motivo_saida = 'Venda'
        AND data_saida BETWEEN ? AND ?
      GROUP BY DATE(data_saida)
      ORDER BY dia ASC
    `;

      const [vendas, custos] = await Promise.all([
        new Promise((resolve) => connection.query(vendasQuery, [dataInicio, dataFim], (err, results) => resolve(results))),
        new Promise((resolve) => connection.query(custosQuery, [dataInicio, dataFim], (err, results) => resolve(results)))
      ]);

      // Combinar os resultados
      const diasUnicos = [...new Set([
        ...vendas.map(v => v.dia),
        ...custos.map(c => c.dia)
      ])].sort();

      const response = {
        dias: diasUnicos.map(dia => new Date(dia).toLocaleDateString('pt-BR')),
        dados: diasUnicos.map(dia => {
          const vendaDia = vendas.find(v => v.dia === dia) || {};
          const custoDia = custos.find(c => c.dia === dia) || {};

          const qtdClientes = vendaDia.qtd_vendas || 1; // Evitar divisão por zero
          const custoMedioCliente = custoDia.custo_total ? custoDia.custo_total / qtdClientes : 0;
          const lucroMedioCliente = vendaDia.faturamento ? (vendaDia.faturamento - (custoDia.custo_total || 0)) / qtdClientes : 0;

          return {
            dia,
            qtd_clientes: qtdClientes,
            custo_total: custoDia.custo_total || 0,
            faturamento: vendaDia.faturamento || 0,
            custo_medio_cliente: custoMedioCliente,
            lucro_medio_cliente: lucroMedioCliente,
            lucro_total: (vendaDia.faturamento || 0) - (custoDia.custo_total || 0)
          };
        })
      };

      res.json(response);
    } catch (error) {
      console.error('Erro no relatório diário:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório' });
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
      console.log('Erro ao fazer requisição');
      res.status(500).json({ error: 'Erro interno no server' })
    }
  })




  // --- INICIANDO SERVIDOR ---
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  export default app;
