import { execSync } from 'child_process'

execSync('pnpm publish -r', { stdio: 'inherit' })
