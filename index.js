#!/usr/bin/env node

const fs = require("fs");

let arguments = process.argv.slice(2);

let flags = [];
let filenames = [];
let secondaryArguments = [];

for(let i of arguments){
    if(i[0] == "-"){
        flags.push(i);
    }
    else if(i[0] == "$"){
        secondaryArguments.push(i.slice(1));
    }
    else{
        filenames.push(i);
    }
}


for(let file of filenames){
    let fileData = fs.readFileSync(file,"utf-8");
    for(flag of flags){
        if(flag == "-rs"){ // remove spaces
            fileData = removeAll(fileData," ");
        }
        if(flag== "-rn"){ // remove new lines
            fileData = removeAll(fileData, "\r\n"); // \r\n represents new line
        }
        if(flag == "-rsc"){
            // to remove a particular special character
            for(let secondaryArgument of secondaryArguments){
                fileData = removeAll(fileData, secondaryArgument);
            }
        }
        if(flag == "-s"){
            // to add numbering to all lines
            fileData = addSequence(fileData);
            fileData = fileData.join("\r\n");           
        }
        if(flag == "-sn"){
            // to add numbering to only those lines which are having some content ie. to non empty lines
            fileData = addSequenceToNonEmptyLines(fileData);
            fileData = fileData.join("\r\n");
        }
        if(flag == "-rel"){
            // to remove extra empty lines --> 
            // In this after every line, 1 empty line is allowed but more than one empty line is not allowed
            fileData = removeEmptyLines(fileData);
            fileData = fileData.join("\r\n");
        }

    }
    console.log(fileData);
}

function removeAll(string, removalData){
    return string.split(removalData).join("");
}

function addSequence(content){
    let contentArr = content.split("\r\n");
    for(let i=0; i<contentArr.length; i++){
        contentArr[i] = (i+1) + " " + contentArr[i];
    }
    return contentArr;
}

function addSequenceToNonEmptyLines(content){
    let contentArr = content.split("\r\n");
    let count=1;

    for(let i=0; i<contentArr.length; i++){
        if(contentArr[i]!=""){
            contentArr[i] = count + " " +contentArr[i];
            count++;
        }
    }
    return contentArr;
}

function removeEmptyLines(content){
    let contentArr = content.split("\r\n");
    let data=[];

    for(let i=0; i<contentArr.length; i++){
        if(contentArr[i]=="" && contentArr[i-1]==""){
            contentArr[i] = null;
        }
        if(contentArr[i]=="" && contentArr[i-1]==null){
            contentArr[i] = null;
        }
    }

    for(let i=0; i<contentArr.length; i++){
        if(contentArr[i]!=null){
            data.push(contentArr[i]);
        }
    }
    return data;
}