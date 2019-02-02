// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let fs=require('fs');
const unirest = require("unirest");
let holder=document.getElementById("holder")
let nodeConsole = require('console');
let myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var ipc = require('electron').ipcRenderer;
window.onerror = function(error, url, line) {
    ipc.send('errorInWindow', error);
};

myConsole.log("renderer loaded");

holder.ondragenter=holder.ondragover = (event) => {
    event.preventDefault();
};

holder.ondragleave = (event) =>{
    event.preventDefault();
};

holder.ondrop = (event) => {
    event.preventDefault();
    Print(event);
}

const get_file = (event) => {
    return new Promise((resolve, reject) => {
        let file=event.dataTransfer.files[0].path;
        holder.innerText = file;
        resolve(file)
        event.stopPropagation();
    })
}

const add_data = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile('./back/data.json', 'utf8', function readFileCallback(err, data){
            if (err){
                reject(err);
                console.log('err read data');
            } else {
                obj = JSON.parse(data); 
                obj.login_data["path"]=path; 
                json = JSON.stringify(obj);
                fs.writeFile('./back/data.json', json, 'utf8', function(err) {
                    if (err) {
                        reject();
                        throw err;
                    }
                });
                myConsole.log('write data');
            }
        });
    })
}

const get_data = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./back/data.json', 'utf8', function readFileCallback(err, data){
            if (err){
                reject(err);
                myConsole.log('err read data');
            } else {
                myConsole.log('get data');
                resolve(JSON.parse(data));
            }
        });
    })
}

const send_print = (data) => {
    return new Promise((resolve, reject) => {
        try{
            myConsole.log('23434t5y');
            let readPrint = require('./back/print.js');
            myConsole.log('23434t5y');
            readPrint.mainPrint(data);
            resolve();
        }catch(error){
            console.log('fail send print');
            reject();
            throw new Error(error);
        }
    })
}

const get_state = () => {
    return new Promise((resolve, reject) => {
        console.log('lv');
        resolve();
    })
}

const Print = async(event,next) => {
    try {
        let path = await get_file(event);
        await add_data(path);
        let data = await get_data();
        await send_print(data);
        await get_state();
    } catch (error) {
        console.log('fail main print');
        throw new Error(error);
    }
}