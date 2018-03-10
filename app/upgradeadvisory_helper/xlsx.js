var XlsxTemplate = require('xlsx-template');
var fs = require('fs');
var path = require('path');
var {getAbsolutePath, getDirectory}=require('./utils/file_util');
var config=require('./configuration');

var createXlsx=function(values){
    // Load an XLSX file into memory
    return new Promise((resolve, reject)=>{
    var data=fs.readFileSync(path.join(__dirname, 'templates', 'template1.xlsx'),'binary');
    
    

        // Create a template
        var template = new XlsxTemplate(data);

        // Replacements take place on first sheet
        var sheetNumber = 1;


        // Perform substitution
        template.substitute(sheetNumber, values);

        // Get binary data
        var data = template.generate();
    
        var filename = generateFilename('output', 'docx');
        console.log(filename);

        fs.writeFileSync(getAbsolutePath(getDirectory(directory), filename), buf);

        var result=prepareResult(directory, filename);
        
        resolve(result);

})
}