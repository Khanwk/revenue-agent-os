create extension if not exists pgcrypto;

create table if not exists public.company_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  scans_used integer not null default 0 check (scans_used >= 0),
  scan_limit integer not null default 5 check (scan_limit >= 0),
  hourly_window_start timestamptz not null default date_trunc('hour', now()),
  hourly_runs integer not null default 0 check (hourly_runs >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_runs (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id text not null,
  status text not null check (status in ('queued','thinking','tool','validating','completed','failed')),
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error text,
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists agent_runs_user_updated_idx on public.agent_runs(user_id, updated_at desc);

create table if not exists public.oauth_connections (
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  token_ciphertext text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);

create table if not exists public.oauth_states (
  state text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists oauth_states_expires_idx on public.oauth_states(expires_at);

alter table public.company_profiles enable row level security;
alter table public.user_usage enable row level security;
alter table public.agent_runs enable row level security;
alter table public.oauth_connections enable row level security;
alter table public.oauth_states enable row level security;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.user_usage(user_id, scan_limit) values (new.id, 5) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.user_usage(user_id, scan_limit)
select id, 5 from auth.users
on conflict (user_id) do nothing;

create or replace function public.consume_demo_scan(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_used integer; v_limit integer;
begin
  insert into public.user_usage(user_id, scan_limit) values (p_user_id, 5) on conflict (user_id) do nothing;
  update public.user_usage set scans_used=scans_used+1, updated_at=now()
  where user_id=p_user_id and scans_used < scan_limit
  returning scans_used, scan_limit into v_used, v_limit;
  if not found then
    select scans_used, scan_limit into v_used, v_limit from public.user_usage where user_id=p_user_id;
    return jsonb_build_object('allowed',false,'scans_used',v_used,'scan_limit',v_limit,'scans_remaining',greatest(0,v_limit-v_used));
  end if;
  return jsonb_build_object('allowed',true,'scans_used',v_used,'scan_limit',v_limit,'scans_remaining',greatest(0,v_limit-v_used));
end;
$$;

create or replace function public.refund_demo_scan(p_user_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  update public.user_usage set scans_used=greatest(0,scans_used-1),updated_at=now() where user_id=p_user_id;
end;
$$;

create or replace function public.consume_agent_run(p_user_id uuid,p_limit integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_count integer; v_start timestamptz;
begin
  insert into public.user_usage(user_id, scan_limit) values (p_user_id, 5) on conflict (user_id) do nothing;
  select hourly_runs,hourly_window_start into v_count,v_start from public.user_usage where user_id=p_user_id for update;
  if v_start < date_trunc('hour',now()) then
    v_count:=0; v_start:=date_trunc('hour',now());
  end if;
  if v_count >= p_limit then return jsonb_build_object('allowed',false,'used',v_count,'limit',p_limit); end if;
  update public.user_usage set hourly_runs=v_count+1,hourly_window_start=v_start,updated_at=now() where user_id=p_user_id;
  return jsonb_build_object('allowed',true,'used',v_count+1,'limit',p_limit);
end;
$$;

revoke all on function public.consume_demo_scan(uuid) from public, anon, authenticated;
revoke all on function public.refund_demo_scan(uuid) from public, anon, authenticated;
revoke all on function public.consume_agent_run(uuid,integer) from public, anon, authenticated;
grant execute on function public.consume_demo_scan(uuid) to service_role;
grant execute on function public.refund_demo_scan(uuid) to service_role;
grant execute on function public.consume_agent_run(uuid,integer) to service_role;
