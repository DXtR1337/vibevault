-- Enable RLS (if not already enabled)
alter table notes enable row level security;

-- Drop existing policy if it exists (to avoid errors on re-run)
drop policy if exists "Public Access" on notes;

-- Create a policy that allows everything for everyone (Public)
-- WARNING: This is for development only. In production, you'd want authenticated access.
create policy "Public Access"
on notes
for all
using (true)
with check (true);
