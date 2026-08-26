let logs = [];
let duration_threshold = 1000 * 60 * 60;

const flush = () => {
    const now = Date.now();

    for (let i = logs.length - 1; i >= 0; i--) {
        if (now - logs[i].timestamp > duration_threshold) {
            logs.splice(i, 1);
        }
    }
};

setInterval(flush, 1000 * 60 * 60);

/**
 * @function setThreshold
 * @param {Number} threshold - duration threshold in milliseconds
 */
exports.setThreshold = (threshold) => {
    duration_threshold = threshold;
};

/**
 * @function pushLogs
 * @param {Object} data - An object containing logs
 * @param {Object} eventName - event name 
 */
exports.pushLogs = (data, eventName) => {
    const logEntry = {
        ...data,
        timestamp: Date.now(),
        eventType: eventName || "unnamed event"
    };

    logs.push(logEntry);
};

/**
 * @function getLogs
 * @returns an array of objects containing all logs
 */
exports.getLogs = () => {
    return logs;
}