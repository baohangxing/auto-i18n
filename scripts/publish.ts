import { execSync } from 'child_process'

execSync('pnpm run build', { stdio: 'inherit' })

execSync('pnpm publish -r', { stdio: 'inherit' })
