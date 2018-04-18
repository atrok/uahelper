define(["handlebars"], function(Handlebars) { return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<script src=\"/assets/js/socket.io.js \"></script>\n<script src=\"https://code.jquery.com/jquery-3.3.1.min.js\"></script>\n<script type=\"text/javascript\" src=\"/assets/js/loading-bar.min.js\"></script>\n<script src=\"/assets/js/docxtemplater-latest.min.js\"></script>\n<script src=\"/assets/js/jszip.min.js\"></script>\n<script src=\"/assets/js/file-saver.min.js\"></script>\n<script src=\"/assets/js/jszip-utils.js\"></script>\n<script src=\"/assets/js/LineReader.js\"></script>\n<!--\n    Mandatory in IE 6, 7, 8 and 9.\n    -->\n<!--[if IE]>\n        <script type=\"text/javascript\" src=\"examples/vendor/jszip-utils-ie.js\"></script>\n    <![endif]-->\n<script>\n\n\n\n    // function to hide and show progress bar and other elements\n    (function ($) {\n        $.fn.invisible = function () {\n            return this.css(\"visibility\", \"hidden\");\n        };\n        $.fn.visible = function () {\n            return this.css(\"visibility\", \"visible\");\n        };\n    })(jQuery);\n\n\n\n\n    var obj = [];\n    var components={\n        file:{\n            name:'',\n            size:0, \n            mimeType:''\n        },\n        components:[]\n    };\n\n    var socket = io.connect('/prepareadvisory');\n\n    var bar1 = new ldBar(\"#myItem1\");\n    //var bar2 = document.getElementById('myItem1').ldBar;\n\n    var id;\n    socket.on('connected', function (data) {\n        console.log(data);\n        id = data.id;\n        socket.emit('tasks', {});\n        socket.emit('get_solutions', {});\n    });\n\n    socket.on('solutions', function (data) { //populate solutions dropdown list\n\n        if (data) {\n            console.log(data);\n            Object.keys(data).forEach((key) => {\n                $(\"#solution\").append(\"<option size=25 value='\" + data[key].key + \"'>\" + data[key].key + \"</option>\");\n            });\n        }\n        // attaching event listeners to process generate document requests;\n\n        $(document).ready(function () {\n            solutions = document.getElementById(\"solution\");\n            document.getElementById(\"solution\").addEventListener(\"change\", function () {\n\n                solutions.options[solutions.options.selectedIndex].selected = true;\n                socket.emit('get_components', $(\"#solution option:selected\").attr(\"value\"));\n\n                return false;\n\n            });\n        });\n    })\n\n    socket.on('components', function (data) {\n        console.log(data);\n        if (data) {\n            removeOptions(document.getElementById(\"apptype\"))\n            Object.keys(data).forEach((key) => {\n                $(\"#apptype\").append(\"<option size=25 value='\" + data[key].key[1] + \"'>\" + data[key].key[1] + \"</option>\");\n            });\n\n            // since we add options dynamically we need to set selected flag on change event\n            $(document).ready(function () {\n                applications = document.getElementById(\"apptype\");\n                document.getElementById(\"apptype\").addEventListener(\"change\", function () {\n\n                    applications.options[applications.options.selectedIndex].selected = true;\n                    return false;\n\n                });\n            });\n        }\n    })\n\n    socket.on('progress', function (data) {\n        console.log(data.percents);\n        bar1.set(data.percents);\n    })\n\n    socket.on('result', function (data) {\n        console.log(data);\n        $(\"#generate\").visible();\n        $(\"#div_result #resultsTable\").empty();\n\n        // remove all hidden inputs\n        var fields = $(\"#form_generate :input\").serializeArray();\n        $.each(fields, function (i, field) {\n            $(\"input[name='\" + field.value + \"']\").remove();\n        });\n\n        // clearing the cache\n        obj = [];\n\n        // saving object for postprocesing in cache\n        if (data.parsed_obj) {\n            obj[data._id] = data.parsed_obj;\n            $(\"#generate\").append(\"<input type='hidden' name='\" + data._id + \"' value='\" + data._id + \"' />\");\n        }\n\n        Object.keys(data).forEach((key) => {\n            if (key === 'file' || key === 'error' || key == 'table') // \n                $(\"#div_result #result\").append(data[key]);\n        })\n\n\n\n        $('.tableresultheader').click(function () {\n            $header = $(this);\n            $content = $header.next();\n            $content.slideToggle(500, function () {\n                $header.text(function () {\n                    return $content.is(':visible') ? 'Collapse' : 'Expand';\n                });\n            });\n        });\n\n        // attaching event listeners to process generate document requests;\n\n        $(document).ready(function () {\n            document.getElementById(\"docx\").addEventListener(\"click\", function () {\n\n                var values = {};\n                var fields = $(\"#form_generate :input\").serializeArray();\n                $.each(fields, function (i, field) {\n                    values = obj[field.value];\n                });\n\n                var generator = new Generator();\n\n                generator.generateDocx(\"/assets/js/input.docx\", values);\n\n                return false;\n\n            });\n        });\n\n\n    })\n\n    socket.on('console', function (data) {\n        console.log(data);\n        //$(\"#div_result\").empty();\n        Object.keys(data).forEach((key) => { $(\"#div_result #console\").append(data[key]); })\n\n\n    })\n\n    socket.on('errors', function (data) {\n        console.log(data);\n        //$(\"#div_result\").empty();\n        lotsoferrors(data);\n\n\n    })\n\n    socket.on('done', function (data) {\n        done();\n    })\n\n    socket.on('validation', function (data) {\n        console.log(data);\n        $(':submit').attr('disabled', 'disabled');\n        if (data.submitted) {\n            $(\"#div_result #console\").append(data.reason);\n        } else {\n            lotsoferrors(data.reason)\n            done();\n        }\n    })\n\n    socket.on('tasks', function (data) {\n        console.log('Got list of tasks');\n        if (data instanceof Array) {\n            data.forEach((item) => {\n                $('#tasks').append(\n                    '<tr id=\"' + item.id + '\">'\n                    + '<td><input type=\"checkbox\" id=\"' + item.id + '\" /></td>'\n                    + '<td>' + item.time.toString() + '</td>'\n                    + '<td>' + item.input.toString() + '</td>'\n                    + '<td>' + item.link.toString() + '</td>'\n                    + '</tr>'\n                )\n            })\n            $(document).ready(function () {\n                $(\".getresult\").click(function () {\n                    var id = this.id;\n                    submitData('getresults', { 'id': id })\n                });\n            });\n        }\n    })\n\n    socket.on('deleted', function (data) {\n        console.log('Record deleted: ', data.id);\n        $('tr#' + data.id).remove();\n    })\n\n    $(\"#form_dbs\").submit(function () {\n        try {\n            var args = {};\n            var errors = []\n            args.dbtype = $(\"select option:selected\").attr(\"value\");\n\n            args.host = (checkField($(\"#host\").val(), 100)) ? $(\"#host\").val() : errors.push('Host can\\'t be longer than 100');\n            args.dbname = (checkField($(\"#dbname\").val(), 100)) ? $(\"#dbname\").val() : errors.push('DB name can\\t be longer than 100');\n            args.user = (checkField($(\"#user\").val(), 100)) ? $(\"#user\").val() : errors.push('User can\\'t be longer than 100');\n            args.pass = (checkField($(\"#pass\").val(), 25)) ? $(\"#pass\").val() : errors.push('Password can\\'t be longer than 25');\n            args.genfile = $('#genfile_d').is(':checked') ? true : false;\n\n            var res = {};\n            res.form = 'form_dbs';\n            res.args = args;\n            if (!lotsoferrors(errors))\n                submitData('my other event', res);\n\n\n            //alert(args);;\n\n        } catch (e) {\n            console.log(e.stack);\n        } finally {\n            return false; // to avoid page reload\n        } // to avoid page reload\n\n    })\n    $(\"#form_comp\").submit(function () {\n        try {\n            var args = {};\n            var errors = []\n            args.apptype = $(\"#apptype option:selected\").attr(\"value\");\n            args.ostype = $(\"#ostype option:selected\").attr(\"value\");\n            args.genfile = $('#genfile_a').is(':checked') ? true : false;\n\n            args.release = (checkField($(\"#release\").val(), 10)) ? $(\"#release\").val() : errors.push('Release can\\'t be longer than 10');\n            var res = {}\n            res.form = 'form_comp';\n            res.args = args;\n            if (!lotsoferrors(errors)) {\n                submitData('search', res);\n\n            }\n\n        } catch (e) {\n            console.log(e.stack);\n        } finally {\n            return false; // to avoid page reload\n        } // to avoid page reload\n\n    })\n\n    $(\"#form_tasks\").submit(function () {\n        try {\n            var args = {};\n            var errors = []\n            args = checkedValues(\"#form_tasks input:checkbox:checked\");\n\n\n\n            submitData('deleteresults', args);\n            //alert(args);;\n\n        } catch (e) {\n            console.log(e.stack);\n        } finally {\n            return false; // to avoid page reload\n        } // to avoid page reload\n\n    })\n\n    $(\"#form_csv\").submit(function(){\n        try{\n            var errors = [];\n            var res={};\n            var genfile = $('#genfile_c').is(':checked') ? true : false;\n\n            if(components.length==0){\n                errors.push('components list is empty');\n            }\n\n            if(!lotsoferrors(errors)){\n                res.form=\"form_csv\";\n                res.args=components.file;\n                res.components=components.components;\n                res.genfile=genfile;\n\n                submitData('components', res);\n            }\n        }catch(e){\n            console.log(e.stack);\n        }finally{\n            return false;\n        }\n    })\n\n    $(\"#form_admin\").submit(function () {\n        try {\n            var args = {};\n            args.databases = $(\"#databases option:selected\").attr(\"value\");\n\n            submitData('recreate_view', args);\n            //alert(args);;\n\n        } catch (e) {\n            console.log(e.stack);\n        } finally {\n            return false; // to avoid page reload\n        } // to avoid page reload\n\n    })\n\n    $(\"#form_generate\").submit(function () {\n        try {\n\n        } catch (e) {\n            console.log(e.stack);\n        } finally {\n            return false; // to avoid page reload\n        } // to avoid page reload\n    })\n\n    function done() {\n        $(':submit').removeAttr('disabled');\n        $('div #myItem1').invisible();\n    }\n\n    function submitData(channel, data) {\n        socket.emit(channel, data);\n        $('div #myItem1').visible();\n    }\n\n    var checkField = function (text, condition) {\n        return (text.length > condition) ? false : true;\n    }\n\n    var lotsoferrors = function (errors) {\n        var err;\n        if (errors instanceof Array) {\n            err = errors;\n        } else {// object kv pairs\n            err = [];\n            Object.keys(errors).forEach((k) => {\n\n                err.push('<span class=\"error\">' + k + ':</span> ' + errors[k]);\n            })\n\n        }\n        if (err.length > 0) {\n            $(\"#form_errors\").empty();\n\n            $(\"#form_errors\").append('<div id=\"errors\"><h3>Error!</h3><span onclick=\"this.parentElement.style.display=\\'none\\'\"  class=\"w3-button w3-display-topright\">X</span></div>');\n            var s;\n            err.forEach((val) => { $(\"#errors\").append(val + '<br/>') });\n            return true;\n\n        } else {\n            $(\"#errors\").remove();\n            return false;\n        }\n    }\n\n    var checkedValues = function (name) {\n        return $(name).map(function () {\n            return this.id;\n        }).get();\n    }\n\n    function openTab(evt, tabName) {\n        var i;\n        var x = document.getElementsByClassName(\"tab\");\n        for (i = 0; i < x.length; i++) {\n            x[i].style.display = \"none\";\n        }\n\n        tablinks = document.getElementsByClassName(\"tablink\");\n        for (i = 0; i < x.length; i++) {\n            tablinks[i].className = tablinks[i].className.replace(\" w3-red\", \"\");\n        }\n        document.getElementById(tabName).style.display = \"block\";\n        evt.currentTarget.className += \" w3-red\";\n    }\n\n    /* Generate DOCX from template */\n\n    var Generator = function () { };\n\n    Generator.prototype.generateDocx = function (url, obj) {\n        this.loadFile(url, obj, this.createDocx)\n    }\n\n    Generator.prototype.loadFile = function (url, obj, callback) {\n\n        var self = this;\n\n\n        self._obj = obj;\n        self.url = url;\n\n        JSZipUtils.getBinaryContent(url, function (error, content) {\n            if (error) { throw error };\n            var zip = new JSZip(content);\n            var doc = new Docxtemplater().loadZip(zip)\n            doc.setData(self._obj);\n\n            try {\n                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)\n                doc.render()\n            }\n            catch (error) {\n                var e = {\n                    message: error.message,\n                    name: error.name,\n                    stack: error.stack,\n                    properties: error.properties,\n                }\n                console.log(JSON.stringify({ error: e }));\n                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).\n                throw error;\n            }\n\n            var out = doc.getZip().generate({\n                type: \"blob\",\n                mimeType: \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",\n            }) //Output the document using Data-URI\n            saveAs(out, \"output.docx\")\n        });\n    }\n\n\n    Generator.prototype.createDocx = function (error, content) {\n        if (error) { throw error };\n        var zip = new JSZip(content);\n        var doc = new Docxtemplater().loadZip(zip)\n        doc.setData(this._obj);\n\n        try {\n            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)\n            doc.render()\n        }\n        catch (error) {\n            var e = {\n                message: error.message,\n                name: error.name,\n                stack: error.stack,\n                properties: error.properties,\n            }\n            console.log(JSON.stringify({ error: e }));\n            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).\n            throw error;\n        }\n\n        var out = doc.getZip().generate({\n            type: \"blob\",\n            mimeType: \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",\n        }) //Output the document using Data-URI\n        saveAs(out, \"output.docx\")\n    }\n\n    function removeOptions(selectbox) {\n        var i;\n        for (i = selectbox.options.length - 1; i >= 0; i--) {\n            selectbox.remove(i);\n        }\n    }\n\n    function handleFiles(event) {\n        var file = event.target.files[0];\n        components.file.name=file.name;\n        components.file.size=file.size;\n        components.file.mimeType=file.mimeType;\n\n        var reader = new LineReader();\n\n        var hasHeader= $('#hasHeader').is(':checked') ? true : false;\n        var header=[];\n\n\n        reader.on('line', function (line, next) {\n            // Do something with line....\n\n            if(hasHeader&&header.length==0){\n                header=line.split(',');\n            }else{\n\n            var array = line.split(',');\n            var obj={};\n            for(var i=0;i<array.length;i++){\n                obj[header[i]]=\"\"+array[i]+\"\";\n            }\n            components.components.push(obj);\n\n            }\n\n       \n            next(); // Call next to resume...\n        });\n\n        reader.on('end',function(evt){\n            console.log(components);\n        })\n\n        reader.read(file);\n    }\n\n</script>";
},"useData":true}); });