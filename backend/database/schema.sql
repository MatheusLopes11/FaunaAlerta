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
	imagem_url VARCHAR(500) NULL
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















