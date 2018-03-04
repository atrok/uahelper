
var path = require('path');
var config=require('../configuration');

function getDirectory(directory){
    return path.join(config.root_dir, directory);
}

function getAbsolutePath(directory, filename){
    return path.resolve(directory, filename)
}

function buildFilename(filename){

    return getAbsolutePath(getDirectory(config.upload.directory),filename);
}

module.exports={
    getDirectory,
    getAbsolutePath,
    buildFilename
}