require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('.env file location:', require('path').resolve('.env'));
console.log('Current directory:', process.cwd());