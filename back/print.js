const unirest = require("unirest");
const cheerio = require("cheerio");
const fs = require("fs");
const config = require('../config');

const get_session = () => {
    return new Promise((resolve, reject) => {
        let req = unirest("POST", "http://print.intl.zju.edu.cn/Service.asmx");
        req.headers({
            "Postman-Token": "ff0cbb72-dbf6-4db6-b8dc-f856c5149218",
            "cache-control": "no-cache",
            "Authorization": "Basic MzE3MDExMTYzMjoxMjA0MjM=",
            "Content-Type": "text/xml"
        });
        req.send("<?xml version=\"1.0\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" soap:encodingStyle=\"http://www.w3.org/2001/12/soap-encoding\">\n    <soap:Header>\n  </soap:Header>\n    <soap:Body>\n        <InitSession xmlns=\"http://tempuri.org/\">\n            <bstrPCName></bstrPCName>\n        </InitSession>\n    </soap:Body>\n</soap:Envelope>");
        req.end(function (res) {
            if (res.error) reject(res.error);
            let $ = cheerio.load(res.body);
            let session = $('InitSessionResult')
                .html()
                .slice(3);
            console.log(session);
            resolve(session);
        });
    })
}

const login = (session, data) => {
    return new Promise((resolve, reject) => {
        let req = unirest("POST", "http://print.intl.zju.edu.cn/Service.asmx");
        req.headers({"Postman-Token": "56b27564-5e75-61c3-3dea-4cfcd0072d87", "Cache-Control": "no-cache", "Content-Type": "text/xml"});
        req.send(`<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ><soap:Body><Login xmlns=\"http://tempuri.org/\"><bstrSessionID>${session}</bstrSessionID><bstrUserName>${data.ZJUid}</bstrUserName><bstrPassword>${data.password}</bstrPassword></Login></soap:Body></soap:Envelope>`);
        req.end((res) => {
            if (res.error) {
                reject(res.error);
            }
            // console.log(res.body);
            resolve();
        });
    })
}

const upload = (session, data, option) => {
    return new Promise((resolve, reject) => {
        unirest
            .post(`http://print.intl.zju.edu.cn/upload.aspx?sid=${session}`)
            .headers({'Content-Type': 'multipart/form-data'})
            .field(option) // Form field
            .attach('file', data.path) // Attachment
            .end(function (response) {
                if (response.error) {
                    reject(response.error);
                }
                //console.log(response.body);
                resolve();
            });
    })
}

const clear = (path) => {
    fs.unlink(path, () => {});
}

const main = async(data,option, next) => {
    try {
        let session = await get_session();
        await login(session, data);
        await upload(session, data, option);
    } catch (error) {
        console.log('fail');
    }
}

module.exports.sendPrint = main;

