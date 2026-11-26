/* ==========================================================================
   Controle T.I — configuração do Supabase
   --------------------------------------------------------------------------
   Estes valores vêm do painel do Supabase em:
   Project Settings -> API (Project URL e Publishable/anon key).

   Observação: a chave "publishable" (antiga "anon") é PÚBLICA por natureza —
   ela fica embutida no site. A proteção dos dados é feita pelas políticas de
   RLS definidas em supabase/migrations. Nunca coloque aqui a "service_role".
   ========================================================================== */

window.CONTROLE_TI_SUPABASE = {
  url: "https://arxsomeseofwmwaplnbz.supabase.co",
  chave: "sb_publishable_QouSdgtbPVIGqfABdhPO8g_6HED1ODY",
  tabela: "equipamentos",
};
