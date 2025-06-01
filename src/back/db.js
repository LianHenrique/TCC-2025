// Criando o db.js, a conexão no caso

import mysql from 'mysql2'

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    // Não tem senha, é super seguro
    database: 'story_box2' //mudar p/storybox (tem q ser o exato nome do banco)
})

connection.connect((error) => {
    if(error){
        console.error("Erro ao tentar se conectar com o banco de dados", error);
    return;
    }
    else{
        console.log("Conectado ao banco de dados com sucesso!")
    }
})

// Exportando
export default connection;