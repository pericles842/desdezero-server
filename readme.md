revertir todas las  migraciones
## npx sequelize-cli db:migrate:undo:all

revertir migracion por nombre de archivo
## npx sequelize-cli db:migrate:undo --env production --name 20250506215451-configuracion_web.js

correr migraciones
## npx sequelize-cli db:migrate

correr un archivo en especifico 
## npx sequelize-cli db:migrate --env production --to 20250506215451-configuracion_web.js

generar una tabla
## npx sequelize-cli migration:generate --name create_x_table

correr datos
## npx sequelize-cli db:seed:all --env production / cerar datos

 correr servidor
## npm run dev 

subir a produccion
## railway up


