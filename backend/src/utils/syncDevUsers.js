import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

async function update() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  const usersCol = mongoose.connection.db.collection('users');

  // Update coderharsh5180 with password '12345678'
  const salt = await bcrypt.genSalt(10);
  const hash12345678 = await bcrypt.hash('12345678', salt);

  const res1 = await usersCol.updateOne(
    { email: 'coderharsh5180@gmail.com' },
    { 
      $set: { 
        password: hash12345678,
        name: 'Harsh',
        fullName: 'Harsh',
        role: 'USER',
        portalType: 'USER',
        isActive: true,
      } 
    }
  );
  console.log('coderharsh5180 update result: matched', res1.matchedCount, 'modified', res1.modifiedCount);

  // Normalize legacy roles & ensure name/fullName exist
  await usersCol.updateMany({ role: 'citizen' }, { $set: { role: 'USER', portalType: 'USER' } });
  await usersCol.updateMany({ role: 'authority' }, { $set: { role: 'LOCAL_AUTH', portalType: 'LOCAL_AUTH' } });
  await usersCol.updateMany({ role: 'responder' }, { $set: { role: 'USER', portalType: 'USER' } });

  const allUsers = await usersCol.find({}).toArray();
  for (const u of allUsers) {
    const nameToSet = u.name || u.fullName || u.full_name || u.email.split('@')[0];
    await usersCol.updateOne(
      { _id: u._id },
      { $set: { name: nameToSet, fullName: nameToSet } }
    );
  }

  const all = await usersCol.find({}).project({ email: 1, role: 1, name: 1 }).toArray();
  console.log('Current users:\n', JSON.stringify(all, null, 2));

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
}

update().catch(err => {
  console.error(err);
  process.exit(1);
});
