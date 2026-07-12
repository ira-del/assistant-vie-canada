-- Persistance du dismiss des alertes intelligentes
create table dismissed_alerts (
  user_id uuid references auth.users(id) on delete cascade not null,
  alert_id text not null,
  dismissed_at timestamptz default now() not null,
  primary key (user_id, alert_id)
);

alter table dismissed_alerts enable row level security;

create policy "Users can view their own dismissed alerts"
  on dismissed_alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own dismissed alerts"
  on dismissed_alerts for insert
  with check (auth.uid() = user_id);

-- Historique réel du score de santé / valeur nette (un point par jour)
create table health_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  snapshot_date date not null default current_date,
  health_score int not null,
  patrimoine_net numeric not null,
  epargne numeric not null,
  dettes numeric not null,
  created_at timestamptz default now() not null,
  unique (user_id, snapshot_date)
);

alter table health_snapshots enable row level security;

create policy "Users can view their own health snapshots"
  on health_snapshots for select
  using (auth.uid() = user_id);

create policy "Users can insert their own health snapshots"
  on health_snapshots for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own health snapshots"
  on health_snapshots for update
  using (auth.uid() = user_id);

-- Persistance de l'historique du chat Assistant IA
create table assistant_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now() not null
);

alter table assistant_messages enable row level security;

create policy "Users can view their own assistant messages"
  on assistant_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own assistant messages"
  on assistant_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own assistant messages"
  on assistant_messages for delete
  using (auth.uid() = user_id);

-- Rate-limiting sur les actions IA
create table ai_usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  action text not null,
  created_at timestamptz default now() not null
);

alter table ai_usage_log enable row level security;

create policy "Users can view their own ai usage log"
  on ai_usage_log for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ai usage log"
  on ai_usage_log for insert
  with check (auth.uid() = user_id);

create index ai_usage_log_user_action_created_idx
  on ai_usage_log (user_id, action, created_at);
