DO $$
DECLARE
    siguiente_id bigint;
BEGIN
    SELECT GREATEST(COALESCE(MAX(id), 999) + 1, 1000) INTO siguiente_id FROM public.ordenes;
    EXECUTE format('ALTER TABLE public.ordenes ALTER COLUMN id RESTART WITH %s', siguiente_id);
END $$;

CREATE OR REPLACE FUNCTION set_nro_orden() RETURNS trigger AS $$
BEGIN
    IF NEW.nro_orden IS NULL THEN
        NEW.nro_orden := 'ORDER-' || NEW.id::text;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;