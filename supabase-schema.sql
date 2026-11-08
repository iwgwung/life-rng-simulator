-- Tabla para registrar muertes en el juego Life RNG
CREATE TABLE IF NOT EXISTS graveyard (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  age INTEGER NOT NULL DEFAULT 0,
  money INTEGER NOT NULL DEFAULT 0,
  cause TEXT NOT NULL DEFAULT 'Desconocida',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE graveyard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar muertes" ON graveyard
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Leer muertes" ON graveyard
  FOR SELECT TO public USING (true);

-- Índices
CREATE INDEX idx_graveyard_age_desc ON graveyard (age DESC);
CREATE INDEX idx_graveyard_created_on ON graveyard (created_at DESC);
