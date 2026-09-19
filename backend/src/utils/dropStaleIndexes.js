/**
 * Drop stale MongoDB indexes that are not part of the current schema.
 * Call this once at server startup after database connection is established.
 */
import mongoose from 'mongoose';

export const dropStaleIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    const usersCollection = db.collection('users');
    const indexes = await usersCollection.indexes();

    // Drop firebase_uid index if it exists (remnant from old schema)
    const firebaseIndex = indexes.find(
      (idx) => idx.name === 'firebase_uid_1' || (idx.key && idx.key.firebase_uid)
    );

    if (firebaseIndex) {
      console.log('[DB Maintenance] Dropping stale index: firebase_uid_1');
      await usersCollection.dropIndex('firebase_uid_1');
      console.log('[DB Maintenance] Successfully dropped stale firebase_uid_1 index');
    }
  } catch (error) {
    // Ignore errors — index may not exist or collection may not exist yet
    if (error.codeName !== 'IndexNotFound') {
      console.warn('[DB Maintenance] Warning during stale index cleanup:', error.message);
    }
  }
};

export default dropStaleIndexes;
