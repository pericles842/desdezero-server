CREATE TABLE `rifas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `url_img` varchar(255) NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `precio` double NOT NULL,
  `status` enum('activa','no_activa') DEFAULT 'activa',
  `objetivo_ventas` int COMMENT 'objetivo de tiket',
  `participantes` double,
  `fondos_recaudados` double,
  `ver_fecha` bool DEFAULT false,
  `ver_participantes` bool DEFAULT false,
  `ver_ganador` bool DEFAULT false,
  `ver_tickets` bool DEFAULT false,
  `creado_en` datetime
);

CREATE TABLE `tickets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `codigo` int NOT NULL,
  `id_rifa` int NOT NULL,
  `id_usuario` int NOT NULL,
  `creado_en` datetime
);

CREATE TABLE `usuarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) UNIQUE NOT NULL,
  `telefono` varchar(255) UNIQUE NOT NULL,
  `creado_en` datetime
);

CREATE TABLE `metodos_pago` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `tipo` enum('pagomovil','transferencia','billeteradigital'),
  `nombre` varchar(255),
  `titular` varchar(255),
  `min_tickets` int,
  `url_img` varchar(255),
  `datos` json
);

CREATE TABLE `pagos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_metodo_pago` int NOT NULL,
  `total` double,
  `total_bs` double,
  `tasa` varchar(255),
  `comprobante` varchar(255),
  `estatus` enum('aprobado','pendiente','rechazado'),
  `fecha` datetime
);

ALTER TABLE `tickets` ADD FOREIGN KEY (`id_rifa`) REFERENCES `rifas` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

ALTER TABLE `pagos` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

ALTER TABLE `pagos` ADD FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodos_pago` (`id`);
