USE FaunaAlerta;
SET @h = '$2b$10$fz4pLB4JoF5rpQRtRNFx3etsbizkLmlCc9lq7UUVvnU8UWzO82OWW';

-- 1. adiciona a coluna aceitando NULL, para não quebrar se já houver linhas
ALTER TABLE Pesquisador
    ADD COLUMN email_instituicional VARCHAR(150) NULL;

-- 2. preenche as linhas antigas com o e-mail do usuário vinculado
UPDATE Pesquisador p
JOIN Usuario u ON u.id = p.usuario_id
SET p.email_instituicional = u.email
WHERE p.id > 0
  AND p.email_instituicional IS NULL;

-- 3. deixa igual ao schema.sql (NOT NULL + UNIQUE)
ALTER TABLE Pesquisador
    MODIFY email_instituicional VARCHAR(150) NOT NULL,
    ADD UNIQUE (email_instituicional);

-- USUÁRIOS (senha de todos: Fauna@2026)
INSERT INTO Usuario (nome, email, telefone, senha_hash, perfil, status_cadastro) VALUES
('Administrador FaunaAlerta','admin@faunalerta.com','11900000001',@h,'Admin','Aprovado'),
('Maria Souza','maria@email.com','11900000002',@h,'Usuario','Aprovado'),
('João Pereira','joao@email.com','11900000003',@h,'Usuario','Aprovado'),
('Dra. Helena Costa','helena@usp.br','11900000004',@h,'Pesquisador','Aprovado'),
('Dr. Rafael Lima','rafael@unicamp.br','11900000005',@h,'Pesquisador','Pendente'),
('Carlos Mendes','carlos@faculdade.edu','11900000006',@h,'Pesquisador','Negado');

INSERT INTO Pesquisador (usuario_id, instituicao, area_pesquisa, link_lattes_orcid, email_institucional) VALUES
((SELECT id FROM Usuario WHERE email='helena@usp.br'),'Universidade de São Paulo','Ecologia de mamíferos','https://lattes.cnpq.br/0000000000000001','helena@usp.br'),
((SELECT id FROM Usuario WHERE email='rafael@unicamp.br'),'UNICAMP','Ornitologia','https://orcid.org/0000-0000-0000-0002','rafael@unicamp.br'),
((SELECT id FROM Usuario WHERE email='carlos@faculdade.edu'),'Faculdade Exemplo','Zoologia',NULL,'carlos@faculdade.edu');

-- ESPÉCIES (revisem textos e fontes antes de apresentar)
INSERT INTO Especies (nome_popular,nome_cientifico,origem,status_conservacao,descricao,imagem_url,grupo,nivel_risco,descricao_risco,expectativa_vida_min,expectativa_vida_max,aparece_em_casas,curiosidades,fonte) VALUES
('Guará-lobo','Chrysocyon brachyurus','NATIVA','NT','Maior canídeo da América do Sul, de pernas longas e pelagem alaranjada.','https://commons.wikimedia.org/wiki/Special:FilePath/Maned_Wolf_11,_Beardsley_Zoo,_2009-11-06.jpg?width=600','MAMIFERO','NENHUM',NULL,12,15,FALSE,'Come muitos frutos, como a lobeira.','ICMBio / IUCN'),
('Onça-pintada','Panthera onca','NATIVA','NT','Maior felino das Américas.','https://commons.wikimedia.org/wiki/Special:FilePath/Jaguar_(Panthera_onca_palustris)_male_Three_Brothers_River_2.jpg?width=600','MAMIFERO','ALTO','Não se aproxime. Afaste-se com calma e avise o órgão ambiental.',12,15,FALSE,'Tem a mordida mais forte entre os felinos.','ICMBio / IUCN'),
('Gambá-de-orelha-branca (saruê)','Didelphis albiventris','NATIVA','LC','Marsupial noturno comum em áreas urbanas.','https://commons.wikimedia.org/wiki/Special:FilePath/Didelphis_marsupialis,_Bahia,_Brazil.jpg?width=600','MAMIFERO','BAIXO','Não mate: é fauna silvestre protegida por lei. Mantenha distância e chame o órgão ambiental.',2,4,TRUE,'Fêmeas carregam os filhotes em uma bolsa.','ICMBio'),
('Aranha-marrom','Loxosceles intermedia','NATIVA','NE','Aranha pequena que se esconde em cantos, roupas e sapatos.','https://commons.wikimedia.org/wiki/Special:FilePath/Loxosceles_Romulo2.jpg?width=600','ARACNIDEO','ALTO','A picada pode causar lesão grave. Procure atendimento médico.',2,4,TRUE,'Só pica quando é pressionada.','Instituto Butantan'),
('Arara-azul-grande','Anodorhynchus hyacinthinus','NATIVA','VU','Maior papagaio do mundo.','https://commons.wikimedia.org/wiki/Special:FilePath/Hyacinth_macaw_(Anodorhynchus_hyacinthinus)_head.JPG?width=600','AVE','NENHUM',NULL,40,60,FALSE,'Quebra sementes muito duras com o bico.','ICMBio / IUCN'),
('Lobo-marinho-sul-americano','Arctocephalus australis','NATIVA','LC','Mamífero marinho que aparece no litoral Sul.','https://en.wikipedia.org/wiki/Special:FilePath/SAFS_Falklands.jpg?width=600','MAMIFERO','BAIXO','Não toque em animais encalhados. Avise o órgão ambiental.',15,25,FALSE,NULL,'ICMBio'),
('Mico-leão-dourado','Leontopithecus rosalia','NATIVA','EN','Pequeno primata de pelagem dourada, símbolo da Mata Atlântica.',NULL,'MAMIFERO','NENHUM',NULL,15,20,FALSE,'Símbolo de um dos maiores casos de recuperação de espécie.','ICMBio / IUCN'),
('Tamanduá-bandeira','Myrmecophaga tridactyla','NATIVA','VU','Grande mamífero que se alimenta de formigas e cupins.',NULL,'MAMIFERO','BAIXO','Pode se defender com as garras se acuado. Mantenha distância.',14,16,FALSE,'Pode comer milhares de formigas por dia.','ICMBio / IUCN'),
('Peixe-boi-da-amazônia','Trichechus inunguis','NATIVA','VU','Mamífero aquático herbívoro dos rios amazônicos.',NULL,'MAMIFERO','NENHUM',NULL,30,60,FALSE,NULL,'ICMBio / IUCN'),
('Jararaca','Bothrops jararaca','NATIVA','LC','Serpente peçonhenta comum na Mata Atlântica.',NULL,'REPTIL','ALTO','Peçonhenta. Não tente capturar. Procure atendimento médico imediatamente.',15,25,TRUE,NULL,'Instituto Butantan');

