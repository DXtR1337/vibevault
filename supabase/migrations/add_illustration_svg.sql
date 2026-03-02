-- Add illustration_svg column to notes table for AI-generated SVG illustrations
ALTER TABLE notes ADD COLUMN IF NOT EXISTS illustration_svg TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notes' AND column_name = 'illustration_svg';
                        