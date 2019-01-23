// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let fs=require('fs')
let holder=document.getElementById("holder")
let nodeConsole = require('console');
let myConsole = new nodeConsole.Console(process.stdout, process.stderr);
myConsole.log("renderer loaded");
let message = require('./back/data.json');

myConsole.log('message read');
myConsole.log(message["login_data"])

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
        holder.innerText = data;
    });
    event.stopPropagation();
}



//let printer = require('./back/print.js');
