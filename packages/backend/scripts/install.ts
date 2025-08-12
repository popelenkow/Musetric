import { execSync } from 'child_process';

if (process.env.workspace_mode === 'check') {
  console.log('▶ Generating Prisma client…');
  execSync('yarn prisma generate', { stdio: 'inherit' });
} else {
  console.log('▶ Setting up database…');
  execSync('yarn prisma db push', { stdio: 'inherit' });
}
