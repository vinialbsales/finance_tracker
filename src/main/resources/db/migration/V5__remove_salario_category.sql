-- "Salário" is an income concept, but categories are only chosen for EXPENSE
-- transactions. Detach existing rows before deleting it: income loses its
-- category (allowed since V4), and any expense moves to "Outros".
UPDATE transactions
SET category_id = NULL
WHERE type = 'INCOME'
  AND category_id = (SELECT id FROM categories WHERE name = 'Salário');

UPDATE transactions
SET category_id = (SELECT id FROM categories WHERE name = 'Outros')
WHERE category_id = (SELECT id FROM categories WHERE name = 'Salário');

DELETE FROM categories WHERE name = 'Salário';
