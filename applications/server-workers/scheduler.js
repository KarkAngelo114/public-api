
const path = require('path');
const { Worker } = require('worker_threads');

const start = (workerPath, data) => {
    // This function encapsulates the logic to run a worker
    const worker = new Worker(workerPath, {workerData: data});
    worker.on('message', (msg) => {
        console.log(`Worker message: ${msg}`);
    });
    worker.on('error', (err) => {
        console.error(`Worker error: ${err.message}`);
    });
    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker exited with code ${code}`);
        }
    });
};

/**
 * @function scheduleWorker() 
 * @param {string} app - the file name of your worker. (example: worker.js)
 * @param {number} interval - the interval (in milliseconds) for the worker to run
 * @param {*} data - pass the data from the main thread memory to be use by the worker
 * @param {boolean} onExec - if set to true, the worker will run immediately, otherwise, it will wait for its schedule. Default is false.
 */

const scheduleWorker = (app, interval, data = null, onExec = false) => {
    const workerPath = path.join(__dirname, app);

    if (onExec) {
        start(workerPath, data);
    }
    
    setInterval(() => start(workerPath, data), interval);
};

module.exports = scheduleWorker;