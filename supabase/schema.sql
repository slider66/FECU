-- Supabase schema bootstrap for FECU
-- Ejecuta este script en el editor SQL de Supabase (base de datos Postgres)

-- 1) Enum para las etapas de reparación
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'repairstage'
          AND n.nspname = 'public'
    ) THEN
        CREATE TYPE public."RepairStage" AS ENUM ('ENTRY', 'EXIT');
    END IF;
END $$;

-- 2) Tabla de fotos
CREATE TABLE IF NOT EXISTS public.photos (
    id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    filename      text         NOT NULL,
    path          text         NOT NULL,
    created_at    timestamptz  NOT NULL DEFAULT now(),
    repair_number text         NOT NULL,
    stage         public."RepairStage" NOT NULL,
    bucket_path   text         NOT NULL,
    file_size     integer,
    mime_type     text,
    technician    text,
    comments      text,

    CONSTRAINT photos_bucket_path_key UNIQUE (bucket_path)
);

-- 3) Indices auxiliares
CREATE INDEX IF NOT EXISTS photos_repair_number_idx
    ON public.photos (repair_number);

CREATE INDEX IF NOT EXISTS photos_stage_idx
    ON public.photos (stage);

CREATE INDEX IF NOT EXISTS photos_created_at_idx
    ON public.photos (created_at DESC);
