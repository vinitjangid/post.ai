/**
 * Simple logger utility for the application
 */
const logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[WARNING] ${new Date().toISOString()}: ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (process.env.DEBUG) {
            console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...args);
        }
    }
};

module.exports = { logger };