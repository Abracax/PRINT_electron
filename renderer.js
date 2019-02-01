// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let fs=require('fs');
const unirest = require("unirest");
let holder=document.getElementById("holder")
let nodeConsole = require('console');
let myConsole = new nodeConsole.Console(process.stdout, process.stderr);

myConsole.log("renderer loaded");

holder.ondragenter=holder.ondragover=function(event){
    event.preventDefault();
    holder.className("holder-ondrag");
};

holder.ondragleave=function(event){
    event.preventDefault();
    holder.className(" ");
    holder.innerText="Please drag your file to print.";
};

holder.ondrop=function(event){
    event.preventDefault();
    var file=event.dataTransfer.files[0];
    fs.readFile(file.path,"utf8",function(err,data){
        myConsole.log(file.path);
        holder.innerText = file.path;
        fs.readFile('./back/data.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                myConsole.log('file read');
                obj = JSON.parse(data); 
                obj.login_data.push({"path":`${file.path}`}); 
                json = JSON.stringify(obj);
                fs.writeFile('./back/data.json', json, 'utf8', function(err) {
                    if (err) throw err;
                });
            }
    });
    });
    message = require('./back/data.json');
    printFunc = require('./back/print.js');
    console.log('module read in');
    main(message);
    event.stopPropagation();
}

const main = async(data,next) => {
    try {
        let session = await printFunc.get_session();
        await printFunc.login(session, data);
        await printFunc.upload(session, data);
    } catch (error) {
        console.log('fail');
    }
}
