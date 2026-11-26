-- ==========================================================================
-- Controle T.I — Tabela de Equipamentos (Supabase / PostgreSQL)
-- Migration inicial. Aplicável via `supabase db push` ou colando no
-- SQL Editor do painel do Supabase.
-- ==========================================================================

-- 1) Tabela principal ------------------------------------------------------
create table if not exists public.equipamentos (
  id            uuid primary key default gen_random_uuid(),
  nome          text        not null default '',
  tipo          text        not null default 'Outro',
  status        text        not null default 'Em uso',
  condicao      text        not null default 'Novo',
  email         text                 default '',
  senha         text                 default '',
  numero        text                 default '',
  imei_ns       text                 default '',
  responsavel   text                 default '',
  observacoes   text                 default '',
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 2) Índices auxiliares (busca e filtros) ----------------------------------
create index if not exists equipamentos_nome_idx     on public.equipamentos (lower(nome));
create index if not exists equipamentos_tipo_idx     on public.equipamentos (tipo);
create index if not exists equipamentos_status_idx   on public.equipamentos (status);
create index if not exists equipamentos_condicao_idx on public.equipamentos (condicao);

-- 3) Trigger para manter atualizado_em -------------------------------------
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_equipamentos_atualizado_em on public.equipamentos;
create trigger trg_equipamentos_atualizado_em
  before update on public.equipamentos
  for each row
  execute function public.set_atualizado_em();

-- 4) Segurança em nível de linha (RLS) -------------------------------------
-- O aplicativo não possui login; o acesso é feito pela chave publica (anon).
-- Estas políticas liberam leitura e escrita para o papel anonimo.
-- ATENCAO: qualquer pessoa com a chave publica podera ler e gravar os dados.
alter table public.equipamentos enable row level security;

drop policy if exists "equipamentos_anon_select" on public.equipamentos;
create policy "equipamentos_anon_select"
  on public.equipamentos for select
  to anon, authenticated
  using (true);

drop policy if exists "equipamentos_anon_insert" on public.equipamentos;
create policy "equipamentos_anon_insert"
  on public.equipamentos for insert
  to anon, authenticated
  with check (true);

drop policy if exists "equipamentos_anon_update" on public.equipamentos;
create policy "equipamentos_anon_update"
  on public.equipamentos for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "equipamentos_anon_delete" on public.equipamentos;
create policy "equipamentos_anon_delete"
  on public.equipamentos for delete
  to anon, authenticated
  using (true);

-- ==========================================================================
-- FIM
-- ==========================================================================
