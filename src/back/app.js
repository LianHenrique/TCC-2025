// Usando express como facilitador.

import express from 'express';
import connection from './db';

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

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`)
})

export default app;