import pino, {Logger} from "pino";

export function getLogger(name:string): Logger {
return pino({
    name: name,
    formatters: {},
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: ['user', 'domain', 'locale']
});
}