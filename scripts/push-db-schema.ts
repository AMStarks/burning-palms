import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const envFile = join(process.cwd(), '.env.production');

console.log('📥 Loading DATABASE_URL from .env.production...');

try {
  const envContent = readFileSync(envFile, 'utf-8');
  const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
  
  if (!dbUrlMatch) {
    console.error('❌ ERROR: DATABASE_URL not found in .env.production');
    console.error('Run: vercel env pull .env.production --environment=production');
    process.exit(1);
  }

  // Remove quotes if present
  let dbUrl = dbUrlMatch[1].trim();
  if (dbUrl.startsWith('"') && dbUrl.endsWith('"')) {
    dbUrl = dbUrl.slice(1, -1);
  }
  if (dbUrl.startsWith("'") && dbUrl.endsWith("'")) {
    dbUrl = dbUrl.slice(1, -1);
  }

  console.log(`✅ DATABASE_URL loaded (length: ${dbUrl.length})`);
  console.log('');
  console.log('🚀 Pushing schema to Supabase...');
  console.log('');

  // Set DATABASE_URL and run prisma db push
  process.env.DATABASE_URL = dbUrl;
  
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl }
  });

  console.log('');
  console.log('✅ Database schema pushed successfully!');
  console.log('');
  console.log('Next step: Seed the database with:');
  console.log('  npm run db:seed');
} catch (error: any) {
  if (error.status === 1) {
    console.error('');
    console.error('❌ Failed to push schema. Check the error above.');
    process.exit(1);
  }
  throw error;
}
