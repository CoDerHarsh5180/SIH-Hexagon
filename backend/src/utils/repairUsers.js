/**
 * One-time repair script:
 * 1. Drop the stale firebase_uid_1 index blocking registration
 * 2. Find and fix users whose password field is missing/empty
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;
  const usersCol = db.collection('users');

  // ── 1. Drop stale firebase_uid index ──
  try {
    const indexes = await usersCol.indexes();
    const stale = indexes.find(i => i.name === 'firebase_uid_1' || (i.key && i.key.firebase_uid));
    if (stale) {
      await usersCol.dropIndex('firebase_uid_1');
      console.log('✅ Dropped stale firebase_uid_1 index');
    } else {
      console.log('ℹ️  firebase_uid_1 index not found (already clean)');
    }
  } catch (err) {
    console.log('⚠️  Index drop skipped:', err.message);
  }

  // ── 2. Find users with missing/empty password ──
  const brokenUsers = await usersCol.find({
    $or: [
      { password: { $exists: false } },
      { password: null },
      { password: '' },
    ]
  }).toArray();

  console.log(`\n🔍 Found ${brokenUsers.length} user(s) with missing password hash:\n`);

  for (const u of brokenUsers) {
    console.log(`  - ${u.email} (role: ${u.role}, _id: ${u._id})`);
    
    // Hash a default password so the user can log in and then change it
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(defaultPassword, salt);
    
    await usersCol.updateOne(
      { _id: u._id },
      { $set: { password: hash } }
    );
    console.log(`    ✅ Reset password to '${defaultPassword}' (bcrypt hashed)`);
  }

  // ── 3. Also check for users with suspiciously short password (unhashed plaintext) ──
  const allUsers = await usersCol.find({
    password: { $exists: true, $ne: null, $ne: '' }
  }).toArray();

  let plaintextCount = 0;
  for (const u of allUsers) {
    // Bcrypt hashes are always 60 chars starting with $2b$ or $2a$
    if (u.password && !u.password.startsWith('$2') && u.password.length < 60) {
      console.log(`\n  - ${u.email}: password appears to be PLAINTEXT (${u.password.length} chars)`);
      
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(u.password, salt);
      
      await usersCol.updateOne(
        { _id: u._id },
        { $set: { password: hash } }
      );
      console.log(`    ✅ Re-hashed plaintext password`);
      plaintextCount++;
    }
  }

  if (plaintextCount === 0 && brokenUsers.length === 0) {
    console.log('\n✅ All user passwords look correct (bcrypt hashed).');
  }

  // ── 4. Summary ──
  const totalUsers = await usersCol.countDocuments();
  console.log(`\n📊 Total users in database: ${totalUsers}`);
  console.log('Done. You can now restart the server.\n');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
