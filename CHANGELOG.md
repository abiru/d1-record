# Changelog

## Unreleased

### Added
- Add a `transaction()` helper that automatically wraps callbacks in `BEGIN` / `COMMIT` / `ROLLBACK` statements to keep D1 operations atomic. (Closes #4)
- Allow chaining multiple `orderBy()` clauses when building queries with `BaseModel` and accept column/direction parameters for clearer multi-column sorting.
