/**
 * Created by BOB on 03.04.2018.
 */

// создает объект лога - этот модуль подключаем во всех остальных где нужен лог
const winston = require('winston');

// читаю переменную окружения NODE_ENV
const ENV = process.env.NODE_ENV;

/**
 * функция возвращает объект лога, для его дальнейшего использования
 * @param module
 * @returns {*}
 */
getLogger = (module) => {
    const tsFormat = () => (new Date()).toLocaleTimeString();

    const path = module.filename.split('/').slice(-2).join('/');
    return new winston.Logger({
        transports: [

            //вывод в консоль
            new winston.transports.Console({
                colorize: true,
                timestamp: tsFormat,
                //определяю уровень логирования debug or error
                level: ENV === 'development' ? 'debug' : 'error',

                //в качестве метки сообщения лога вывожу полный путь до модуля.
                label: path
            }),

            //вывод в лог
            new winston.transports.File({
                filename: 'server.log',
                timestamp: tsFormat,
                level: 'debug',
                //в качестве метки сообщения лога вывожу полный путь до модуля.
                label: path
            })
        ],
        exitOnError: false
    });
}

module.exports = getLogger;
