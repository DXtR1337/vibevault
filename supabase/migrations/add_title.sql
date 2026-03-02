-- Add title column to notes table
alter table notes
add column title text;

-- Check if column was added
select * from notes limit 1;
