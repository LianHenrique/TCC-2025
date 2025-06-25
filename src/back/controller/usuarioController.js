// Importa o arquivo de conexão com o banco de dados MySQL
const db = require("../db");

// Importa a biblioteca jsonwebtoken para gerar tokens JWT
const jwt = require("jsonwebtoken");

// Importa a biblioteca bcrypt para comparar senhas criptografadas
const bcrypt = require("bcrypt");

// Exporta uma função chamada "login" que será usada em uma rota
exports.login = async (req, res) => {
  // Extrai os campos 'email' e 'senha' do corpo da requisição
  const { email, senha } = req.body;

  try {
    // Busca o usuário no banco de dados pelo email informado
    const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const usuario = usuarios[0]; // Pega o primeiro (e único) usuário encontrado

    // Se não encontrar nenhum usuário com o e-mail fornecido
    if (!usuario) {
      return res.status(401).json({ msg: "Usuário não encontrado" });
    }

    // Compara a senha enviada com a senha criptografada no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    // Se a senha estiver errada
    if (!senhaCorreta) {
      return res.status(401).json({ msg: "Senha incorreta" });
    }

    // Gera um token JWT contendo o ID e o tipo do usuário
    // Esse token é assinado com uma chave secreta definida no arquivo .env
    const token = jwt.sign(
      {
        id: usuario.id,                  // ID do usuário
        tipo_usuario: usuario.tipo_usuario // Tipo de usuário (ex: admin, comum)
      },
      process.env.JWT_SECRET,           // Chave secreta para assinar o token
      { expiresIn: "2h" }               // Duração de validade do token
    );

    // Retorna o token no corpo da resposta (o frontend vai usar isso depois)
    res.json({ token });

  } catch (error) {
    // Em caso de erro no servidor (ex: erro de banco ou código)
    console.error(error);
    res.status(500).json({ msg: "Erro interno no login" });
  }
};