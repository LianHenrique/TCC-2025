CREATE DATABASE  IF NOT EXISTS `story_box` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `story_box`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: story_box
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cardapio`
--

DROP TABLE IF EXISTS `cardapio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cardapio` (
  `id_cardapio` int(11) NOT NULL AUTO_INCREMENT,
  `nome_item` varchar(100) NOT NULL,
  `descricao_item` text DEFAULT NULL,
  `valor_item` decimal(10,2) NOT NULL,
  `imagem_url` varchar(250) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `categoria` varchar(20),
  PRIMARY KEY (`id_cardapio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cardapio`
--

LOCK TABLES `cardapio` WRITE;
/*!40000 ALTER TABLE `cardapio` DISABLE KEYS */;
/*!40000 ALTER TABLE `cardapio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nome_cliente` varchar(100) NOT NULL,
  `email_cliente` varchar(255) NOT NULL,
  `senha_cliente` varchar(255) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `email_cliente` (`email_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedor`
--

DROP TABLE IF EXISTS `fornecedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedor` (
  `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT,
  `nome_fornecedor` varchar(100) NOT NULL,
  `telefone_fornecedor` varchar(20) DEFAULT NULL,
  `email_fornecedor` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_fornecedor`),
  UNIQUE KEY `email_fornecedor` (`email_fornecedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedor`
--

LOCK TABLES `fornecedor` WRITE;
/*!40000 ALTER TABLE `fornecedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `fornecedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedorinsumo`
--

DROP TABLE IF EXISTS `fornecedorinsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedorinsumo` (
  `id_fornecedor` int(11) NOT NULL,
  `id_insumo` int(11) NOT NULL,
  PRIMARY KEY (`id_fornecedor`,`id_insumo`),
  KEY `id_insumo` (`id_insumo`),
  CONSTRAINT `fornecedorinsumo_ibfk_1` FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedor` (`id_fornecedor`) ON DELETE CASCADE,
  CONSTRAINT `fornecedorinsumo_ibfk_2` FOREIGN KEY (`id_insumo`) REFERENCES `insumos` (`id_insumos`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedorinsumo`
--

LOCK TABLES `fornecedorinsumo` WRITE;
/*!40000 ALTER TABLE `fornecedorinsumo` DISABLE KEYS */;
/*!40000 ALTER TABLE `fornecedorinsumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionario`
--

DROP TABLE IF EXISTS `funcionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario` (
  `id_funcionario` int(11) NOT NULL AUTO_INCREMENT,
  `nome_funcionario` varchar(100) NOT NULL,
  `cargo_funcionario` enum('ADM','Gerente','Funcionario') NOT NULL,
  `email_funcionario` varchar(255) NOT NULL,
  `senha_funcionario` varchar(255) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagem_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE KEY `email_funcionario` (`email_funcionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumos`
--

DROP TABLE IF EXISTS `insumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumos` (
  `id_insumos` int(11) NOT NULL AUTO_INCREMENT,
  `nome_insumos` varchar(100) NOT NULL,
  `descricao_insumos` text DEFAULT NULL,
  `quantidade_insumos` int(10) unsigned NOT NULL DEFAULT 0,
  `unidade_medida` varchar(20) DEFAULT NULL,
  `valor_insumos` decimal(10,2) NOT NULL DEFAULT 0.00,
  `data_entrada_insumos` date DEFAULT NULL,
  `data_vencimento` date DEFAULT NULL,
  `imagem_url` varchar(2083) DEFAULT NULL,
  `id_funcionario_cadastro` int(11) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_ultima_modificacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_insumos`),
  KEY `id_funcionario_cadastro` (`id_funcionario_cadastro`),
  CONSTRAINT `insumos_ibfk_1` FOREIGN KEY (`id_funcionario_cadastro`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumos`
--

LOCK TABLES `insumos` WRITE;
/*!40000 ALTER TABLE `insumos` DISABLE KEYS */;
/*!40000 ALTER TABLE `insumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemcardapioinsumo`
--

DROP TABLE IF EXISTS `itemcardapioinsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemcardapioinsumo` (
  `id_item_cardapio` int(11) NOT NULL,
  `id_insumo` int(11) NOT NULL,
  `quantidade_necessaria` decimal(10,3) NOT NULL,
  `unidade_medida_receita` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_item_cardapio`,`id_insumo`),
  KEY `id_insumo` (`id_insumo`),
  CONSTRAINT `itemcardapioinsumo_ibfk_1` FOREIGN KEY (`id_item_cardapio`) REFERENCES `cardapio` (`id_cardapio`) ON DELETE CASCADE,
  CONSTRAINT `itemcardapioinsumo_ibfk_2` FOREIGN KEY (`id_insumo`) REFERENCES `insumos` (`id_insumos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemcardapioinsumo`
--

LOCK TABLES `itemcardapioinsumo` WRITE;
/*!40000 ALTER TABLE `itemcardapioinsumo` DISABLE KEYS */;
/*!40000 ALTER TABLE `itemcardapioinsumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrosaidaproduto`
--

DROP TABLE IF EXISTS `registrosaidaproduto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrosaidaproduto` (
  `id_registro_saida` int(11) NOT NULL AUTO_INCREMENT,
  `id_insumos_RegistroSaidaProduto` int(11) NOT NULL,
  `quantidade_saida` int(11) NOT NULL,
  `data_saida` timestamp NOT NULL DEFAULT current_timestamp(),
  `motivo_saida` varchar(100) DEFAULT NULL,
  `id_funcionario_responsavel` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_registro_saida`),
  KEY `id_insumos_RegistroSaidaProduto` (`id_insumos_RegistroSaidaProduto`),
  KEY `id_funcionario_responsavel` (`id_funcionario_responsavel`),
  CONSTRAINT `registrosaidaproduto_ibfk_1` FOREIGN KEY (`id_insumos_RegistroSaidaProduto`) REFERENCES `insumos` (`id_insumos`),
  CONSTRAINT `registrosaidaproduto_ibfk_2` FOREIGN KEY (`id_funcionario_responsavel`) REFERENCES `funcionario` (`id_funcionario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrosaidaproduto`
--

LOCK TABLES `registrosaidaproduto` WRITE;
/*!40000 ALTER TABLE `registrosaidaproduto` DISABLE KEYS */;
/*!40000 ALTER TABLE `registrosaidaproduto` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-30 21:25:18
