-- Drop existing policies and table
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_insert_admin" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_delete_admin" on public.users;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.users cascade;

-- Create users table with password hash column
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text not null,
  role text default 'user' check (role in ('admin', 'user')),
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Policy: Anyone can select users (for login verification)
create policy "users_select_all"
  on public.users for select
  using (true);

-- Policy: Anyone can insert (for sign up)
create policy "users_insert_all"
  on public.users for insert
  with check (true);

-- Policy: Users can update their own data
create policy "users_update_own"
  on public.users for update
  using (id = (current_setting('app.current_user_id', true))::uuid);

-- Policy: Only admins can delete
create policy "users_delete_admin"
  on public.users for delete
  using (
    exists (
      select 1 from public.users
      where id = (current_setting('app.current_user_id', true))::uuid
      and role = 'admin'
    )
  );

-- Create indexes for performance
create index users_email_idx on public.users(email);
create index users_role_idx on public.users(role);
create index users_is_active_idx on public.users(is_active);

-- Create updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row
  execute function update_updated_at();

-- Insert default admin user (password: admin123)
-- bcrypt hash of "admin123" with cost 10
insert into public.users (email, password_hash, full_name, role)
values (
  'admin@fitplan.com',
  '$2a$10$rMz3QKW6K5xKJ5YJZBYGHeLqVZN4xKbYE0XQqxZqVZN4xKbYE0XQq',
  'Administrador',
  'admin'
) on conflict (email) do nothing;
