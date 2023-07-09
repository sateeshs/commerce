module.exports = {
    beforeRequest: beforeRequest,
    logStatus: logStatus
}

const fs = require('fs');
const path = require('path');

function logStatus(requestParams, response, context, ee, next) {
    console.log(`log`);

    fs.appendFile(path.join(__dirname, "/logs/artillery-logs.json"), `${response.request?.url?.path}: ${response.statusCode}`, function (err) {
        if (err) {

        } else [

        ]
    });

    fs.appendFile(path.join(__dirname, "/logs/artillery-logs.json"), `${response.body}`, function (err) {
        if (err) {

        } else [

        ]
    });

    return next();
}