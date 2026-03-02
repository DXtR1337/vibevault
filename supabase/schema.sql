-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the notes table
create table notes (
  id uuid default gen_random_uuid() primary key,
  content text,
  embedding vector(1536), -- 1536 is the default dimension for OpenAI's text-embedding-ada-002
  tags text[],
  created_at timestamp with time zone default now()
);

-- Check if table was created
select * from notes limit 1;
