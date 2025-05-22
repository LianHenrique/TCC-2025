// Usando express como facilitador.

import express from 'express';
import connection from './db.js';

const app = express();
app.use(express.json());

app.get('/funcionarios', (requisicao, resposta) => {
    connection.query('SELECT nome_funcionario FROM Funcionarios', (error, resultados) => {
        if(error){
            return resposta.status(500).json({error: 'Erro ao buscar funcionários'})
        }
        resposta.json(resultados)
    })
})

app.get('/funcionarios/:id_funcionario', (requisicao, resposta) => {
    const { id } = requisicao.params;
    console.log(id);

    // criando a query agora, no caso usando o id para buscar o funcionário no bando de dados.
    connection.query(
        'SELECT * FROM Funcionarios WHERE id_funcionario = ?',
        [id],
        (error, resultados) => {
            if(error){
                return resposta.status(500).json({error : 'Erro ao buscar funcionário'})
            }
            if(resultados.length === 0){
                return resposta.status(404).json({error: 'Funcionário não encontrado'})
            }
            resposta.json(resultados[0])
        }
    )
})

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`)
})

export default app;