-- Create the storage bucket 'uploads'
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Set up RLS for the uploads bucket
create policy "Public Access"
on storage.objects
for all
to public
using ( bucket_id = 'uploads' )
with check ( bucket_id = 'uploads' );
