export async function transaction<T>(
  db: D1Database,
  callback: (tx: D1Database) => Promise<T> | T
): Promise<T> {
  await db.prepare("BEGIN").run();

  let result: T;

  try {
    result = await callback(db);
  } catch (error) {
    try {
      await db.prepare("ROLLBACK").run();
    } catch {
      // Ignore rollback failures so the original error is surfaced.
    }
    throw error;
  }

  try {
    await db.prepare("COMMIT").run();
  } catch (commitError) {
    try {
      await db.prepare("ROLLBACK").run();
    } catch {
      // Preserve the original commit error when rollback also fails.
    }
    throw commitError;
  }

  return result;
}
