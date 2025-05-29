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

<<<<<<< HEAD
create database tcc_estoque;

DROP TABLE IF EXISTS `funcionarios`;
=======
DROP TABLE IF EXISTS `cardapio`;
>>>>>>> 0cf395bf5849db3fdc5b83729133a967230c8259
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cardapio` (
  `id_cardapio` int(11) NOT NULL AUTO_INCREMENT,
  `nome_c_produto` varchar(100) DEFAULT NULL,
  `descri_prod_insumos` varchar(150) DEFAULT NULL,
  `insumos_card` int(11) DEFAULT NULL,
  `valor_produto` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`id_cardapio`),
  KEY `insumos_card` (`insumos_card`),
  CONSTRAINT `cardapio_ibfk_1` FOREIGN KEY (`insumos_card`) REFERENCES `insumos` (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cardapio`
--

LOCK TABLES `cardapio` WRITE;
/*!40000 ALTER TABLE `cardapio` DISABLE KEYS */;
INSERT INTO `cardapio` VALUES (7,'X-Burguer Tradicional','Hambúrguer simples com queijo e maionese',11,NULL),(8,'X-Burguer Tradicional','Pão tradicional para hambúrguer',12,NULL),(9,'X-Burguer Tradicional','Queijo cheddar fatiado',13,NULL),(10,'X-Burguer Tradicional','Maionese tradicional',20,NULL),(11,'X-Bacon Cheddar','Hambúrguer com cheddar, bacon e maionese',11,NULL),(12,'X-Bacon Cheddar','Pão de hambúrguer',12,NULL),(13,'X-Bacon Cheddar','Queijo cheddar fatiado',13,NULL),(14,'X-Bacon Cheddar','Bacon fatiado defumado',14,NULL),(15,'X-Bacon Cheddar','Maionese cremosa',20,NULL),(16,'X-Burguer Barbecue','Hambúrguer com molho barbecue e bacon',11,NULL),(17,'X-Burguer Barbecue','Pão de hambúrguer',12,NULL),(18,'X-Burguer Barbecue','Molho barbecue especial',15,NULL),(19,'X-Burguer Barbecue','Bacon fatiado',14,NULL),(20,'X-Burguer Barbecue','Queijo cheddar',13,NULL),(21,'X-Salada','Hambúrguer com alface, tomate e cebola',11,NULL),(22,'X-Salada','Pão de hambúrguer leve',12,NULL),(23,'X-Salada','Alface crespa fresca',17,NULL),(24,'X-Salada','Tomate italiano em rodelas',18,NULL),(25,'X-Salada','Cebola roxa fatiada',19,NULL),(26,'X-Salada','Maionese tradicional',20,NULL),(27,'Batata com Cheddar e Bacon','Batata frita coberta com cheddar e bacon',16,NULL),(28,'Batata com Cheddar e Bacon','Queijo cheddar derretido',13,NULL),(29,'Batata com Cheddar e Bacon','Bacon crocante',14,NULL),(30,'Porção de Batata Palito','Batata frita crocante',16,NULL),(31,'Salad Burguer','Hambúrguer com foco em vegetais',11,NULL),(32,'Salad Burguer','Alface crespa',17,NULL),(33,'Salad Burguer','Tomate italiano',18,NULL),(34,'Salad Burguer','Cebola roxa',19,NULL),(35,'Salad Burguer','Molho barbecue leve',15,NULL),(36,'Salad Burguer','Pão de hambúrguer integral',12,NULL);
/*!40000 ALTER TABLE `cardapio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_clienet` int(11) NOT NULL AUTO_INCREMENT,
  `email_cliente` varchar(320) DEFAULT NULL,
  `senha_cliente` varchar(320) DEFAULT NULL,
  PRIMARY KEY (`id_clienet`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'ashKetchun@gmail.com','eusouopikachu ');
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
  `numero_fonecedor` int(11) DEFAULT NULL,
  `insumo_frnecedor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_fornecedor`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedor`
--

LOCK TABLES `fornecedor` WRITE;
/*!40000 ALTER TABLE `fornecedor` DISABLE KEYS */;
INSERT INTO `fornecedor` VALUES (1,2147483647,'magikarp ');
/*!40000 ALTER TABLE `fornecedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionario`
--

DROP TABLE IF EXISTS `funcionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario` (
  `id_funcionario` int(11) NOT NULL,
  `nome_funcionairo` varchar(50) DEFAULT NULL,
  `cargo_funcionario` set('ADM','Gerente','Funcionario') DEFAULT NULL,
  `senha_funcionario` varchar(200) DEFAULT NULL,
  `email_funcionario` varchar(320) DEFAULT NULL,
  `id_produto_funcioario` int(11) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE KEY `senha_funcionario` (`senha_funcionario`),
  KEY `id_produto_funcioario` (`id_produto_funcioario`),
  CONSTRAINT `funcionario_ibfk_1` FOREIGN KEY (`id_produto_funcioario`) REFERENCES `insumos` (`id_produto`)
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
  CONSTRAINT `grafico_ibfk_1` FOREIGN KEY (`id_produto_grafico`) REFERENCES `insumos` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grafico`
--

LOCK TABLES `grafico` WRITE;
/*!40000 ALTER TABLE `grafico` DISABLE KEYS */;
/*!40000 ALTER TABLE `grafico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumos`
--

DROP TABLE IF EXISTS `insumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumos` (
  `id_produto` int(11) NOT NULL,
  `nome_produto` varchar(30) DEFAULT NULL,
  `valor_produto` decimal(3,2) DEFAULT NULL,
  `QTD_produto` int(11) DEFAULT NULL,
  `QTD_entrada_produto` date DEFAULT NULL,
  `QTD_saida_produto` int(11) DEFAULT NULL,
  `data_vencimento_prod` date DEFAULT NULL,
  `descricao_produto` varchar(100) DEFAULT NULL,
  `imagem_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumos`
--

LOCK TABLES `insumos` WRITE;
/*!40000 ALTER TABLE `insumos` DISABLE KEYS */;
INSERT INTO `insumos` VALUES (1,'Coca-Cola Lata',4.50,120,'2025-05-20',30,'2025-12-31','Refrigerante em lata de 350ml','https://static.wixstatic.com/media/46fa11_71f04d31d6004f648d0dbb70468bf235~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/46fa11_71f04d31d6004f648d0dbb70468bf235~mv2.jpg'),(11,'Hambúrguer de Carne',9.90,40,'2025-05-20',10,'2025-06-15','Hambúrguer bovino congelado 120g','https://organic4.com.br/wp-content/uploads/2023/04/img-site-1-lanches-burger-carne.jpg'),(12,'Pão de Hambúrguer',1.50,200,'2025-05-21',30,'2025-06-01','Pão de hambúrguer tradicional 65g','https://www.receiteria.com.br/wp-content/uploads/pao-de-hamburguer-caseiro-1.jpg'),(13,'Queijo Cheddar Fatiado',9.99,60,'2025-05-19',20,'2025-07-10','Queijo cheddar fatiado para lanches','https://cdn.awsli.com.br/600x700/510/510640/produto/43196021/570ee096e3.jpg'),(14,'Bacon Fatiado',9.99,35,'2025-05-22',5,'2025-06-20','Bacon defumado fatiado 500g','https://feed.com.br/wp-content/uploads/2021/09/Bacon-Fatiado.jpg'),(15,'Molho Barbecue',7.90,25,'2025-05-18',3,'2025-12-31','Molho barbecue 300ml','https://www.sabornamesa.com.br/media/k2/items/cache/4cd4eaee1c7cc4757d33459591114de7_XL.jpg'),(16,'Batata Palito Congelada',9.99,80,'2025-05-21',15,'2025-11-01','Batata pré-frita congelada 2kg','https://www.bernardaoemcasa.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/w/h/whatsapp_image_2024-08-20_at_13.18.42.jpeg'),(17,'Alface Crespa',2.50,50,'2025-05-22',10,'2025-05-29','Alface fresca crespa','https://organicosinbox.com.br/wp-content/uploads/2020/11/alface-crespa-organica.jpg'),(18,'Tomate Italiano',3.20,60,'2025-05-20',12,'2025-06-02','Tomate italiano fresco','https://www.biosementes.com.br/loja/product_images/p/805/tomateitaliano_paramolhos__47507_zoom.jpg.webp'),(19,'Cebola Roxa',2.80,45,'2025-05-20',7,'2025-06-05','Cebola roxa fresca','https://img.band.uol.com.br/image/2024/01/24/picles-de-cebola-roxa-111859.png'),(20,'Maionese',6.00,30,'2025-05-21',6,'2025-10-01','Maionese tradicional 500g','https://m.media-amazon.com/images/I/61I483EtOrL._AC_UF894,1000_QL80_.jpg');
/*!40000 ALTER TABLE `insumos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 20:42:45
