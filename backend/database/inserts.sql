USE FaunaAlerta;

INSERT INTO usuario(nome, email, telefone, senha_hash, perfil, status_cadastro) VALUES
('Ana Carolina','Ana@gmail.com', '11942341234', '$2b$10$2pFbHC1fS41lvd0AV4/1A.46bEu9gXy0kQHasjksqdzHK6tnUaVdu', 'Usuario', 'Aprovado'), -- Senha: Teste@123
('Carlos Henrique','Carlos@gmail.com', '11999990000', '$2b$10$2pFbHC1fS41lvd0AV4/1A.46bEu9gXy0kQHasjksqdzHK6tnUaVdu', 'Usuario', 'Aprovado'),
('Kauã Osório','Kauã@gmail.com', '11924359093', '$2b$10$2pFbHC1fS41lvd0AV4/1A.46bEu9gXy0kQHasjksqdzHK6tnUaVdu', 'Usuario', 'Aprovado'),
('Fernanda Batista','Fernanda@gmail.com', '21927385043', '$2b$10$2pFbHC1fS41lvd0AV4/1A.46bEu9gXy0kQHasjksqdzHK6tnUaVdu', 'Usuario', 'Aprovado'),
('Alanis Santos','Alanis@gmail.com', '81923450943', '$2b$10$2pFbHC1fS41lvd0AV4/1A.46bEu9gXy0kQHasjksqdzHK6tnUaVdu', 'Usuario', 'Aprovado'),
('Admin Teste','adminteste@gmail.com', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado'), -- Senha: Admin@123
('Gustavo Fernández','gustavo@gmail.com', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado'),
('Kevin Afonso','Kevin@gmail.com', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado'),
('Marcelo de Souza','Marcelo@gmail.com', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado'),
('Matheus Ferreira','Matheus@gmail.com', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado'),
('Sophia Santoro','Sophia', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado'),
('Wagner Acácio','Wagner@gmail.com', '11999990000', '$2b$10$wJYp3Eey11EXiyBz6eg/eu6Pdpu/XzKZvn28pDrcKaw6kHKDiBSTa', 'Admin', 'Aprovado');

INSERT INTO usuario(nome, telefone, senha_hash, perfil, status_cadastro) VALUES
('Thom Marques', '11987654321', '$2b$10$hcDfd1bsrLxGzyNB89ksJ.m7BO/hyQeOKC.NF7/FVNFpmXM/.NbbG', 'Pesquisador', 'Aprovado'), -- Senha: Pesquisador123
('Wendell da Silva', '11987654321', '$2b$10$hcDfd1bsrLxGzyNB89ksJ.m7BO/hyQeOKC.NF7/FVNFpmXM/.NbbG', 'Pesquisador', 'Aprovado'),
('Eduardo Rodrigues', '11987654321', '$2b$10$hcDfd1bsrLxGzyNB89ksJ.m7BO/hyQeOKC.NF7/FVNFpmXM/.NbbG', 'Pesquisador', 'Aprovado'),
('Eri Lima', '22987654321', '$2b$10$hcDfd1bsrLxGzyNB89ksJ.m7BO/hyQeOKC.NF7/FVNFpmXM/.NbbG', 'Pesquisador', 'Pendente'),
('Elise Ângelo', '31987654321', '$2b$10$hcDfd1bsrLxGzyNB89ksJ.m7BO/hyQeOKC.NF7/FVNFpmXM/.NbbG', 'Pesquisador', 'Aprovado');


INSERT INTO pesquisador(usuario_id, instituicao, area_pesquisa, link_lattes_orcid, email_institucional) VALUES
(18, 'Universidade de São Paulo', 'Ciências Biologias', 'https://lattes.cnpq.br', 'Thom@usp.sp.gov.br'),
(19, 'Universidade Estadual de Campinas', 'Medicina Veterinária', 'https://lattes.cnpq.br', 'Wendell@unicamp.sp.gov.br'),
(20, 'Universidade Estadual Paulista', 'Ecologia', 'https://lattes.cnpq.br', 'Eduardo@unesp.sp.gov.br'),
(21, 'Universidade Federal do Rio de Janeiro', 'Biologia Marinha', 'https://lattes.cnpq.br', 'Eri@ufrj.rj.gov.br'),
(22, 'Universidade Federal de Minas Gerais', 'Aquicultura', 'https://lattes.cnpq.br', 'Elise@ufmg.mg.gov.br');

INSERT INTO especies
(nome_popular, nome_cientifico, origem, status_conservacao, descricao, imagem_url, grupo,
 nivel_risco, descricao_risco, expectativa_vida_min, expectativa_vida_max, aparece_em_casas,
 curiosidades, fonte, gbif_key, imagem_credito, revisado)
VALUES
('Mico-leão-dourado', 'Leontopithecus rosalia', 'NATIVA', 'EN',
 'Pequeno primata de pelagem dourada, típico de remanescentes da Mata Atlântica.',
 'https://exemplo.com/imagens/mico-leao-dourado.jpg', 'MAMIFERO',
 'NENHUM', NULL, 8, 15, FALSE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', TRUE),
('Tamanduá-bandeira', 'Myrmecophaga tridactyla', 'NATIVA', 'VU',
 'Mamífero de focinho longo que se alimenta de formigas e cupins em áreas abertas.',
 'https://exemplo.com/imagens/tamandua-bandeira.jpg', 'MAMIFERO',
 'BAIXO', 'Pode se defender com as garras se for acuado. Não se aproxime nem tente tocar.', 12, 16, FALSE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', TRUE),
('Sapo-cururu', 'Rhinella marina', 'NATIVA', 'LC',
 'Sapo grande e robusto, comum perto de casas e jardins.',
 'https://exemplo.com/imagens/sapo-cururu.jpg', 'ANFIBIO',
 'MODERADO', 'Suas glândulas liberam toxina irritante. Não manuseie e mantenha cães e gatos afastados.', 5, 10, TRUE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', FALSE),
('Jararaca', 'Bothrops jararaca', 'NATIVA', 'LC',
 'Serpente peçonhenta comum em áreas de mata e bordas de plantações.',
 'https://exemplo.com/imagens/jararaca.jpg', 'REPTIL',
 'ALTO', 'A picada pode ser grave. Não tente capturar nem matar; mantenha distância, avise o órgão ambiental e procure atendimento médico em caso de acidente.', 15, 20, FALSE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', TRUE),
('Teiú', 'Salvator merianae', 'NATIVA', 'LC',
 'Grande lagarto onívoro, comum em quintais e áreas abertas.',
 'https://exemplo.com/imagens/teiu.jpg', 'REPTIL',
 'BAIXO', 'Pode morder se for acuado. Não manuseie; mantenha distância.', 12, 20, TRUE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', FALSE),
('Javali', 'Sus scrofa', 'EXOTICA_INVASORA', 'LC',
 'Mamífero exótico invasor que causa danos a lavouras e ecossistemas, em especial no Sul.',
 'https://exemplo.com/imagens/javali.jpg', 'MAMIFERO',
 'MODERADO', 'Pode ser agressivo, principalmente com filhotes. Não se aproxime e comunique o órgão ambiental.', 8, 15, FALSE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', TRUE),
('Mexilhão-dourado', 'Limnoperna fortunei', 'EXOTICA_INVASORA', 'NE',
 'Molusco de água doce invasor que se fixa em estruturas e altera o ambiente aquático.',
 'https://exemplo.com/imagens/mexilhao-dourado.jpg', 'OUTRO',
 'NENHUM', NULL, 1, 3, FALSE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', FALSE),
('Peixe-leão', 'Pterois volitans', 'EXOTICA_INVASORA', 'NE',
 'Peixe marinho invasor de espinhos venenosos, registrado no litoral brasileiro.',
 'https://exemplo.com/imagens/peixe-leao.jpg', 'PEIXE',
 'MODERADO', 'Os espinhos são venenosos. Não toque; em caso de acidente, procure atendimento médico.', 10, 15, FALSE,
 'Dado de teste (espécie marinha, sem bioma terrestre).', 'Dados de teste', NULL, 'Imagem de teste', FALSE),
('Harpia', 'Harpia harpyja', 'NATIVA', 'VU',
 'Uma das maiores aves de rapina do mundo, de floresta densa.',
 'https://exemplo.com/imagens/harpia.jpg', 'AVE',
 'NENHUM', NULL, 25, 35, FALSE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', TRUE),
('Aranha-armadeira', 'Phoneutria nigriventer', 'NATIVA', 'NE',
 'Aranha errante, agressiva quando ameaçada, que se abriga em calçados, roupas e entulho.',
 'https://exemplo.com/imagens/aranha-armadeira.jpg', 'ARACNIDEO',
 'ALTO', 'A picada é dolorosa e pode ser grave. Evite colocar a mão em sapatos e entulho; procure atendimento médico se for picado.', 1, 3, TRUE,
 'Dado de teste.', 'Dados de teste', NULL, 'Imagem de teste', FALSE);

INSERT INTO especie_biomas (especie_id, bioma) VALUES 
(1, 'MATA ATLANTICA'),
(2, 'CERRADO'),
(2, 'AMAZONIA'),
(3, 'CERRADO'),
(3, 'MATA ATLANTICA'),
(3, 'CAATINGA'),
(4, 'MATA ATLANTICA'),
(4, 'CERRADO'),
(5, 'CERRADO'),
(5, 'CAATINGA'),
(5, 'MATA ATLANTICA'),
(5, 'PAMPA'),
(5, 'PANTANAL'),
(6, 'PAMPA'),
(6, 'MATA ATLANTICA'),
(7,  'PAMPA'),
(7, 'PANTANAL' ),
(8, 'AMAZONIA'),
(8, 'CERRADO'),
(9, 'MATA ATLANTICA'),
(9, 'CERRADO'),
(9, 'PAMPA');

INSERT INTO alertas
(especie_id, usuario_id, municipio, UF, bioma, data_avistamento, descricao, situacao)
VALUES
((SELECT id FROM especies WHERE nome_popular = 'Mico-leão-dourado'), 
1, 'Campo Grande', 'MS', 'CERRADO', '2026-09-12','[TESTE-01] Tamanduá atravessando a estrada ao fim da tarde.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Tamanduá-bandeira'), 
1, 'Corumbá', 'MS', 'PANTANAL', '2026-09-20', '[TESTE-02] Animal visto perto de uma fazenda, caminhando devagar.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Jararaca'), 
2, 'São Paulo', 'SP', 'MATA ATLANTICA', '2026-10-03', '[TESTE-03] Cobra encontrada no quintal, perto de entulho.', 'PENDENTE'),
((SELECT id FROM especies WHERE nome_popular = 'Sapo-cururu'), 
NULL, 'Goiânia', 'GO', 'CERRADO', '2026-10-05', '[TESTE-04] Vários sapos perto da luz da varanda após a chuva.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Javali'), 
4,'Pelotas', 'RS', 'PAMPA', '2026-08-28', '[TESTE-05] Grupo de javalis em lavoura de milho.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Javali'), 
3, 'Bagé', 'RS', 'PAMPA', '2026-09-15', '[TESTE-06] Rastros e terra revirada perto de um açude.', 'PENDENTE'),
((SELECT id FROM especies WHERE nome_popular = 'Mexilhão-dourado'), 
5,'Corumbá', 'MS', 'PANTANAL', '2026-07-30', '[TESTE-07] Colônia de mexilhões fixada em uma boia de marcação.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Peixe-leão'), null,
 'Arraial do Cabo', 'RJ', NULL, '2026-10-10',
 '[TESTE-08] Peixe com espinhos longos visto durante mergulho.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Mico-leão-dourado'), 16,
 'Silva Jardim', 'RJ', 'MATA ATLANTICA', '2026-10-14',
 '[TESTE-09] Grupo de micos nas copas das árvores em área de mata.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Harpia'), 17,
 'Altamira', 'PA', 'AMAZONIA', '2026-06-18',
 '[TESTE-10] Ave grande pousada em árvore alta, com crista aberta.', 'VERIFICADO'),
((SELECT id FROM especies WHERE nome_popular = 'Aranha-armadeira'), 17,
 'Curitiba', 'PR', 'MATA ATLANTICA', '2026-09-28',
 '[TESTE-11] Aranha dentro de um sapato. (Rejeitado no teste: foto sem nitidez.)', 'REJEITADO'),
((SELECT id FROM especies WHERE nome_popular = 'Teiú'), 1,
 'Brasília', 'DF', 'CERRADO', '2026-10-18',
 '[TESTE-12] Lagarto grande tomando sol no muro do quintal.', 'PENDENTE'),
(NULL, NULL,
 'Manaus', 'AM', 'AMAZONIA', '2026-10-22',
 '[TESTE-13] Animal não identificado visto à noite perto do rio.', 'PENDENTE'),
(NULL, 3,
 'Palmas', 'TO', 'CERRADO', '2026-10-25',
 '[TESTE-14] Tamanduá próximo a um cupinzeiro à beira da estrada.', 'PENDENTE');


INSERT INTO alerta_midias (alerta_id, tipo, url) VALUES
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-01]%'), 'FOTO',  'https://exemplo.com/midias/alerta-01-foto-1.jpg'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-01]%'), 'VIDEO', 'https://exemplo.com/midias/alerta-01-video-1.mp4'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-02]%'), 'FOTO',  'https://exemplo.com/midias/alerta-02-foto-1.jpg'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-03]%'), 'FOTO',  'https://exemplo.com/midias/alerta-03-foto-1.jpg'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-05]%'), 'FOTO',  'https://exemplo.com/midias/alerta-05-foto-1.jpg'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-05]%'), 'FOTO',  'https://exemplo.com/midias/alerta-05-foto-2.jpg'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-08]%'), 'VIDEO', 'https://exemplo.com/midias/alerta-08-video-1.mp4'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-09]%'), 'FOTO',  'https://exemplo.com/midias/alerta-09-foto-1.jpg'),
((SELECT id FROM alertas WHERE descricao LIKE '[TESTE-10]%'), 'FOTO',  'https://exemplo.com/midias/alerta-10-foto-1.jpg');

INSERT INTO denuncias (protocolo, usuario_id, status_atual, status_envio, criado_em, atualizado_em) VALUES
('DEN-2026-A1B2C3D4', NULL,   'Concluida',    'ENVIADA',  '2026-08-05 09:00:00', '2026-09-10 15:20:00'),
('DEN-2026-E5F6A7B8', 1,   'Em_resolucao', 'ENVIADA',  '2026-09-14 18:10:00', '2026-10-02 11:15:00'),
('DEN-2026-C9D0E1F2', 1,   'Em_validacao', 'ENVIADA',  '2026-10-08 07:45:00', '2026-10-09 13:30:00'),
('DEN-2026-13A4B5C6', 2, 'Rejeitada',    'ENVIADA',  '2026-09-01 20:00:00', '2026-09-04 16:00:00'),
('DEN-2026-D7E8F9A0', 3, 'Recebida',     'ENVIADA',  '2026-10-27 12:00:00', '2026-10-27 12:00:00'),
('DEN-2026-2B1C2D3E', 4,   'Recebida',     'FALHA',    '2026-10-28 08:30:00', '2026-10-28 08:30:00'),
('DEN-2026-41B2C3D4', 4,   'Concluida',    'ENVIADA',  '2026-08-05 09:00:00', '2026-09-10 15:20:00'),
('DEN-2026-65F6A7B8', 4,   'Em_resolucao', 'ENVIADA',  '2026-09-14 18:10:00', '2026-10-02 11:15:00'),
('DEN-2026-79D0E1F2', 4,   'Em_validacao', 'ENVIADA',  '2026-10-08 07:45:00', '2026-10-09 13:30:00'),
('DEN-2026-83A4B5C6', 4, 'Rejeitada',    'ENVIADA',  '2026-09-01 20:00:00', '2026-09-04 16:00:00'),
('DEN-2026-B7E8F9A0', 4, 'Recebida',     'ENVIADA',  '2026-10-27 12:00:00', '2026-10-27 12:00:00'),
('DEN-2026-AB1C2D3E', 5,   'Recebida',     'FALHA',    '2026-10-28 08:30:00', '2026-10-28 08:30:00');

INSERT INTO denuncia_historico (denuncia_id, status_denun, observacao, origem, criado_em) VALUES
(1, 'Recebida', 'Denúncia enviada ao órgão', 'SISTEMA', '2026-08-05 09:00:00'),
(2, 'Em_validacao', 'Em análise pela equipe técnica', 'ORGAO', '2026-08-07 10:30:00'),
(3, 'Em_resolucao', 'Fiscalização agendada', 'ORGAO', '2026-08-20 14:00:00'),
(4, 'Concluida', 'Autuação realizada', 'ORGAO', '2026-09-10 15:20:00'),
(5, 'Recebida', 'Denúncia enviada ao órgão', 'SISTEMA', '2026-09-14 18:10:00'),
(6, 'Em_validacao', 'Em análise pela equipe técnica', 'ORGAO', '2026-09-16 09:00:00'),
(7, 'Em_resolucao', 'Equipe em campo', 'ORGAO',   '2026-10-02 11:15:00'),
(8, 'Recebida', 'Denúncia enviada ao órgão', 'SISTEMA', '2026-10-08 07:45:00'),
(9, 'Em_validacao', 'Em análise pela equipe técnica', 'ORGAO', '2026-10-09 13:30:00'),
(10, 'Recebida', 'Denúncia enviada ao órgão', 'SISTEMA', '2026-09-01 20:00:00'),
(11, 'Rejeitada','Informações insuficientes para fiscalização', 'ORGAO', '2026-09-04 16:00:00'),
(12, 'Recebida','Denúncia enviada ao órgão', 'SISTEMA', '2026-10-27 12:00:00');


INSERT INTO ONG (nome, descricao, contato, site, areas_atuacao, UF) VALUES
('Instituto Fauna Viva (teste)',
 'ONG fictícia dedicada ao resgate e à reabilitação de animais silvestres.',
 'contato@faunaviva.example.com', 'https://faunaviva.example.com',
 'Resgate de animais, reabilitação, educação ambiental', 'SP'),
('Associação Pantanal em Foco (teste)',
 'ONG fictícia que atua na conservação de espécies do Pantanal e no apoio a comunidades locais.',
 'contato@pantanalemfoco.example.com', 'https://pantanalemfoco.example.com',
 'Conservação, pesquisa, monitoramento de fauna', 'MS'),
('Rede Mata Atlântica Viva (teste)',
 'ONG fictícia focada em restauração de habitat e proteção de primatas ameaçados.',
 'contato@matativa.example.com', 'https://matativa.example.com',
 'Restauração florestal, proteção de primatas', 'RJ'),
('Projeto Mar Limpo (teste)',
 'ONG fictícia de proteção da fauna marinha e combate a espécies invasoras no litoral.',
 'contato@marlimpo.example.com', 'https://marlimpo.example.com',
 'Fauna marinha, espécies invasoras, educação ambiental', 'RJ'),
('Coletivo Cerrado Vivo (teste)',
 'ONG fictícia que promove educação ambiental e denúncia de crimes contra a fauna no Cerrado.',
 'contato@cerradovivo.example.com', 'https://cerradovivo.example.com',
 'Educação ambiental, combate ao tráfico de animais', 'GO');


-- Dados para onde serão enviadas as denúncias

USE Orgao_mock;

INSERT INTO denuncias_recebidas
(protocolo, tipo, descricao, local_descricao, data_ocorrencia, status_denun, recebida_em) VALUES
('DEN-2026-A1B2C3D4', 'CACA',
 'Pessoas armando armadilhas para capturar animais silvestres em área de mata.',
 'Estrada rural, km 12, próximo à ponte', '2026-08-02', 'Concluida', '2026-08-05 09:00:00'),
('DEN-2026-E5F6A7B8', 'PESCA',
 'Pesca com rede em período de defeso no rio.',
 'Margem do rio, atrás do sítio', '2026-09-13', 'Em_resolucao', '2026-09-14 18:10:00'),
('DEN-2026-C9D0E1F2', 'MAUS_TRATOS',
 'Animal silvestre mantido em gaiola muito pequena em um quintal.',
 'Rua das Palmeiras, fundos do número 120', '2026-10-06', 'Em_validacao', '2026-10-08 07:45:00'),
('DEN-2026-13A4B5C6', 'TRAFICO',
 'Venda de filhotes de aves silvestres em feira livre.',
 'Feira central, bancas do fundo', '2026-08-30', 'Rejeitada', '2026-09-01 20:00:00'),
('DEN-2026-D7E8F9A0', 'OUTRO',
 'Descarte irregular de resíduos em área de preservação, atraindo animais silvestres.',
 'Terreno baldio ao lado do córrego', '2026-10-25', 'Recebida', '2026-10-27 12:00:00'),
('DEN-2026-FFFF0001', 'CACA',
 'Disparos ouvidos à noite em área de mata fechada (denúncia anônima).',
 'Estrada de terra, entrada da fazenda', '2026-10-20', 'Recebida', '2026-10-21 08:00:00'),
('DEN-2026-FFFF0002', 'PESCA',
 'Barco com redes irregulares na região de desova (denúncia anônima).',
 'Foz do rio, próximo ao píer', '2026-10-15', 'Em_validacao', '2026-10-16 10:00:00');

INSERT INTO denuncia_midias
(denuncia_id, tipo, url, denunciante_nome, denunciante_email, denunciante_telefone) VALUES
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-A1B2C3D4'), 'FOTO',
 'https://exemplo.com/midias/denuncia-a1-foto-1.jpg', NULL, NULL, '11999990000'),
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-A1B2C3D4'), 'VIDEO',
 'https://exemplo.com/midias/denuncia-a1-video-1.mp4', NULL, NULL, '11999990000'),
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-E5F6A7B8'), 'FOTO',
 'https://exemplo.com/midias/denuncia-e5-foto-1.jpg', 'Ana Carolina', 'Ana@gmail.com', '11942341234'),
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-13A4B5C6'), 'FOTO',
 'https://exemplo.com/midias/denuncia-13-foto-1.jpg', 'Carlos Henrique', 'Carlos@gmail.com', '11999990000'),
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-D7E8F9A0'), 'FOTO',
 'https://exemplo.com/midias/denuncia-d7-foto-1.jpg', 'Kauã Osório', 'Kaua@gmail.com', '119243590093'),
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-FFFF0001'), 'FOTO',
 'https://exemplo.com/midias/denuncia-ff01-foto-1.jpg', NULL, NULL, NULL),
