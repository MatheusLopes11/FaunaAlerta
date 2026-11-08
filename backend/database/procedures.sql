-- PROCEDURES
USE FaunaAlerta;
/*
PROCEDURES 1:
Traz todos os dados do avistamento, possibilitando filtar os dados.
*/

-- DROP PROCEDURE IF EXISTS sp_relatorio_alertas;

DELIMITER $$
CREATE PROCEDURE sp_relatorio_alertas(
  IN p_inicio DATE,
  IN p_fim DATE,
  IN p_uf CHAR(2),
  IN p_bioma VARCHAR(20),
  IN p_classificacao VARCHAR(30),
  IN p_apenas_verificados BOOLEAN
)
BEGIN
  IF p_inicio IS NOT NULL AND p_fim IS NOT NULL AND p_inicio > p_fim THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'A data inicial não pode ser maior que a data final.';
  END IF;
 
  SELECT *
  FROM vw_alertas_relatorio
  WHERE (p_inicio IS NULL OR data_avistamento >= p_inicio)
    AND (p_fim IS NULL OR data_avistamento <= p_fim)
    AND (p_uf IS NULL OR uf = p_uf)
    AND (p_bioma IS NULL OR bioma = p_bioma)
    AND (p_classificacao IS NULL OR classificacao = p_classificacao)
    AND (p_apenas_verificados IS NULL
         OR p_apenas_verificados = FALSE
         OR situacao = 'VERIFICADO')
  ORDER BY data_avistamento DESC, alerta_id DESC;
END$$
DELIMITER ;
 
 CALL sp_relatorio_alertas(NULL, NULL, NULL, NULL, NULL,TRUE);


/*
PROCEDURE 2:
Faz um resumo do relatório, chamando três consultas de uma vez. Primeira consulta retorna o total de alertas por determinado período em um UF
A segunda consulta retorna o total e percentual de avistamentos de determinada classificacao
A terceira consulta mostra os alertas verificados p/ mês, dando um estimativa se a quantidade de alertas está subindo ou descendo.
*/
DROP PROCEDURE IF EXISTS sp_resumo_relatorio;
 
DELIMITER $$
CREATE PROCEDURE sp_resumo_relatorio(
  IN p_inicio DATE,
  IN p_fim DATE,
  IN p_uf CHAR(2)
)
BEGIN
  IF p_inicio IS NOT NULL AND p_fim IS NOT NULL AND p_inicio > p_fim THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'A data inicial não pode ser maior que a data final.';
  END IF;
 
  SELECT
    COUNT(*)                                          AS total_alertas,
    COALESCE(SUM(situacao = 'VERIFICADO'), 0)         AS verificados,
    COALESCE(SUM(situacao = 'PENDENTE'), 0)           AS pendentes,
    COALESCE(SUM(situacao = 'REJEITADO'), 0)          AS rejeitados,
    COUNT(DISTINCT CASE WHEN situacao = 'VERIFICADO' THEN especie_id END) AS especies_distintas,
    COUNT(DISTINCT CASE WHEN situacao = 'VERIFICADO' THEN CONCAT(uf, '-', municipio) END) AS locais_distintos,
    COALESCE(SUM(situacao = 'VERIFICADO' AND especie_id IS NULL), 0) AS verificados_sem_especie
  FROM vw_alertas_relatorio
  WHERE (p_inicio IS NULL OR data_avistamento >= p_inicio)
    AND (p_fim IS NULL OR data_avistamento <= p_fim)
    AND (p_uf IS NULL OR uf = p_uf);

  SELECT
    classificacao,
    COUNT(*) AS total,
    ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS percentual
  FROM vw_alertas_relatorio
  WHERE situacao = 'VERIFICADO'
    AND (p_inicio IS NULL OR data_avistamento >= p_inicio)
    AND (p_fim IS NULL OR data_avistamento <= p_fim)
    AND (p_uf IS NULL OR uf = p_uf)
  GROUP BY classificacao
  ORDER BY total DESC;
 
  SELECT
    ano_mes,
    COUNT(*) AS total
  FROM vw_alertas_relatorio
  WHERE situacao = 'VERIFICADO'
    AND (p_inicio IS NULL OR data_avistamento >= p_inicio)
    AND (p_fim IS NULL OR data_avistamento <= p_fim)
    AND (p_uf IS NULL OR uf = p_uf)
  GROUP BY ano_mes
  ORDER BY ano_mes;
END$$
DELIMITER ;

CALL sp_resumo_relatorio(NULL, NULL, NULL);
CALL sp_resumo_relatorio('2026-01-01', '2026-12-31', 'RS');

USE FaunaAlerta;
DELIMITER //
CREATE PROCEDURE sp_alterar_status_pesquisador(IN p_usuario INT UNSIGNED, IN p_status VARCHAR(10))
BEGIN
  UPDATE Usuario SET status_cadastro = p_status
  WHERE id = p_usuario AND perfil = 'Pesquisador';
END //
CREATE PROCEDURE sp_resumo_denuncias_usuario(IN p_usuario INT UNSIGNED)
BEGIN
  SELECT status_atual, COUNT(*) AS total
  FROM Denuncias WHERE usuario_id = p_usuario GROUP BY status_atual;
END //
DELIMITER ;