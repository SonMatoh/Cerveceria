-- V5: correcciones de integridad y tipos.
-- 1) blogs.fecha: de varchar a date (los 2 registros existentes se convierten a ISO).
-- 2) CHECKs de productos: precio >= 0 y descuento entre 0 y 100.

update public.blogs set fecha = '2026-10-10' where fecha = '10 de Octubre, 2026';
update public.blogs set fecha = '2026-10-12' where fecha = '12 de Octubre, 2026';

alter table public.blogs alter column fecha type date using fecha::date;

alter table public.productos add constraint ck_productos_precio check (precio >= 0);
alter table public.productos add constraint ck_productos_descuento check (descuento >= 0 and descuento <= 100);

-- Verificación
select 'blogs' as tabla, count(*) as filas from public.blogs
union all
select 'productos_checks', count(*) from public.productos where precio >= 0 and descuento between 0 and 100;
