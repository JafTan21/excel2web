if (typeof require !== 'undefined') XLSX = require('xlsx');
const upload = require('express-fileupload');

const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});
const fs = require('fs');
app.use(upload());
app.use(express.static('static'))
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
io.on("connection", (socket) => {

    console.log('connected');

    socket.on('get-json', (filename) => {
        var workbook = XLSX.readFile('./uploads/' + filename);
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


app.post("/download", (req, res) => {
    // console.log(req.body['table-content']);
    let filename = (new Date()).getTime();
    fs.readFile('./client/download.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        // console.log(data)

        fs.writeFile(
            "./htmls/" + filename + ".html",
            req.body['table-content'] + data,
            err => {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                console.log('saved', filename);
                res.download("./htmls/" + filename + ".html", "html.html");
            });
    })
});

app.post("/get-uploaded-files", (req, res) => {
    let files = [];
    fs.readdirSync("./uploads").forEach(file => {
        files.push(file);
        // console.log(file);
    });

    res.send({
        filenames: files
    });
});

app.post('/upload', (req, res) => {
    if (req.files) {
        var file = req.files.file
        var filename = file.name

        file.mv('./uploads/' + (new Date).getTime() + "__" + filename, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/");
            }
        })
    }
})

app.get('/upload', function(req, res) {
    res.sendFile(__dirname + "/client/upload.html");
})

app.get("/edit", (req, res) => {
    let filename = req.query.name;
    res.sendFile(__dirname + "/client/edit.html");
});

// app.listen(3000)
server.listen(3000, () => console.log('3000'));









// var xlsx = require('node-xlsx');

// var obj = xlsx.parse(__dirname + '/class-7.xlsx'); // parses a file




// console.log(obj[0].data);