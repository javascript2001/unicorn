import { spawn } from 'child_process'


spawn('node', ['index.js'], { stdio: 'inherit' });
spawn('node', ['src/worker/worker.js'], { stdio: 'inherit' });