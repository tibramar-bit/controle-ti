-- Controle T.I: catalogo de tipos e operacoes de estoque.

create table if not exists public.tipos_equipamento (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create unique index if not exists tipos_equipamento_nome_lower_idx
  on public.tipos_equipamento (lower(nome));

insert into public.tipos_equipamento (nome)
values
  ('Celular'), ('Notebook'), ('Tablet'), ('Desktop'), ('Coletor'),
  ('Chip'), ('Impressora'), ('Rede'), ('Outro')
on conflict do nothing;

alter table public.tipos_equipamento enable row level security;

drop policy if exists "tipos_equipamento_anon_select" on public.tipos_equipamento;
create policy "tipos_equipamento_anon_select"
  on public.tipos_equipamento for select to anon, authenticated
  using (true);

drop policy if exists "tipos_equipamento_anon_insert" on public.tipos_equipamento;
create policy "tipos_equipamento_anon_insert"
  on public.tipos_equipamento for insert to anon, authenticated
  with check (true);

drop policy if exists "tipos_equipamento_anon_update" on public.tipos_equipamento;
create policy "tipos_equipamento_anon_update"
  on public.tipos_equipamento for update to anon, authenticated
  using (true) with check (true);

grant select, insert, update on public.tipos_equipamento to anon, authenticated;

create table if not exists public.movimentacoes_estoque (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  material text not null,
  operacao text not null check (operacao in ('entrada', 'saida')),
  quantidade integer not null check (quantidade > 0),
  responsavel text not null default '',
  observacoes text not null default '',
  criado_em timestamptz not null default now()
);

create index if not exists movimentacoes_estoque_criado_em_idx
  on public.movimentacoes_estoque (criado_em desc);
create index if not exists movimentacoes_estoque_material_idx
  on public.movimentacoes_estoque (lower(tipo), lower(material));

alter table public.movimentacoes_estoque enable row level security;

drop policy if exists "movimentacoes_estoque_anon_select" on public.movimentacoes_estoque;
create policy "movimentacoes_estoque_anon_select"
  on public.movimentacoes_estoque for select to anon, authenticated
  using (true);

grant select on public.movimentacoes_estoque to anon, authenticated;
grant insert on public.movimentacoes_estoque to anon, authenticated;

create or replace function public.registrar_movimentacao_estoque(
  p_tipo text,
  p_material text,
  p_operacao text,
  p_quantidade integer,
  p_responsavel text default '',
  p_observacoes text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_id uuid;
  saldo_atual bigint;
begin
  if nullif(trim(p_tipo), '') is null or nullif(trim(p_material), '') is null then
    raise exception 'Informe o tipo e o material.';
  end if;
  if p_operacao not in ('entrada', 'saida') then
    raise exception 'Operacao invalida.';
  end if;
  if p_quantidade is null or p_quantidade < 1 then
    raise exception 'A quantidade deve ser maior que zero.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(lower(trim(p_tipo) || '|' || trim(p_material)), 0));

  select coalesce(sum(case when operacao = 'entrada' then quantidade else -quantidade end), 0)
    into saldo_atual
    from public.movimentacoes_estoque
    where lower(tipo) = lower(trim(p_tipo))
      and lower(material) = lower(trim(p_material));

  if p_operacao = 'saida' and saldo_atual < p_quantidade then
    raise exception 'Saldo insuficiente. Disponivel: %.', saldo_atual;
  end if;

  insert into public.movimentacoes_estoque
    (tipo, material, operacao, quantidade, responsavel, observacoes)
  values
    (trim(p_tipo), trim(p_material), p_operacao, p_quantidade,
     coalesce(trim(p_responsavel), ''), coalesce(trim(p_observacoes), ''))
  returning id into novo_id;

  return novo_id;
end;
$$;

revoke all on function public.registrar_movimentacao_estoque(text, text, text, integer, text, text) from public;
grant execute on function public.registrar_movimentacao_estoque(text, text, text, integer, text, text)
  to anon, authenticated;
