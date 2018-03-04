var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');
var {getAbsolutePath, getDirectory}=require('./utils/file_util');
var config=require('./configuration');

var directory=config.upload.directory;



createDocx = function (res) {
    return new Promise((resolve, reject) => {

        //Load the docx file as a binary
        var content = fs
            .readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

        var zip = new JSZip(content);
        var doc = new Docxtemplater();
        doc.loadZip(zip);
        //set the templateVariables
        doc.setData(res);

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({ error: e }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            reject(error);
        }

        var buf = doc.getZip()
            .generate({ type: 'nodebuffer' });

        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        var filename = generateFilename('output', 'docx');
        console.log(filename);

        fs.writeFileSync(getAbsolutePath(getDirectory(directory), filename), buf);

        var result=prepareResult(directory, filename);
        
        resolve(result);

    });
}

function generateFilename(prefix, ext) {
    var timeInMs = Date.now();
    return prefix + '_' + timeInMs + '.' + ext;
}

function prepareResult(directory,filename) {
    var result={}
    result.path=getDirectory(directory);
    const stats = fs.statSync(getAbsolutePath(result.path,filename));
    result['File size, Kb'] = stats.size/1024
    result['Creation TIme']=stats.birthtime
    result.filename=filename;
    
    return result;
}

/*
function getDirectory(directory){
    return path.join(__dirname, directory);
}

function getAbsolutePath(directory, filename){
    return path.resolve(directory, filename)
}
*/
exports.createDocx = createDocx;