-- Controle T.I: cadastro de filiais e vinculo com os equipamentos.

create table if not exists public.filiais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create unique index if not exists filiais_nome_lower_idx
  on public.filiais (lower(nome));

alter table public.filiais enable row level security;

drop policy if exists "filiais_anon_select" on public.filiais;
create policy "filiais_anon_select"
  on public.filiais for select to anon, authenticated
  using (true);

drop policy if exists "filiais_anon_insert" on public.filiais;
create policy "filiais_anon_insert"
  on public.filiais for insert to anon, authenticated
  with check (true);

drop policy if exists "filiais_anon_update" on public.filiais;
create policy "filiais_anon_update"
  on public.filiais for update to anon, authenticated
  using (true) with check (true);

grant select, insert, update on public.filiais to anon, authenticated;

-- Coluna de filial na tabela de equipamentos (opcional).
alter table public.equipamentos
  add column if not exists filial text not null default '';

create index if not exists equipamentos_filial_idx
  on public.equipamentos (lower(filial));

notify pgrst, 'reload schema';
