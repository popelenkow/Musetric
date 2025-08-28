import { execSync } from 'child_process';

if (process.env.CI_CHECK) {
  console.log('▶ Generating Prisma client…');
  execSync('npx prisma generate', { stdio: 'inherit' });
} else {
  console.log('▶ Setting up database…');
  execSync('npx prisma db push', { stdio: 'inherit' });
}
