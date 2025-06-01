import express from 'express';
import connection from './db.js';
import cors from 'cors'; //se não instalar isso aqui, ele dá erro quando roda pq o backend tá em  uma porta diferente da porta do front

const app = express();
app.use(cors());
app.use(express.json());

// buscando funcionário por ID
app.get('/funcionarios/:id_funcionario', (requisicao, resposta) => {
    const { id_funcionario } = requisicao.params;
    console.log("Buscando funcionário com ID", id_funcionario);

    connection.query(
        'SELECT * FROM funcionario WHERE id_funcionario = ?',
        [id_funcionario],
        (error, resultados) => {
            if (error) {
                return resposta.status(500).json({ error: 'Erro ao buscar funcionário' });
            }
            if (resultados.length === 0) {
                return resposta.status(404).json({ error: 'Funcionário não encontrado' });
            }
            resposta.json(resultados[0]);
        }
    );
});

app.get('/funcionarios/:nome_funcionario', (requisicao, resposta) => {
    const { nome_funcionario } = requisicao.params;
    console.log("Buscando funcionário com nome", nome_funcionario);

    connection.query(
        'SELECT * FROM funcionario WHERE nome_funcionario = ?',
        [nome_funcionario],
        (error, resultados) => {
            if (error) {
                return resposta.status(500).json({ error: 'Erro ao buscar funcionário' });
            }
            if (resultados.length === 0) {
                return resposta.status(404).json({ error: 'Funcionário não encontrado' });
            }
            resposta.json(resultados[0]);
        }
    );
});

// buscando todos os funcionários
app.get('/funcionarios', (requisicao, resposta) => {
    connection.query(
        'SELECT * FROM funcionario',
        (error, resultados) => {
            if (error) {
                return resposta.status(500).json({ error: "Erro ao buscar funcionários" })
            }
            resposta.json(resultados);
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
                console.log('Deu erro aqui ó', error)
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
    const {
        nome_funcionario,
        cargo_funcionario,
        senha_funcionario,
        email_funcionario
    } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!nome_funcionario || !cargo_funcionario || !senha_funcionario || !email_funcionario) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const sql = `INSERT INTO funcionarios (nome_funcionairo, cargo_funcionario, senha_funcionario, email_funcionario) VALUES (?, ?, ?, ?)`;

    connection.query(sql, [nome_funcionario, cargo_funcionario, senha_funcionario, email_funcionario], (erro, data) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
        }
        res.status(201).json({ message: 'Funcionário cadastrado com sucesso' });
    });
});

// Porta de entrada para o banco
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});

export default app;