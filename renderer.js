// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let fs=require('fs')
let holder=document.getElementById("holder")

holder.ondragenter=holder.ondragover=function(event){
    event.preventDefault();
    holder.className("holder-ondrag");
};

holder.ondragleave=function(event){
    event.preventDefault();
    holder.className(" ");
    holder.innerText="Please Drag sth. in here";
};

holder.ondrop=function(event){
    event.preventDefault();
    var file=event.dataTransfer.files[0];
    fs.readFile(file.path,"utf8",function(err,data){
        console.log(data);
        holder.innerText=data;
    });
}
