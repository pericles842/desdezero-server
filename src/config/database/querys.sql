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


--ver tikecs generados y comprados del usuarios (pago)
SELECT 
  pagos.cantidad_tickets AS tikes_comprados,
  COUNT(tickets.id) AS tikes_generados
FROM railway.pagos
left JOIN tickets ON tickets.id_pago = pagos.id
WHERE pagos.id = 32
GROUP BY pagos.cantidad_tickets;