define(["handlebars"], function(Handlebars) { return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"result\"></div>\r\n\r\n<script src=\"/assets/js/socket.io.js \"></script>\r\n<script src=\"https://code.jquery.com/jquery-3.3.1.min.js\"></script>\r\n<script type=\"text/javascript\" src=\"/assets/js/loading-bar.min.js\"></script>\r\n<script>\r\n    var socket = io.connect('http://localhost:5000/prepareadvisory');\r\n\r\n     socket.on('connected', function (data) {\r\n        console.log(data);\r\n        //$(\"#div_result\").empty();\r\n        Object.keys(data).forEach((key) => { $(\"#div_result #result\").append(data[key]); })\r\n    });\r\n    \r\n</script>";
},"useData":true}); });