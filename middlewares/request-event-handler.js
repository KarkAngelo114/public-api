const { pushLogs } = require("../applications/loggers");

exports.EventRequesthandler = (req, res, next) => {
    const start = Date.now();
    let logged = false;

    const getPerformanceLevel = (duration) => {
        if (duration < 100) return 'fast';
        if (duration < 300) return 'moderate';
        if (duration < 1000) return 'slow';
        return 'very_slow';
    };

    const logRequest = (eventType) => {
        const duration = Date.now() - start;

        pushLogs({
            request_timestamp: new Date().toISOString(),
            duration,
            performance: getPerformanceLevel(duration),
            route: req.route?.path || req.baseUrl || req.originalUrl,
            method: req.method,
            statusCode: res.statusCode || null,
            userAgent: req.headers['user-agent'],
            connection: eventType,
            ip: req.ip,
            responseSize: res.get('Content-Length') || 0,
            error: res.statusCode >= 400
        }, 'REQUEST');
    };

    const safeLog = (eventType) => {
        if (logged) return;
        logged = true;
        logRequest(eventType);
    };

    res.on('finish', () => safeLog('finished'));
    res.on('close', () => safeLog('closed'));

    next();
};
