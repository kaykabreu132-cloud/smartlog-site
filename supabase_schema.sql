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
