create table funcionario(
	id_funcionario int unique not null primary key auto_increment,
    nome_completo varchar(999) unique not null,
	telefone int unique,
    salario int not null,
    cargo enum("Funcionario", "Gerente") not null,
    email varchar(999) not null,
    senha varchar(999) not null 
);

create table itens(
	id_itens int unique not null primary key auto_increment,
    nome varchar(999) unique not null,
    validade date not null,
    quantidade int not null,
    valor_unidade int not null
);
 
 create table franquias(
	id_franquia int unique not null primary key auto_increment,
    nome varchar(999) not null,
    cep int,
    estado varchar(999) not null,
    cidade varchar(999) not null,
    bairro varchar(999) not null,
    rua varchar(999) not null,
    numero_estabelecimento int,
    telefone int not null,
    email varchar(999) not null,
    gerente varchar(999) not null
 );
 
 insert into funcionarios (cargo, email, senha)
 values(
	"Gerente",
	"ADM",
    "ADM"
 );
 
 rename table funcionario to funcionarios;
 
 alter table franquias modify column gerente varchar(999);
 
 describe funcionarios;
 
 select * from funcionarios;
 
 delete from funcionarios;
 
 