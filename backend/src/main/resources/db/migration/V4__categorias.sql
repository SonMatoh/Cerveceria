-- V4: sembrar catálogo de categorías y vincular productos existentes.
-- Idempotente.

insert into categorias (nombre) values
  ('Cervezas'),
  ('Shooters'),
  ('Aperitivos')
on conflict (nombre) do nothing;

update public.productos p
set categoria_id = c.id
from public.categorias c
where p.categoria_id is null
  and c.nombre = p.categoria;

-- Verificación (se ve en los logs de Flyway)
select c.nombre as categoria, count(p.id) as productos
from public.categorias c
left join public.productos p on p.categoria_id = c.id
group by c.nombre
order by c.nombre;
