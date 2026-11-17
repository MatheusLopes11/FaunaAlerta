-- FUNCTIONS DO SISTEMA

-- DROP FUNCTION IF EXISTS classificacao_especie;
use FaunaAlerta;
/*
Essa função é responsável por classificar a espécie a depender de sua origem (caso seja exótica ou invasora) ou o status da sobrevivência da espécie
*/
DELIMITER $$ 
CREATE FUNCTION classificacao_especie(p_origem VARCHAR(20), p_status VARCHAR(2))
RETURNS VARCHAR(30)
DETERMINISTIC
NO SQL
BEGIN
	CASE
		WHEN p_origem IS NULL THEN RETURN 'Não identificada';
        WHEN p_origem = 'EXOTICA_INVASORA' THEN RETURN 'Exótica invasora';
        WHEN p_origem = 'EXOTICA' THEN RETURN 'Exótica';
        WHEN p_status IN('VU', 'EN', 'CR', 'EW') THEN RETURN 'Nativa ameaçada';
        WHEN p_status = 'NT' THEN RETURN 'Nativa quase ameaçada';
        ELSE RETURN 'Nativa';
	END CASE;
END$$
DELIMITER ;

-- teste-
SELECT classificacao_especie('EXOTICA', 'LC');
SELECT classificacao_especie('NATIVA', 'VU');

USE FaunaAlerta;
DELIMITER //
CREATE FUNCTION fn_total_alertas_especie(p_especie INT UNSIGNED) RETURNS INT
READS SQL DATA
BEGIN
  RETURN (SELECT COUNT(*) FROM Alertas WHERE especie_id = p_especie);
END //
CREATE FUNCTION fn_tem_risco(p_nivel VARCHAR(10)) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
  RETURN p_nivel IN ('MODERADO','ALTO');
END //
DELIMITER ;