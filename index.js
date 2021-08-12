if (typeof require !== 'undefined') XLSX = require('xlsx');

const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});
app.use(express.static('static'))


io.on("connection", (socket) => {

    console.log('connected');

    socket.on('get-json', () => {
        var workbook = XLSX.readFile('em1.xlsx');
        socket.emit('send-json', workbook);
    });

    socket.on('get-file-data', (file) => {
        var workbook = XLSX.readFile(file);
        socket.emit('send-json', workbook);
    });

});

app.get('/', function(req, res) {

    res.sendFile(__dirname + "/client/index.html");
})

// app.listen(3000)
server.listen(3000, () => console.log('3000'));









// var xlsx = require('node-xlsx');

// var obj = xlsx.parse(__dirname + '/class-7.xlsx'); // parses a file




// console.log(obj[0].data);