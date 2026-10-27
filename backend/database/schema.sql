CREATE DATABASE FaunaAlerta;

USE FaunaAlerta;

CREATE TABLE Usuario(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(250) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    telefone VARCHAR(20) NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('Usuario', 'Pesquisador', 'Orgao', 'Admin') DEFAULT 'Usuario',
    status_cadastro ENUM('Aprovado', 'Pendente', 'Negado') DEFAULT 'Pendente'
);

CREATE TABLE Pesquisador(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNSIGNED,
    instituicao VARCHAR(200) NOT NULL,
    area_pesquisa VARCHAR(150) NOT NULL,
    link_lattes_orcid VARCHAR(255) NULL,
    email_instituicional VARCHAR(150) NOT NULL UNIQUE,
    CONSTRAINT fk_pesquisador_usuario
		FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Documentos_verificacao(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNSIGNED,
    tipo ENUM('COMPROVANTE_VINCULO', 'LATTES', 'CARTAO_CNPJ', 'PORTARIA_NOMEACAO', 'OUTRO') NOT NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    CONSTRAINT fk_documentos_usuario
		FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Denuncias(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    protocolo VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INT UNSIGNED NULL,
    status_atual ENUM('Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada') NOT NULL DEFAULT 'Recebida',
    status_envio ENUM('PENDENTE', 'ENVIADA', 'FALHA') NOT NULL DEFAULT 'PENDENTE',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_denuncia_usuario
		FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE SET NULL
);

CREATE TABLE Denuncia_historico(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT UNSIGNED NOT NULL,
    status_denun ENUM('Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada') NOT NULL DEFAULT 'Recebida',
	observacao VARCHAR(255) NULL,
    origem ENUM('ORGAO', 'SISTEMA') NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historico_denuncia
		FOREIGN KEY (denuncia_id) REFERENCES Denuncias(id) ON DELETE CASCADE
);

CREATE TABLE Especies(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome_popular VARCHAR(120) NOT NULL UNIQUE,
    nome_cientifico VARCHAR(150) NOT NULL UNIQUE,
    origem ENUM('NATIVA', 'EXOTICA', 'EXOTICA_INVASORA') NOT NULL,
	status_conservacao ENUM('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'DD', 'NE') NOT NULL DEFAULT 'NE',
    descricao TEXT NULL,
	imagem_url VARCHAR(500) NULL,
    grupo ENUM('MAMIFERO','AVE','REPTIL','ANFIBIO','PEIXE','ARACNIDEO','INSETO','OUTRO') NOT NULL DEFAULT 'OUTRO',
    nivel_risco ENUM('NENHUM','BAIXO','MODERADO','ALTO') NOT NULL DEFAULT 'NENHUM',
    descricao_risco TEXT NULL,
    expectativa_vida_min SMALLINT UNSIGNED NULL,
    expectativa_vida_max SMALLINT UNSIGNED NULL,
    aparece_em_casas BOOLEAN NOT NULL DEFAULT FALSE,
    curiosidades TEXT NULL,
    fonte VARCHAR(255) NULL
);

CREATE TABLE Especie_biomas (
	especie_id INT UNSIGNED NOT NULL,
    bioma ENUM('AMAZONIA','CERRADO','MATA ATLANTICA','CAATINGA','PAMPA','PANTANAL') NOT NULL,
    PRIMARY KEY (especie_id, bioma),
    CONSTRAINT fk_especie_bioma FOREIGN KEY (especie_id) REFERENCES Especies(id) ON DELETE CASCADE
);

CREATE TABLE Alertas(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    especie_id INT UNSIGNED NULL, 
    usuario_id INT UNSIGNED NULL,
    municipio VARCHAR(100) NOT NULL,
    UF CHAR(2) NOT NULL,
    bioma ENUM('AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL') NULL,
    data_avistamento DATE NOT NULL,
    descricao TEXT NULL,
    situacao ENUM('PENDENTE', 'VERIFICADO', 'REJEITADO') NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT fk_alerta_especie 
		FOREIGN KEY (especie_id) REFERENCES Especies(id) ON DELETE SET NULL,
    CONSTRAINT fk_alerta_usuario
		FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE SET NULL
);

CREATE TABLE Alerta_midias (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    alerta_id INT UNSIGNED NOT NULL,
    tipo ENUM('FOTO', 'VIDEO') NOT NULL,
    url VARCHAR(500) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_alerta_midia FOREIGN KEY (alerta_id)
		REFERENCES Alertas(id) ON DELETE CASCADE
);
/*
CREATE TABLE Noticia(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    fonte VARCHAR(100) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/

CREATE TABLE ONG(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    contato VARCHAR(150) NULL,
    site VARCHAR(255) NULL,
    areas_atuacao VARCHAR(255) NULL,
    UF CHAR(2) NULL
);


INSERT INTO Especies
(nome_popular, nome_cientifico, origem, status_conservacao, descricao, grupo, nivel_risco, descricao_risco, expectativa_vida_min, expectativa_vida_max, aparece_em_casas, curiosidades, fonte)
VALUES
('Guará-lobo', 'Chrysocyon brachyurus', 'NATIVA', 'NT',
 'Maior canídeo da América do Sul, de pernas longas e pelagem alaranjada. Vive em áreas abertas.',
 'MAMIFERO', 'NENHUM', NULL, 12, 15, FALSE,
 'É onívoro e come muitos frutos, como a lobeira.', 'ICMBio / Lista Vermelha IUCN'),

('Onça-pintada', 'Panthera onca', 'NATIVA', 'NT',
 'Maior felino das Américas, de grande importância para o equilíbrio dos ecossistemas.',
 'MAMIFERO', 'ALTO', 'Não se aproxime. Em caso de avistamento, afaste-se com calma e avise o órgão ambiental.', 12, 15, FALSE,
 'Tem a mordida mais forte entre os felinos.', 'ICMBio / Lista Vermelha IUCN'),

('Gambá-de-orelha-branca (saruê)', 'Didelphis albiventris', 'NATIVA', 'LC',
 'Marsupial noturno comum em áreas urbanas, que ajuda a controlar insetos e pequenos animais.',
 'MAMIFERO', 'BAIXO', 'Não mate: é fauna silvestre protegida por lei. Mantenha distância e, se precisar, chame o órgão ambiental. Não manuseie.', 2, 4, TRUE,
 'Fêmeas carregam os filhotes em uma bolsa.', 'ICMBio'),

('Aranha-marrom', 'Loxosceles intermedia', 'NATIVA', 'NE',
 'Aranha pequena e discreta, que se esconde em cantos, roupas e sapatos.',
 'ARACNIDEO', 'ALTO', 'A picada pode causar lesão grave. Procure atendimento médico e, se possível, leve o aracnídeo.', 2, 4, TRUE,
 'Não costuma atacar, só pica quando é pressionada.', 'Instituto Butantan'),

('Arara-azul-grande', 'Anodorhynchus hyacinthinus', 'NATIVA', 'VU',
 'Maior papagaio do mundo, de plumagem azul intensa. Habita Pantanal, Cerrado e Amazônia.',
 'AVE', 'NENHUM', NULL, 40, 60, FALSE,
 'Tem bico forte, capaz de quebrar sementes duras.', 'ICMBio / Lista Vermelha IUCN'),

('Lobo-marinho-sul-americano', 'Arctocephalus australis', 'NATIVA', 'LC',
 'Mamífero marinho que pode aparecer no litoral Sul.',
 'MAMIFERO', 'BAIXO', 'Não toque nem se aproxime de animais encalhados. Avise o órgão ambiental.', 15, 25, FALSE,
 NULL, 'ICMBio');

UPDATE Especies SET imagem_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Maned_Wolf_11,_Beardsley_Zoo,_2009-11-06.jpg?width=600'
WHERE nome_popular = 'Guará-lobo';

UPDATE Especies SET imagem_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Jaguar_(Panthera_onca_palustris)_male_Three_Brothers_River_2.jpg?width=600'
WHERE nome_popular = 'Onça-pintada';

UPDATE Especies SET imagem_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyacinth_macaw_(Anodorhynchus_hyacinthinus)_head.JPG?width=600'
WHERE nome_popular = 'Arara-azul-grande';

UPDATE Especies SET imagem_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Didelphis_marsupialis,_Bahia,_Brazil.jpg?width=600'
WHERE nome_popular = 'Gambá-de-orelha-branca (saruê)';

UPDATE Especies SET imagem_url = 'https://en.wikipedia.org/wiki/Special:FilePath/SAFS_Falklands.jpg?width=600'
WHERE nome_popular = 'Lobo-marinho-sul-americano';

UPDATE Especies SET imagem_url = 'https://en.wikipedia.org/wiki/Special:FilePath/SAFS_Falklands.jpg?width=600'
WHERE nome_popular = 'Lobo-marinho-sul-americano';

UPDATE Especies SET imagem_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Loxosceles_Romulo2.jpg?width=600'
WHERE nome_popular = 'Aranha-marrom';

INSERT INTO Especie_biomas (especie_id, bioma)
SELECT e.id, b.bioma FROM Especies e JOIN (
  SELECT 'Guará-lobo' n, 'CERRADO' bioma UNION ALL
  SELECT 'Guará-lobo', 'PAMPA' UNION ALL
  SELECT 'Guará-lobo', 'MATA ATLANTICA' UNION ALL
  SELECT 'Onça-pintada', 'AMAZONIA' UNION ALL
  SELECT 'Onça-pintada', 'PANTANAL' UNION ALL
  SELECT 'Onça-pintada', 'CERRADO' UNION ALL
  SELECT 'Gambá-de-orelha-branca (saruê)', 'CERRADO' UNION ALL
  SELECT 'Gambá-de-orelha-branca (saruê)', 'MATA ATLANTICA' UNION ALL
  SELECT 'Aranha-marrom', 'MATA ATLANTICA' UNION ALL
  SELECT 'Aranha-marrom', 'PAMPA' UNION ALL
  SELECT 'Arara-azul-grande', 'PANTANAL' UNION ALL
  SELECT 'Arara-azul-grande', 'CERRADO' UNION ALL
  SELECT 'Arara-azul-grande', 'AMAZONIA' UNION ALL
  SELECT 'Lobo-marinho-sul-americano', 'PAMPA'
) b ON b.n = e.nome_popular;


-- Tabela de simulação pro banco de dados do órgão, simular através do mock
CREATE DATABASE Orgao_mock;
USE Orgao_mock;

CREATE TABLE Denuncias_recebidas( 
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    protocolo VARCHAR(20) NOT NULL UNIQUE,
    tipo ENUM('CACA', 'PESCA', 'MAUS_TRATOS', 'TRAFICO', 'OUTRO') NOT NULL,
    descricao TEXT NOT NULL,
    local_descricao VARCHAR(255) NULL,
    data_ocorrencia DATE NULL,
    status_denun ENUM('Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada') NOT NULL DEFAULT 'Recebida',
    recebida_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Denuncia_midias (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT UNSIGNED NOT NULL,
    tipo ENUM('FOTO', 'VIDEO') NOT NULL,
    url VARCHAR(500) NOT NULL,
    denunciante_nome VARCHAR(150) NULL,
    denunciante_email VARCHAR(150) NULL,
    denunciante_telefone VARCHAR(20) NULL,
    CONSTRAINT fk_denuncia_midia FOREIGN KEY (denuncia_id)
		REFERENCES Denuncias_recebidas(id) ON DELETE CASCADE
);















