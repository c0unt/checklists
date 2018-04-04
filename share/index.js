
/**
 * отправляет сообщение об ошибке API
 * @param {object} res express response.
 * @param {string} code текстовы код ошибки.
 * @param {string} desc описание ошибки.
 */
let sendErrorObj = (res, code, desc) => {
    let answer = {};
    answer.error = {};
    //
    if (code) answer.error.code = code.toUpperCase();
    if (desc) answer.error.desc = desc;
    if (desc && desc.message) answer.error.desc = desc.message;
    //
    answer.data = null;
    return res.send(answer);
};

module.exports.sendErrorObj = sendErrorObj;