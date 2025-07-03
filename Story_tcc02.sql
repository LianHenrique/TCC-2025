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
    imagem_url varchar (250),
    palavra_chave VARCHAR(40)
);
INSERT INTO funcionario (nome_funcionario, cargo_funcionario, email_funcionario, senha_funcionario, data_cadastro, imagem_url)
VALUES 
('Ana Souza',       'Gerente',     'ana.souza@empresa.com',     '123321', '2025-06-15', 'https://opiniaorh.files.wordpress.com/2021/04/pexels-'),
('Carlos Lima',     'ADM',         'carlos.lima@empresa.com',   '123456', '2025-06-15', 'https://www.ispblog.com.br/wp-content/uploads/2015/06/'),
('Juliana Rocha',   'Funcionario', 'juliana.rocha@empresa.com', '654321', '2025-06-15', 'https://blog.spvale.com.br/wp-content/uploads/2022/06/'),
('Marcos Silva',    'Funcionario', 'marcos.silva@empresa.com',  '12345',  '2025-06-15', 'https://arraesecenteno.com.br/wp-content/uploads/2024/');

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
    unidade_medida VARCHAR(20) NOT NULL, -- Ex: 'kg', 'litro', 'unidade'
    valor_insumos DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Preço de custo ou referência
    data_entrada_insumos DATE, -- Última data de entrada significativa
    data_vencimento DATE,
    imagem_url VARCHAR(2083), -- URL da imagem do produto
    categoria VARCHAR(35), -- mudar para um ENUM depois
    alertar_dias_antes INT NOT NULL DEFAULT 10,
    alerta_estoque INT NOT NULL DEFAULT 1,
    id_funcionario_cadastro INT, -- Funcionário que cadastrou
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_funcionario_cadastro) REFERENCES Funcionario(id_funcionario) ON DELETE SET NULL -- Permite manter o insumo se o funcionário for deletado
);

ALTER TABLE Insumos
MODIFY unidade_medida ENUM('unidade', 'kg', 'litro', 'g', 'ml') NOT NULL;

ALTER TABLE Insumos 
MODIFY COLUMN categoria ENUM('Carnes', 'Perecíveis', 'Molhos', 'Congelados') NOT NULL;

