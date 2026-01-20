import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

function stripOuterQuotes(value: string) {
  let v = value.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  return v.trim()
}

function toDirectSupabaseUrl(pooledUrl: string) {
  // Typical pooled URL:
  // postgres://postgres.<projectRef>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres
  // We want direct:
  // postgresql://postgres:<password>@db.<projectRef>.supabase.co:5432/postgres?sslmode=require
  const url = new URL(pooledUrl)

  const user = decodeURIComponent(url.username)
  const password = decodeURIComponent(url.password)
  const database = url.pathname.replace(/^\//, '') || 'postgres'

  const parts = user.split('.')
  const projectRef = parts.length >= 2 ? parts[1] : ''

  const isPooler = url.hostname.includes('.pooler.supabase.com') || url.port === '6543'
  if (!isPooler || !projectRef || !password) return null

  const direct = new URL(pooledUrl)
  direct.protocol = 'postgresql:'
  direct.username = 'postgres'
  direct.password = password
  direct.hostname = `db.${projectRef}.supabase.co`
  direct.port = '5432'
  direct.pathname = `/${database}`
  direct.searchParams.set('sslmode', 'require')
  return direct.toString()
}

const envFile = join(process.cwd(), '.env.production')

console.log('📥 Loading DATABASE_URL from .env.production...')

try {
  const envContent = readFileSync(envFile, 'utf-8')
  const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m)

  if (!dbUrlMatch) {
    console.error('❌ ERROR: DATABASE_URL not found in .env.production')
    console.error('Run: vercel env pull .env.production --environment=production')
    process.exit(1)
  }

  const pooledDbUrl = stripOuterQuotes(dbUrlMatch[1])
  const directDbUrl = toDirectSupabaseUrl(pooledDbUrl)
  const dbUrlToUse = directDbUrl ?? pooledDbUrl

  console.log(`✅ DATABASE_URL loaded (length: ${pooledDbUrl.length})`)
  if (directDbUrl) {
    console.log('✅ Detected Supabase pooler URL; using DIRECT connection for Prisma (5432).')
  }
  console.log('')
  console.log('🚀 Pushing schema to Supabase...')
  console.log('')

  // Force Prisma to use the chosen URL even if it auto-loads from .env
  // (Prisma v5 `db push` does NOT support --url)
  execSync('npx prisma db push --accept-data-loss --skip-generate', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrlToUse },
  })

  console.log('')
  console.log('✅ Database schema pushed successfully!')
  console.log('')
  console.log('Next step: Seed the database with:')
  console.log('  npm run db:seed')
} catch (error: any) {
  if (error?.status === 1) {
    console.error('')
    console.error('❌ Failed to push schema. Check the error above.')
    process.exit(1)
  }
  throw error
}
