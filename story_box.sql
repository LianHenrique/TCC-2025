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
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id_funcionario` int(11) NOT NULL,
  `nome_funcionairo` varchar(50) DEFAULT NULL,
  `cargo_funcionario` set('ADM','Gerente','Funcionario') DEFAULT NULL,
  `senha_funcionario` varchar(200) DEFAULT NULL,
  `email_funcionario` varchar(320) DEFAULT NULL,
  `id_produto_funcioario` int(11) NOT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE KEY `senha_funcionario` (`senha_funcionario`),
  KEY `id_produto_funcioario` (`id_produto_funcioario`),
  CONSTRAINT `funcionarios_ibfk_1` FOREIGN KEY (`id_produto_funcioario`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO Funcionarios (
  id_funcionario, nome_funcionairo, cargo_funcionario, senha_funcionario, email_funcionario
) VALUES
(1, 'Ana Souza', 'Gerente', 123456, 'ana.souza@empresa.com'),
(2, 'Carlos Lima', 'ADM', 234567, 'carlos.lima@empresa.com'),
(3, 'Juliana Rocha', 'Funcionario', 345678, 'juliana.rocha@empresa.com'),
(4, 'Marcos Silva', 'Funcionario', 456789, 'marcos.silva@empresa.com');


select * from funcionarios;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
INSERT INTO `funcionarios` VALUES (0,'Dito','ADM','eunaosouumditosouumbanco','banco@gmail.com',0);
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grafico`
--

DROP TABLE IF EXISTS `grafico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grafico` (
  `id_Grafico` int(11) NOT NULL,
  `data_Grafico` date DEFAULT NULL,
  `id_produto_grafico` int(11) NOT NULL,
  PRIMARY KEY (`id_Grafico`),
  KEY `id_produto_grafico` (`id_produto_grafico`),
  CONSTRAINT `grafico_ibfk_1` FOREIGN KEY (`id_produto_grafico`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grafico`
--

LOCK TABLES `grafico` WRITE;
/*!40000 ALTER TABLE `grafico` DISABLE KEYS */;
INSERT INTO `grafico` VALUES (0,'1996-01-27',0);
/*!40000 ALTER TABLE `grafico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `id_produto` int(11) NOT NULL,
  `nome_produto` varchar(30) DEFAULT NULL,
  `valor_produto` decimal(3,2) DEFAULT NULL,
  `QTD_produto` int(11) DEFAULT NULL,
  `QTD_entrada_produto` date DEFAULT NULL,
  `QTD_saida_produto` int(11) DEFAULT NULL,
  `data_vencimento_prod` date DEFAULT NULL,
  `descricao_produto` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (0,'Magikarp',9.99,10,'0000-00-00',2,'2023-03-24','Isso é uma iguaria inestimavel cheia de sabor com valor incomparavel');
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'story_box'
--

--
-- Dumping routines for database 'story_box'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 21:33:26