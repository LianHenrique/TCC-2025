// Criando o db.js, a conexão no caso

import mysql from 'mysql2'

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    // Não tem senha, é super seguro
    database: 'tcc_estoque' //mudar p/storybox (tem q ser o exato nome do banco)
})

connection.connect((error) => {
    if(error){
        console.error("Erro ao tentar se conectar com o banco dedados", error);
    return;
    }
    else{
        console.log("Conectado ao banco de dados com sucesso!")
    }
})

// Exportando
export default connection;