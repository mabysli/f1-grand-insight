CREATE TABLE public.f1_api_cache (
  cache_key text PRIMARY KEY,
  data jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.f1_api_cache TO service_role;

ALTER TABLE public.f1_api_cache ENABLE ROW LEVEL SECURITY;