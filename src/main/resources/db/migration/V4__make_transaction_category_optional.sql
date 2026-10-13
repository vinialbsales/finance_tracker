-- Category is only required for EXPENSE transactions (enforced in TransactionService),
-- so INCOME rows may have no category.
ALTER TABLE transactions ALTER COLUMN category_id DROP NOT NULL;
