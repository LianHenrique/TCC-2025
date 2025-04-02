create table funcionario(
	id_funcionario int unique not null primary key auto_increment,
    nome_completo varchar(200) unique not null,
	telefone int unique,
    salario int not null,
    cargo enum("Funcionario", "Gerente") not null,
    email varchar(200) not null,
    senha varchar(200) not null 
);

 alter table funcionario modify column senha varchar(200);

create table itens(
	id_itens int unique not null primary key auto_increment,
    nome varchar(200) unique not null,
    validade date not null,
    quantidade int not null,
    valor_unidade int not null
);
 
 alter table itens modify column nome varchar(200);
 
 create table franquias(
	id_franquia int unique not null primary key auto_increment,
    nome varchar(200) not null,
    cep int,
    estado varchar(200) not null,
    cidade varchar(200) not null,
    bairro varchar(200) not null,
    rua varchar(200) not null,
    numero_estabelecimento int,
    telefone int not null,
    email varchar(200) not null,
    gerente varchar(200) not null
 );
 
 alter table franquias modify column gerente varchar(200);
 
 insert into funcionarios (cargo, email, senha)
 values(
	"Gerente",
	"ADM",
    "ADM"
 );
 
 rename table funcionario to funcionarios;
 
 describe funcionarios;
 
 select * from funcionarios;
 
 delete from funcionarios;
 
 