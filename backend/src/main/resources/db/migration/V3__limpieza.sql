-- V3: limpieza de objetos que quedaron de la etapa con ddl-auto=update.
-- En una base nueva estos objetos no existen; los IF EXISTS hacen la migracion segura.

-- Uniques duplicados: Hibernate creo uno y el script manual creo otro.
-- Se conservan los nombres uq_* definidos en V1.
alter table usuarios drop constraint if exists ukkfsp0s1tflm1cwlj8idhqsad0;
alter table regiones drop constraint if exists uk2utq0pi16tcaxyu29eqyk3olp;
alter table categorias drop constraint if exists ukqcog8b7hps1hioi9onqwjdt6y;

-- Tabla de ejemplo de Neon; no pertenece al modelo.
drop table if exists playing_with_neon;
