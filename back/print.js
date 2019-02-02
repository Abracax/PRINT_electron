const cheerio = require("cheerio");
const unirest = require("unirest");
const fs = require("fs");

/*const get_data = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data.json', 'utf8', function readFileCallback(err, dta){
            if (err){
                console.log(err);
            } else {
                console.log('read file');
                let data = JSON.parse(dta);
                resolve(data);
        }});
    })
}*/
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
        var req = unirest("POST", "http://print.intl.zju.edu.cn/Service.asmx");

        req.headers({
            "Postman-Token": "e522271c-f8fa-460d-a7fe-3d39a1e2361c",
            "cache-control": "no-cache",
            "Content-Type": "text/xml"
        });
        
        req.send(`<?xml version=\"1.0\"?>\n<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\">\n\t<soap:Header>\n  </soap:Header>\n    <soap:Body>\n        <Login xmlns=\"http://tempuri.org/\">\n            <bstrSessionID>${session}</bstrSessionID>\n            <bstrUserName>${data.login_data.ZJUid}</bstrUserName>\n            <bstrPassword>${data.login_data.password}</bstrPassword>\n        </Login>\n    </soap:Body>\n</soap:Envelope>`);
        
        req.end(function (res) {
            if (res.error) {
                reject(res.error);
                throw new Error(res.error); 
            }
            //console.log(res.body);   
            resolve();
        });
    });
}


const upload = (session, data, option) => {
    return new Promise((resolve, reject) => {
        try {
        req = unirest.post(`http://print.intl.zju.edu.cn/upload.aspx?sid=${session}`);
        req.headers({
            "Postman-Token": "32728afe-16ae-4bdf-a168-ed2cd89a2e16",
            "cache-control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
        });
        for (let key in option) {
            req.field(key, option[key])
        }
        req.attach('file',data.path);
        req.end(function (response) {
            if (response.error) {
                console.log('fail upload');
                reject(response.error);
                throw new Error(response.error);
            }
            //console.log(response.body);
            resolve();
        })
    } catch (error) {
        console.log('fail up');
        throw error;
    }
    })
}

const main = async(data,next) => {
    try {
        let session = await get_session();
        await login(session, data);
        await upload(session, data.login_data, data.print_option);
        console.log('233');
    } catch (error) {
        console.log('fail main');
        throw error;
    }
}

module.exports.mainPrint = main;


