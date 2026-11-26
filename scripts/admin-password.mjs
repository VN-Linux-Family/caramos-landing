// The value of the ADMIN_PASSWORD_HASH secret for a password (server/admin.js): reads the password from stdin, prints
// the hash. Set it with: node scripts/admin-password.mjs < file | npx wrangler pages secret put ADMIN_PASSWORD_HASH
// --project-name caramos-landing. The password never goes on a command line.
import { hashPassword } from '../server/admin.js';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const password = input.replace(/\r?\n$/, '');
if (password.length < 12) {
  console.error('The password needs at least 12 characters.');
  process.exit(2);
}
process.stdout.write(await hashPassword(password));
