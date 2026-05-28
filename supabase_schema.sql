create table if not exists public.smartlog_posts (
  id text primary key,
  title text not null,
  author text not null,
  category text not null,
  date text not null,
  summary text not null,
  tags jsonb not null default '[]'::jsonb,
  image text not null default 'assets/warehouse-forklift.jpg',
  body jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.smartlog_forum (
  id bigserial primary key,
  name text not null,
  message text not null,
  date text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.smartlog_subscribers (
  email text primary key,
  name text not null,
  date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.smartlog_posts enable row level security;
alter table public.smartlog_forum enable row level security;
alter table public.smartlog_subscribers enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.smartlog_posts to anon, authenticated, service_role;
grant select, insert, delete on public.smartlog_forum to anon, authenticated, service_role;
grant usage, select on sequence public.smartlog_forum_id_seq to anon, authenticated, service_role;
grant select, insert, update on public.smartlog_subscribers to anon, authenticated, service_role;

drop policy if exists smartlog_posts_select on public.smartlog_posts;
drop policy if exists smartlog_posts_insert on public.smartlog_posts;
drop policy if exists smartlog_posts_update on public.smartlog_posts;
drop policy if exists smartlog_posts_delete on public.smartlog_posts;
drop policy if exists smartlog_forum_select on public.smartlog_forum;
drop policy if exists smartlog_forum_insert on public.smartlog_forum;
drop policy if exists smartlog_forum_delete on public.smartlog_forum;
drop policy if exists smartlog_subscribers_select on public.smartlog_subscribers;
drop policy if exists smartlog_subscribers_insert on public.smartlog_subscribers;
drop policy if exists smartlog_subscribers_update on public.smartlog_subscribers;

create policy smartlog_posts_select on public.smartlog_posts for select using (true);
create policy smartlog_posts_insert on public.smartlog_posts for insert with check (true);
create policy smartlog_posts_update on public.smartlog_posts for update using (true) with check (true);
create policy smartlog_posts_delete on public.smartlog_posts for delete using (true);

create policy smartlog_forum_select on public.smartlog_forum for select using (true);
create policy smartlog_forum_insert on public.smartlog_forum for insert with check (true);
create policy smartlog_forum_delete on public.smartlog_forum for delete using (true);

create policy smartlog_subscribers_select on public.smartlog_subscribers for select using (true);
create policy smartlog_subscribers_insert on public.smartlog_subscribers for insert with check (true);
create policy smartlog_subscribers_update on public.smartlog_subscribers for update using (true) with check (true);
