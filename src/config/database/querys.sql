--buscar los tikes de un usuario
SELECT * FROM railway.tickets
INNER JOIN pagos on pagos.id = tickets.id_pago
where pagos.id = 1 ;

-- eliminar los tikes de un usuarios
delete from tickets where tickets.id_pago = 1;

--Url de los comprobantes de pago 
select concat('https://desdezero-server-production.up.railway.app',comprobante) url  from pagos;

--Ver tikes repetidos
SELECT codigo, COUNT(*) as repeticiones FROM tickets GROUP BY codigo HAVING COUNT(*) > 1;