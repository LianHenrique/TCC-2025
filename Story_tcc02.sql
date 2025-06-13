-- Esquema SQL Aprimorado

-- Tabela de Funcionários
create database story_box2;

use story_box2;


CREATE TABLE Funcionario (
    id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    nome_funcionario VARCHAR(100) NOT NULL,
    cargo_funcionario ENUM('ADM', 'Gerente', 'Funcionario') NOT NULL,
    email_funcionario VARCHAR(255) UNIQUE NOT NULL,
    senha_funcionario VARCHAR(255) NOT NULL, -- Considerar armazenar hash da senha
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imagem_url varchar (250)
);

-- Tabela de Fornecedores
CREATE TABLE Fornecedor (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
    nome_fornecedor VARCHAR(100) NOT NULL,
    telefone_fornecedor VARCHAR(20),
    email_fornecedor VARCHAR(255) UNIQUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Insumos/Produtos
CREATE TABLE Insumos (
    id_insumos INT PRIMARY KEY AUTO_INCREMENT,
    nome_insumos VARCHAR(100) NOT NULL,
    descricao_insumos TEXT,
    quantidade_insumos INT UNSIGNED NOT NULL DEFAULT 0, -- Estoque atual
    unidade_medida VARCHAR(20), -- Ex: 'kg', 'litro', 'unidade'
    valor_insumos DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Preço de custo ou referência
    data_entrada_insumos DATE, -- Última data de entrada significativa
    data_vencimento DATE,
    imagem_url VARCHAR(2083), -- URL da imagem do produto
    id_funcionario_cadastro INT, -- Funcionário que cadastrou
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_funcionario_cadastro) REFERENCES Funcionario(id_funcionario) ON DELETE SET NULL -- Permite manter o insumo se o funcionário for deletado
);
insert into insumos( nome_insumos,descricao_insumos, quantidade_insumos,unidade_medida,valor_insumos,data_vencimento,imagem_url )
values("bacon","Carne de porco com  um percentual de gordura levemente elevado","200","unicadades-caixas","200,00","18-09-2030","https://dcdn-us.mitiendanube.com/stores/004/372/426/products/baconfat250-3ff91554af3f67a40417110440331718-640-0.png"),
	  ("pão","Pão caseiro com gergelim por cima ","200","unicadades-sacos","100,00","18-09-2030","https://paoemel.com.br/wp-content/uploads/2023/06/04-e1689026333614.jpg"),
      ("batata","Batatas cuidadosamente cortadas em um tamanho uniforme para melhor apreciação do sabor","50","kg","200,00","18-09-2030","https://canaldareceita.com.br/wp-content/uploads/2025/02/BATATA-FRITA-CASEIRA-NA-AIRFRYER.jpg"),
	  ("crane","Blande de carne com equilibrio de gordura e carne","150","kg","1000,00","18-09-2030","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgoDBZGqq72ILUmcFlceiRqJvDnzWX2YYNlQ&s"),
	  ("alface","Folhas de alface ja lavadas e destacadas","100","unicadades-sacolas","150,00","18-09-2030","https://phygital-files.mercafacil.com/catalogo/uploads/produto/natural_salads_alface_americana_250g_d92c1459-b7e9-4be3-b0f9-2b96768e0c90.png"),
	  ("queijo","algumas variedades de quijo como cheedar e prata","200","unicadades-caixas","200,00","18-09-2030","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREN6N3F_UrFV8_jtW5W5JpsblUP6AEvTeLPg&s");
        
-- Tabela de Ligação Fornecedor-Insumo (Muitos-para-Muitos)
CREATE TABLE FornecedorInsumo (
    id_fornecedor INT NOT NULL,
    id_insumo INT NOT NULL,
    PRIMARY KEY (id_fornecedor, id_insumo), -- Chave primária composta
    FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor(id_fornecedor) ON DELETE CASCADE, -- Se o fornecedor for deletado, a relação é removida
    FOREIGN KEY (id_insumo) REFERENCES Insumos(id_insumos) ON DELETE CASCADE -- Se o insumo for deletado, a relação é removida
);

-- Tabela de Itens do Cardápio (Produtos Finais)
CREATE TABLE Cardapio (
    id_cardapio INT PRIMARY KEY AUTO_INCREMENT,
    nome_item VARCHAR(100) NOT NULL,
    descricao_item TEXT,
    valor_item DECIMAL(10, 2) NOT NULL, -- Preço de venda
   imagem_url VARCHAR (250),
    ativo BOOLEAN DEFAULT TRUE, -- Se o item está ativo no cardápio
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
insert into Cardapio( nome_item,  descricao_item, valor_item,   imagem_url)
values("Hamburger simples ","Vai pão,carne,queijo,alface","20.00","https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"),
	  ("X-duploHamburger ","Vai pão,2-carne,2-queijo,alface","40.00","https://img.freepik.com/fotos-premium/hamburguer-duplo-delicioso-com-pepinos-de-bacon-de-carne-e-tomates-isolados_524291-2260.jpg"),
      ("X-bacoon ","Vai pão,carne,queijo,alface, bacon","35.00","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2iq1NJAbIYJHdnOj10joXxG1hGOQlo4_M5g&s");

-- Tabela de Ligação ItemCardapio-Insumo (Muitos-para-Muitos - Receita)
CREATE TABLE ItemCardapioInsumo (
    id_item_cardapio INT NOT NULL,
    id_insumo INT NOT NULL,
    quantidade_necessaria DECIMAL(10, 3) NOT NULL, -- Quantidade do insumo para fazer 1 unidade do item
    unidade_medida_receita VARCHAR(20), -- Unidade específica da receita (pode diferir da unidade de estoque)
    PRIMARY KEY (id_item_cardapio, id_insumo),
    FOREIGN KEY (id_item_cardapio) REFERENCES Cardapio(id_cardapio) ON DELETE CASCADE,
    FOREIGN KEY (id_insumo) REFERENCES Insumos(id_insumos) ON DELETE RESTRICT -- Impede deletar insumo se estiver em uso em uma receita
);

-- Tabela de Clientes
CREATE TABLE Cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(255) UNIQUE NOT NULL,
    senha_cliente VARCHAR(255) NOT NULL, -- Considerar armazenar hash da senha
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Registrar Saídas/Consumo de Produtos (Antiga 'Grafico')
-- Útil para controle de estoque e geração de relatórios/gráficos
CREATE TABLE RegistroSaidaProduto (
    id_registro_saida INT PRIMARY KEY AUTO_INCREMENT,
    id_insumos_RegistroSaidaProduto INT NOT NULL,
    quantidade_saida INT NOT NULL, -- Quantidade que saiu
    data_saida TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Momento da saída
    motivo_saida VARCHAR(100), -- Ex: 'Venda', 'Consumo Interno', 'Perda'
    id_funcionario_responsavel INT, -- Funcionário que registrou a saída (opcional)
    FOREIGN KEY ( id_insumos_RegistroSaidaProduto ) REFERENCES Insumos(id_insumos) ON DELETE RESTRICT, -- Impede deletar insumo se houver registros de saída
    FOREIGN KEY (id_funcionario_responsavel) REFERENCES Funcionario(id_funcionario) ON DELETE SET NULL
);


-- Adicionando Índices para Otimização (Exemplos)
CREATE INDEX idx_insumos_nome ON Insumos(nome_produto);
CREATE INDEX idx_cardapio_nome ON Cardapio(nome_item);
CREATE INDEX idx_cliente_email ON Cliente(email_cliente);

