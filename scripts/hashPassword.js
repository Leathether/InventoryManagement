// Utility script to hash passwords for database insertion
// Run: node scripts/hash-password.js <password>
import bcrypt from 'bcrypt';

export default function hashPassword(password, salt) {

  try {
    if (!password) {
      console.error('Please provide a password to hash');
      console.log('Usage: node scripts/hash-password.js <password>');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error retrieving password from command line:', err);
    process.exit(1);
  }
  try {
    console.log(`hasing password: ${password} with salt: ${salt}`);
    const hashed = bcrypt.hashSync(password, salt);
    console.log(`the hashed password is ${hashed}`);
    return hashed;

  } catch (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
}
