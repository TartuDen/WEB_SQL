
export class Logger {
    constructor(user_name, email, password) {
        this.user_name = user_name;
        this.email = email;
        this.password = password;
    }
}
export class LoggerCollection {
    constructor(loggers) {
        this.loggers = loggers.map(logger => new Logger(logger.user_name, logger.email, logger.password));
    }

    addLogger(user_name, email, password) {
        this.loggers.push(new Logger(user_name, email, password));
    }

    getLoggerByEmail(email) {
        return this.loggers.find(logger => logger.email === email);
    }

    getAllLoggers() {
        return this.loggers;
    }
}
