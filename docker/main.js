var dics = decodeURI(require("fs").readFileSync("./dics/dic")).replace(/\r/g, "").split("\n").slice(0, parseInt(process.env.DICLEN) || 1000);
var server = require('http').createServer();
var io = require('socket.io')(server);
var dns = require("dns");
var urls = [];
var sendpos = 0;
var findpos = 0;

if (process.env.DOMAIN) {
    dics.forEach(function (dic, i) {
        dns.lookup([dic, process.env.DOMAIN].join("."), 4, function (err, doc) {
                findpos++;
                if (doc) {
                    urls.push({ip: doc, url: dic});
                }
                if (findpos == dics.length) {
                    setTimeout(function () {
                        process.exit(0);
                    }, 5 * 60 * 1000)
                }
            }
        )
    });
}
else {
    process.exit(0);
}

io.on("connection", function (socket) {
        socket.on("DOMAIN", function (type) {
            type = type || "current";
            var data = [];
            if (type == "current") {
                data = urls.slice(sendpos);
                sendpos = urls.length;
            }
            else data = urls;
            socket.emit("DOMAIN_DATA", {
                urls: data,
                domain: process.env.DOMAIN,
                pos: findpos,
                len: dics.length
            });
        });

        socket.on("CLOSE", function (command) {
            process.exit(0);
        })
    }
);

//Æô¶¯socketserver
server.listen(config.socketport, function () {
    console.log("socket started at port ", config.socketport)
});