INSERT INTO Especie_biomas (especie_id, bioma)
SELECT e.id, b.bioma FROM Especies e JOIN (
 SELECT 'Guará-lobo' n,'CERRADO' bioma UNION ALL SELECT 'Guará-lobo','PAMPA' UNION ALL SELECT 'Guará-lobo','MATA ATLANTICA' UNION ALL
 SELECT 'Onça-pintada','AMAZONIA' UNION ALL SELECT 'Onça-pintada','PANTANAL' UNION ALL SELECT 'Onça-pintada','CERRADO' UNION ALL
 SELECT 'Gambá-de-orelha-branca (saruê)','CERRADO' UNION ALL SELECT 'Gambá-de-orelha-branca (saruê)','MATA ATLANTICA' UNION ALL
 SELECT 'Aranha-marrom','MATA ATLANTICA' UNION ALL SELECT 'Aranha-marrom','PAMPA' UNION ALL
 SELECT 'Arara-azul-grande','PANTANAL' UNION ALL SELECT 'Arara-azul-grande','CERRADO' UNION ALL SELECT 'Arara-azul-grande','AMAZONIA' UNION ALL
 SELECT 'Lobo-marinho-sul-americano','PAMPA' UNION ALL
 SELECT 'Mico-leão-dourado','MATA ATLANTICA' UNION ALL
 SELECT 'Tamanduá-bandeira','CERRADO' UNION ALL SELECT 'Tamanduá-bandeira','PANTANAL' UNION ALL SELECT 'Tamanduá-bandeira','AMAZONIA' UNION ALL
 SELECT 'Peixe-boi-da-amazônia','AMAZONIA' UNION ALL
 SELECT 'Jararaca','MATA ATLANTICA' UNION ALL SELECT 'Jararaca','CERRADO'
) b ON b.n = e.nome_popular;

