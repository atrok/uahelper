
$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', 'Hello World!');
        
        return false;
    });
});