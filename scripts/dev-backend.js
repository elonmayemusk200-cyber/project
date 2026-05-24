const net = require('net');
const { spawn } = require('child_process');

const PORT = 5000;

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(1000);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      resolve(false);
    });

    socket.connect(PORT, '127.0.0.1');
  });
}

(async () => {
  const portInUse = await isPortOpen();

  if (portInUse) {
    console.log(`⚠️ Backend already running on port ${PORT}; skipping backend startup.`);
    return;
  }

  const child = spawn('npm', ['--prefix', 'backend', 'run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Backend exited with code ${code}`);
      process.exit(code);
    }
  });
})();
