-- Table des conversations (une conversation = un fil distinct dans l'historique)
create table assistant_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table assistant_conversations enable row level security;

create policy "Users can view their own conversations"
  on assistant_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own conversations"
  on assistant_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
  on assistant_conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
  on assistant_conversations for delete
  using (auth.uid() = user_id);

-- Rattache chaque message à une conversation
alter table assistant_messages add column conversation_id uuid references assistant_conversations(id) on delete cascade;

-- Migre les messages existants (créés avant l'ajout des conversations) dans une
-- conversation par défaut, un par utilisateur concerné
insert into assistant_conversations (user_id, title)
select distinct user_id, 'Conversation' from assistant_messages where conversation_id is null;

update assistant_messages m
set conversation_id = c.id
from assistant_conversations c
where m.conversation_id is null and m.user_id = c.user_id;

alter table assistant_messages alter column conversation_id set not null;

create index assistant_messages_conversation_idx on assistant_messages (conversation_id, created_at);