INSERT INTO insumos (nome_insumos, descricao_insumos, quantidade_insumos, unidade_medida, valor_insumos, data_vencimento, imagem_url, categoria) VALUES
('Hambúrguer de carne', 'Hambúrguer bovino congelado', 20, 'unidades', 9.90, '2025-04-17', 'https://organic4.com.br/wp-content/uploads/2023/04/img-site-1-lanches-burger-carne.jpg', 'Carnes'),
('Pão', 'Pão de hambúrguer tradicional', 5, 'unidades', 14.00, '2025-11-17', 'https://guiadacozinha.com.br/wp-content/uploads/2018/10/paofrancesfolhado.jpg', 'Perecíveis'),
('Queijo Cheddar Fatiado', 'Queijo cheddar fatiado para lanches', 40, 'unidades', 1.50, '2025-11-19', 'https://cdn.awsli.com.br/600x700/510/510640/produto/43196021/570ee096e3.jpg', 'Perecíveis'),
('Bacon Fatiado', 'Bacon defumado fatiado 500g', 17, 'kg', 16.50, '2025-12-19', 'https://feed.com.br/wp-content/uploads/2021/09/Bacon-Fatiado.jpg', 'Carnes'),
('Molho Barbecue', 'Molho barbecue 300ml', 10, 'unidades', 7.90, '2025-12-10', 'https://debetti.com.br/cdn/shop/files/barbecue-heinz.jpg?v=1684184440', 'Molhos'),
('Batata Palito Congelada', 'Batata pré-frita congelada 2kg', 10, 'kg', 18.90, '2026-02-11', 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/990415-06-09-2022-13-33-40-769.jpg', 'Congelados'),

('Alface Crespa', 'Alface fresca crespa', 75, 'unidades', 2.50, '2026-01-01', 'https://organicosinbox.com.br/wp-content/uploads/2020/11/alface-crespa-organica.jpg', 'Congelados'),
('Tomate Italiano', 'Tomate italiano fresco', 55, 'unidades', 3.20, '2025-12-19', 'https://www.biosementes.com.br/loja/product_images/p/805/tomateitaliano_paramolhos__47507_zoom.jpg.webp', 'Perecíveis');

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
    categoria VARCHAR (50),
    ativo BOOLEAN DEFAULT TRUE, -- Se o item está ativo no cardápio
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Cardapio (nome_item, descricao_item, valor_item, imagem_url)
VALUES 
('Hambúrguer Simples', 'Pao, carne, queijo, alface', 20.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg'),
('X-Duplo Hambúrguer', 'Pao, 2 carnes, 2 queijos, alface', 40.00, 'https://img.freepik.com/fotos-premium/hamburguer-duplo-delicioso-com-pepinos-de-bacon-de-carne-e-tomates-isolados_524291-2260.jpg'),
('X-Bacon', 'Pao, carne, queijo, alface, bacon', 35.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2iq1NJAbIYJHdnOj10joXxG1hGOQlo4_M5g&s');

-- Tabela de Ligação ItemCardapio-Insumo (Muitos-para-Muitos - Receita)
CREATE TABLE ItemCardapioInsumo (
    id_item_cardapio INT NOT NULL,
    id_insumo INT NOT NULL,
    quantidade_necessaria DECIMAL(10, 3) NOT NULL,
    unidade_medida_receita VARCHAR(20),
    PRIMARY KEY (id_item_cardapio, id_insumo),
    FOREIGN KEY (id_item_cardapio) REFERENCES Cardapio(id_cardapio) ON DELETE CASCADE,
    FOREIGN KEY (id_insumo) REFERENCES Insumos(id_insumos) ON DELETE CASCADE
);

-- Relação do Hambúrguer Simples: 1 hambúrguer de carne
INSERT INTO ItemCardapioInsumo (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
VALUES (1, 1, 1.0, 'unidade');

-- Relação do X-Duplo Hambúrguer: 2 hambúrgueres de carne
INSERT INTO ItemCardapioInsumo (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
VALUES (2, 1, 2.0, 'unidade');

-- Relação do X-Bacon: 1 hambúrguer de carne + 250g de bacon
INSERT INTO ItemCardapioInsumo (id_item_cardapio, id_insumo, quantidade_necessaria, unidade_medida_receita)
VALUES 
(3, 1, 1.0, 'unidade'),
(3, 4, 0.25, 'kg');

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
    quantidade_saida INT NOT NULL,
    data_saida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo_saida VARCHAR(100),
    id_funcionario_responsavel INT,
    FOREIGN KEY (id_insumos_RegistroSaidaProduto) REFERENCES Insumos(id_insumos) ON DELETE CASCADE,
    FOREIGN KEY (id_funcionario_responsavel) REFERENCES Funcionario(id_funcionario) ON DELETE SET NULL
);

-- Corrigindo os IDs para usar apenas os existentes (1 a 8)
INSERT INTO RegistroSaidaProduto (id_insumos_RegistroSaidaProduto, quantidade_saida, data_saida, motivo_saida, id_funcionario_responsavel)
VALUES
(1, 1, '2025-06-10', 'Venda', 1),
(2, 2, '2025-06-10', 'Venda', 2),
(3, 3, '2025-06-10', 'Venda', 3),
(4, 4, '2025-06-10', 'Venda', 4),
(5, 5, '2025-06-11', 'Venda', NULL),  -- Alterado para NULL
(6, 1, '2025-06-11', 'Venda', 1),
(7, 2, '2025-06-11', 'Venda', 2),
(8, 3, '2025-06-11', 'Venda', 3),
(1, 4, '2025-06-12', 'Venda', 4),
(2, 5, '2025-06-12', 'Venda', NULL),  -- Alterado para NULL
(3, 1, '2025-06-12', 'Venda', 1),
(4, 2, '2025-06-12', 'Venda', 2),
(5, 3, '2025-06-13', 'Venda', 3),
(6, 4, '2025-06-13', 'Venda', 4),
(7, 5, '2025-06-13', 'Venda', NULL),  -- Alterado para NULL
(8, 1, '2025-06-13', 'Venda', 1),
(1, 2, '2025-06-14', 'Venda', 2),
(2, 3, '2025-06-14', 'Venda', 3),
(3, 4, '2025-06-14', 'Venda', 4),
(4, 5, '2025-06-14', 'Venda', NULL);  -- Alterado para NULL

-- Atualização segura da unidade_medida
SET SQL_SAFE_UPDATES = 0;

UPDATE Insumos
SET unidade_medida = 'unidade'
WHERE LOWER(TRIM(unidade_medida)) = 'unidades';

SET SQL_SAFE_UPDATES = 1;


-- Atualização segura da unidade_medida
UPDATE Insumos SET unidade_medida = 'unidade' WHERE unidade_medida = 'unidades' AND id_insumos > 0;

ALTER TABLE Insumos
MODIFY unidade_medida ENUM('unidade', 'kg', 'litro', 'g', 'ml') NOT NULL;

ALTER TABLE ItemCardapioInsumo
MODIFY quantidade_necessaria DECIMAL(10, 1) NOT NULL;

ALTER TABLE insumos 
MODIFY quantidade_insumos DECIMAL(10,3);

ALTER TABLE Cliente ADD palavra_chave VARCHAR(255) AFTER senha_cliente;



-- Atualiza funcionários para usar imagens locais
UPDATE funcionario SET imagem_url = '/uploads/1751293043184-funcionaria-feliz-e-sorridente-com-os-colegas-em-uma-sombra-turva-atras_114579-2810.avif' WHERE id_funcionario = 1;
UPDATE funcionario SET imagem_url = '/uploads/1751293099756-a676c-felicidade-no-trabalho-1-e1661260494799.webp' WHERE id_funcionario = 2;
UPDATE funcionario SET imagem_url = '/uploads/1751293148253-mulher-de-tiro-medio-trabalhando-no-laptop_23-2149300643.avif' WHERE id_funcionario = 3;
UPDATE funcionario SET imagem_url = '/uploads/1751292560995-homem-no-armazem-trabalhando-no-laptop-easy-resize.com.jpg' WHERE id_funcionario = 4;
UPDATE funcionario SET imagem_url = '/uploads/1751290051024-80930134-download-sign-illustration-vector-white-icon-with-soft-shadow-on-transparent-background.jpg' WHERE id_funcionario = 5;

-- Atualiza insumos para usar imagens locais
UPDATE insumos SET imagem_url = '/uploads/1751291180292-img-site-1-lanches-burger-came.jpg' WHERE id_insumos = 1;
UPDATE insumos SET imagem_url = '/uploads/1751291124130-1-93e341ab8b244fc0a87bb7005166494a.jpeg' WHERE id_insumos = 2;
UPDATE insumos SET imagem_url = '/uploads/1751292467862-570ee096e3.webp' WHERE id_insumos = 3;
UPDATE insumos SET imagem_url = '/uploads/1751290950825-Bacon-Fatiad0.jpg' WHERE id_insumos = 4;
UPDATE insumos SET imagem_url = '/uploads/1751292255625-barbecue-heinz.webp' WHERE id_insumos = 5;
UPDATE insumos SET imagem_url = '/uploads/1751291755824-990415-06-09-2022-13-33-40-769.jpg' WHERE id_insumos = 6;
UPDATE insumos SET imagem_url = '/uploads/1751292195387-alface-crespa-organica.jpg' WHERE id_insumos = 7;
UPDATE insumos SET imagem_url = '/uploads/1751292395417-tomatetialiano_paramolhos_47507_zoom.jpg.webp' WHERE id_insumos = 8;

-- Desative o modo seguro temporariamente
SET SQL_SAFE_UPDATES = 0;

-- Atualize as URLs removendo qualquer prefixo incorreto
UPDATE insumos SET 
  imagem_url = CONCAT('/uploads/', SUBSTRING_INDEX(imagem_url, '/', -1))
WHERE imagem_url IS NOT NULL AND imagem_url != '';

UPDATE funcionario SET 
  imagem_url = CONCAT('/uploads/', SUBSTRING_INDEX(imagem_url, '/', -1))
WHERE imagem_url IS NOT NULL AND imagem_url != '';

UPDATE cardapio SET 
  imagem_url = CONCAT('/uploads/', SUBSTRING_INDEX(imagem_url, '/', -1))
WHERE imagem_url IS NOT NULL AND imagem_url != '';

-- Reative o modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Atualiza cardápio para usar imagens locais
UPDATE cardapio SET imagem_url = '/uploads/1751293247239-hamburguer-duplo.jpg' WHERE id_cardapio = 1;
UPDATE cardapio SET imagem_url = '/uploads/1751296679495-hamburguer-duplo.jpg' WHERE id_cardapio = 2;
UPDATE cardapio SET imagem_url = '/uploads/1751293323641-x-bacon.webp' WHERE id_cardapio = 3;

-- Corrigir imagem do Hamburguer de carne (ID 1)
UPDATE insumos SET 
  imagem_url = '/uploads/1751291180292-img-site-1-lanches-burger-carne.jpg'
WHERE id_insumos = 1;

UPDATE insumos SET 
  imagem_url = '1751303857649-Pao-de-Hamburguer-Monaco-G-CT-BIMBO-QSR.jpg'
WHERE id_insumos = 2;

-- Atualizar imagem do Tomate Italiano (ID 8)
UPDATE insumos SET 
  imagem_url = '1751303744469-Tomate-italiano-2.jpg'
WHERE id_insumos = 8;

UPDATE insumos SET 
  imagem_url = '1751290950825-Bacon-Fatiado.jpg'
WHERE id_insumos = 4;  -- ID do Bacon Fatiado


SET SQL_SAFE_UPDATES = 0;

-- Corrigir todos os caminhos de imagem
UPDATE cardapio SET
    imagem_url = CONCAT('/uploads/', SUBSTRING_INDEX(imagem_url, '/', -1))
WHERE imagem_url LIKE 'Juploads/%';

-- Corrigir nomes específicos de arquivos
UPDATE cardapio SET
    imagem_url = '/uploads/1751306512935-HAMBURGUER-VEGETARIANO-780x439.webp'
WHERE id_cardapio = 1;

UPDATE cardapio SET
    imagem_url = '/uploads/1751306045400-hamburguer-duplo.jpg'
WHERE id_cardapio = 2;

UPDATE cardapio SET
    imagem_url = '/uploads/1751293323641-x-bacon.webp'
WHERE id_cardapio = 3;

UPDATE Insumos SET unidade_medida = 'unidade' 
WHERE TRIM(LOWER(unidade_medida)) NOT IN ('kg', 'litro', 'g', 'ml')
  AND nome_insumos IN ('Hambúrguer de carne', 'Pão', 'Queijo Cheddar Fatiado', 'Molho Barbecue', 'Alface Crespa', 'Tomate Italiano');

UPDATE Insumos SET unidade_medida = 'kg'
WHERE nome_insumos IN ('Bacon Fatiado', 'Batata Palito Congelada');

UPDATE Insumos
SET data_vencimento = '2025-07-08'
WHERE nome_insumos = 'Hambúrguer de carne';

SET SQL_SAFE_UPDATES = 1;

ALTER TABLE cliente ADD COLUMN cargo ENUM('ADM') DEFAULT 'ADM';

UPDATE cardapio SET
  nome_item = 'Hambúrguer Simples',
  descricao_item = 'Po, carne, queijo, alface',
  valor_item = 20.00,
  imagem_url = 'uploads/1751331731712-hamburguer.jpeg',  
  data_cadastro = '2025-06-30 17:49:42'
WHERE id_cardapio = 1;

UPDATE cardapio SET
  nome_item = 'X-Duplo Hamburguer',
  descricao_item = 'Pão, 2 carnes, 2 queijos alface',
  valor_item = 40.00,
  imagem_url = 'uploads/1751330730301-x-duplo.jpeg',
  data_cadastro = '2025-06-30 17:49:42'
WHERE id_cardapio = 2;

UPDATE cardapio SET
  nome_item = 'X-Bacon',
  descricao_item = 'Pão, carne, queijo, alface, bacon',
  valor_item = 35.00,
  imagem_url = 'uploads/1751330858718-5098e75e57e36807c173cb7490b1b0d2_XL.jpg',
  data_cadastro = '2025-06-30 17:49:42'
WHERE id_cardapio = 3;

ALTER TABLE Cardapio
MODIFY COLUMN categoria ENUM('Lanches', 'Porções', 'Combos') NOT NULL DEFAULT 'Lanches';

UPDATE Cardapio
SET categoria = 'Lanches'
WHERE id_cardapio IN (1, 2, 3);

INSERT INTO cliente (id_cliente, nome_cliente, email_cliente, senha_cliente, palavra_chave, data_cadastro, cargo)
VALUES (1, 'ADM', 'ADM@gmail.com', 123321, 'ADIMIN', '2025-07-01', 'ADM');


-- Adicionando Índices para Otimização (Exemplos)
CREATE INDEX idx_insumos_nome ON Insumos(nome_insumos);
CREATE INDEX idx_cardapio_nome ON Cardapio(nome_item);
CREATE INDEX idx_cliente_email ON Cliente(email_cliente);
