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
        'SELECT * FROM Funcionarios WHERE id_funcionario = ?',
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
        'SELECT * FROM Funcionarios WHERE nome_funcionario = ?',
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
        'SELECT * FROM Funcionarios',
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
        'SELECT id_produto, nome_produto, QTD_produto, QTD_entrada_produto, data_vencimento_prod FROM Produto WHERE id_produto = ?',
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

// buscando todos os produtos
app.get('/produtos', (requisicao, resposta) => {
    connection.query(
        'SELECT id_produto, nome_produto, QTD_produto, QTD_entrada_produto, data_vencimento_prod FROM Produto',
        (error, resultados) => {
            if (error) {
                return resposta.status(500).json({ error: 'Erro ao buscar produtos' });
            }
            resposta.json(resultados);
        }
    );
});

// Porta de entrada para o banco
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});

export default app;