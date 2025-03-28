const { spawn } = require('child_process');
const path = require('path');

// Start Vite dev server
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

// Wait for Vite to start
setTimeout(() => {
  // Start Electron
  const electron = spawn('npm', ['run', 'electron:dev'], {
    stdio: 'inherit',
    shell: true,
  });

  // Handle process termination
  process.on('SIGTERM', () => {
    vite.kill();
    electron.kill();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    vite.kill();
    electron.kill();
    process.exit(0);
  });
}, 5000); // Wait 5 seconds for Vite to start 