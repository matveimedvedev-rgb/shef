import localtunnel from 'localtunnel';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get tunnel password (public IP)
let password = '';
try {
  password = execSync('powershell -Command "(Invoke-WebRequest -Uri \'https://loca.lt/mytunnelpassword\' -UseBasicParsing).Content.Trim()"', { encoding: 'utf-8' }).trim();
} catch (e) {
  password = '92.63.86.234'; // Fallback to known IP
}

// Start a simple HTTP server on port 5174 for the built files
console.log('Building the application...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', async (code) => {
  if (code !== 0) {
    console.error('Build failed!');
    process.exit(1);
  }

  console.log('Starting HTTP server...');
  // Start a simple HTTP server
  const http = await import('http');
  const fs = await import('fs');
  const path = await import('path');
  
  const server = http.default.createServer((req, res) => {
    let filePath = join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(join(__dirname, 'dist'))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    
    fs.default.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // If file not found, serve index.html (for SPA routing)
          filePath = join(__dirname, 'dist', 'index.html');
          fs.default.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(404);
              res.end('Not found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data);
            }
          });
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
      } else {
        const ext = path.default.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
        }[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });

  server.listen(5174, 'localhost', async () => {
    console.log('HTTP server running on port 5174');
    
    // Now create the tunnel
    const tunnel = await localtunnel({ 
      port: 5174,
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

    tunnel.on('close', () => {
      console.log('\nTunnel closed.');
      server.close();
      process.exit(0);
    });
  });
});

