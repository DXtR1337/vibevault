-- Change embedding vector size from 1536 to 768 to match Gemini Text Embedding 004
alter table notes 
alter column embedding type vector(768);
