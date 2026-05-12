import bcrypt from 'bcryptjs';


const plainPassword = 'ahmadsmdrips';

async function generateHash() {
  const hash = await bcrypt.hash(plainPassword, 12);
  console.log('\nGenerated bcrypt hash:');
  console.log(hash);
  console.log('\nCopy this hash and set it as ADMIN_PASSWORD_HASH in your .env file');
}

generateHash();
