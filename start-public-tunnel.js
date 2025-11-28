import localtunnel from 'localtunnel';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get tunnel password (public IP)
let password = '';
try {
  password = execSync('powershell -Command "(Invoke-WebRequest -Uri \'https://loca.lt/mytunnelpassword\' -UseBasicParsing).Content.Trim()"', { encoding: 'utf-8' }).trim();
} catch (e) {
  password = '92.63.86.234'; // Fallback to known IP
}

const tunnel = await localtunnel({ 
  port: 5173,
  subdomain: undefined, // Let it auto-generate
  local_host: 'localhost'
});

const url = tunnel.url;
writeFileSync('tunnel-url.txt', url);
writeFileSync('tunnel-password.txt', password);

console.log('\n✅ Public tunnel created!');
console.log('🌐 Share this URL with anyone (works from anywhere):');
console.log(`\n   ${url}\n`);
console.log('🔑 Tunnel Password (share this with visitors):');
console.log(`\n   ${password}\n`);
console.log('📝 Instructions:');
console.log('   Visitors will see a warning page. They need to:');
console.log('   1. Enter the password above');
console.log('   2. Click "Continue"');
console.log('   3. They\'ll only see this once per IP every 7 days\n');
console.log('Press Ctrl+C to stop the tunnel.\n');

// Keep the process alive
tunnel.on('close', () => {
  console.log('\nTunnel closed.');
  process.exit(0);
});