((SELECT id FROM denuncias_recebidas WHERE protocolo = 'DEN-2026-FFFF0002'), 'FOTO',
 'https://exemplo.com/midias/denuncia-ff02-foto-1.jpg', NULL, NULL, NULL);

-- só se for adicionar as longitudes e latitudes
/*
USE FaunaAlerta;
UPDATE alertas SET latitude = -20.469700, longitude = -54.620100 WHERE descricao LIKE '[TESTE-01]%'; -- Campo Grande
UPDATE alertas SET latitude = -19.009400, longitude = -57.653100 WHERE descricao LIKE '[TESTE-02]%'; -- Corumba
UPDATE alertas SET latitude = -23.550500, longitude = -46.633300 WHERE descricao LIKE '[TESTE-03]%'; -- Sao Paulo
UPDATE alertas SET latitude = -16.686900, longitude = -49.264800 WHERE descricao LIKE '[TESTE-04]%'; -- Goiania
UPDATE alertas SET latitude = -31.771900, longitude = -52.342600 WHERE descricao LIKE '[TESTE-05]%'; -- Pelotas
UPDATE alertas SET latitude = -31.331400, longitude = -54.101600 WHERE descricao LIKE '[TESTE-06]%'; -- Bage
UPDATE alertas SET latitude = -19.009400, longitude = -57.653100 WHERE descricao LIKE '[TESTE-07]%'; -- Corumba
UPDATE alertas SET latitude = -22.966100, longitude = -42.027800 WHERE descricao LIKE '[TESTE-08]%'; -- Arraial do Cabo
UPDATE alertas SET latitude = -22.653700, longitude = -42.404800 WHERE descricao LIKE '[TESTE-09]%'; -- Silva Jardim
UPDATE alertas SET latitude =  -3.204100, longitude = -52.206000 WHERE descricao LIKE '[TESTE-10]%'; -- Altamira
UPDATE alertas SET latitude = -25.428400, longitude = -49.273300 WHERE descricao LIKE '[TESTE-11]%'; -- Curitiba
UPDATE alertas SET latitude = -15.826700, longitude = -47.921800 WHERE descricao LIKE '[TESTE-12]%'; -- Brasilia
UPDATE alertas SET latitude =  -3.119000, longitude = -60.021700 WHERE descricao LIKE '[TESTE-13]%'; -- Manaus
UPDATE alertas SET latitude = -10.184000, longitude = -48.333600 WHERE descricao LIKE '[TESTE-14]%'; -- Palmas
*/
