create or replace function match_notes (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  title text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    notes.id,
    notes.content,
    notes.title,
    1 - (notes.embedding <=> query_embedding) as similarity
  from notes
  where 1 - (notes.embedding <=> query_embedding) > match_threshold
  order by notes.embedding <=> query_embedding
  limit match_count;
end;
$$;