-- ALERTAS (alguns anônimos, com coordenadas e bioma)
INSERT INTO Alertas (especie_id,usuario_id,municipio,uf,bioma,data_avistamento,descricao,situacao,latitude,longitude) VALUES
((SELECT id FROM Especies WHERE nome_popular='Guará-lobo'),(SELECT id FROM Usuario WHERE email='maria@email.com'),'Campo Grande','MS','CERRADO','2026-06-12','Avistado em área de cerrado.','PENDENTE',-20.4697,-54.6201),
((SELECT id FROM Especies WHERE nome_popular='Guará-lobo'),NULL,'Uberaba','MG','CERRADO','2026-08-03','Visto à beira da estrada.','VERIFICADO',-19.7472,-47.9319),
((SELECT id FROM Especies WHERE nome_popular='Onça-pintada'),(SELECT id FROM Usuario WHERE email='joao@email.com'),'Corumbá','MS','PANTANAL','2026-07-15','Pegadas e avistamento.','VERIFICADO',-19.0078,-57.6510),
((SELECT id FROM Especies WHERE nome_popular='Arara-azul-grande'),NULL,'Poconé','MT','PANTANAL','2026-09-02','Casal em árvore.','PENDENTE',-16.2567,-56.6228),
((SELECT id FROM Especies WHERE nome_popular='Gambá-de-orelha-branca (saruê)'),(SELECT id FROM Usuario WHERE email='maria@email.com'),'Diadema','SP','MATA ATLANTICA','2026-10-10','No quintal, à noite.','REJEITADO',-23.6861,-46.6228),
((SELECT id FROM Especies WHERE nome_popular='Lobo-marinho-sul-americano'),NULL,'Torres','RS','PAMPA','2026-05-28','Animal na praia.','PENDENTE',-29.3351,-49.7263),
((SELECT id FROM Especies WHERE nome_popular='Mico-leão-dourado'),NULL,'Silva Jardim','RJ','MATA ATLANTICA','2026-09-20','Grupo em árvore.','VERIFICADO',-22.6500,-42.4000),
(NULL,(SELECT id FROM Usuario WHERE email='joao@email.com'),'Diadema','SP','MATA ATLANTICA','2026-10-18','Animal não identificado.','PENDENTE',-23.6900,-46.6200);

-- DENÚNCIAS (nossas) + HISTÓRICO
INSERT INTO Denuncias (protocolo,usuario_id,tipo,status_atual,status_envio) VALUES
('FA-2026-AB3K7M',(SELECT id FROM Usuario WHERE email='maria@email.com'),'ABANDONO','Recebida','ENVIADA'),
('FA-2026-CD5N9P',(SELECT id FROM Usuario WHERE email='maria@email.com'),'MAUS_TRATOS','Concluida','ENVIADA'),
('FA-2026-EF2Q8R',(SELECT id FROM Usuario WHERE email='maria@email.com'),'TRAFICO','Rejeitada','ENVIADA'),
('FA-2026-GH4T6W',(SELECT id FROM Usuario WHERE email='joao@email.com'),'CACA','Em_validacao','ENVIADA'),
('FA-2026-JK7X2Y',NULL,'PESCA','Recebida','ENVIADA');

INSERT INTO Denuncia_historico (denuncia_id,status_denun,observacao,origem)
SELECT id,'Recebida','Denúncia registrada e enviada ao órgão.','SISTEMA' FROM Denuncias;
INSERT INTO Denuncia_historico (denuncia_id,status_denun,observacao,origem) VALUES
((SELECT id FROM Denuncias WHERE protocolo='FA-2026-CD5N9P'),'Concluida','Status atualizado pelo órgão.','ORGAO'),
((SELECT id FROM Denuncias WHERE protocolo='FA-2026-EF2Q8R'),'Rejeitada','Status atualizado pelo órgão.','ORGAO'),
((SELECT id FROM Denuncias WHERE protocolo='FA-2026-GH4T6W'),'Em_validacao','Status atualizado pelo órgão.','ORGAO');

-- ONGs
INSERT INTO ONG (nome,descricao,contato,site,areas_atuacao,UF) VALUES
('S.A.V.A - Solidariedade à Vida Animal','Cuida de animais com deficiência e idosos.','contato@sava.org',NULL,'Resgate, abrigo','SP'),
('Clube dos Viralatas','ONG de proteção animal.',NULL,NULL,'Adoção','SP'),
('Instituto Ampara Animal','Proteção e defesa animal.',NULL,NULL,'Defesa animal','SP');

-- ÓRGÃO MOCK (mesmos protocolos)
USE Orgao_mock;
INSERT INTO Denuncias_recebidas (protocolo,tipo,descricao,local_descricao,data_ocorrencia,status_denun,latitude,longitude) VALUES
('FA-2026-AB3K7M','ABANDONO','Cachorro abandonado em terreno baldio.','Diadema/SP - Rua das Perobas','2026-10-13','Recebida',-23.6861,-46.6228),
('FA-2026-CD5N9P','MAUS_TRATOS','Animal acorrentado sem água.','Campinas/SP','2026-09-03','Concluida',-22.9056,-47.0608),
('FA-2026-EF2Q8R','TRAFICO','Venda de aves silvestres em feira.','Salvador/BA','2026-04-05','Rejeitada',-12.9714,-38.5014),
('FA-2026-GH4T6W','CACA','Tiros e armadilhas em área de mata.','Campo Grande/MS','2026-10-01','Em_validacao',-20.4697,-54.6201),
('FA-2026-JK7X2Y','PESCA','Pesca com rede em período de defeso.','Corumbá/MS','2026-10-20','Recebida',-19.0078,-57.6510);