const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const port = 8000;
const ip = "127.0.0.1";

const sendHTML = (filename, statusCode, response) => {
    fs.readFile(`./html/${filename}`, (error, data) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Sorry, internal error");
        } else {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/html");
            response.end(data);
        }
    });
};

const sendCSS = (filename, statusCode, response) => {
    fs.readFile(`./${filename}`, (error, data) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Sorry, internal error");
        } else {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/css");
            response.end(data);
        }
    });
};

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
        if (request.url === "/") {
            sendHTML(`index.html`, 200, response);
        } else if (request.url === "/about.html") {
            sendHTML(`about.html`, 200, response);
        } else if (request.url === "/login.html") {
            sendHTML(`login.html`, 200, response);
        } else if (request.url === "/login-success.html") {
            sendHTML(`login-success.html`, 200, response);
        } else if (request.url === "/login-fail.html") {
            sendHTML(`login-fail.html`, 200, response);
        } else if (request.url === "/style.css") {
            sendCSS('style.css', 200, response);
        } else {
            sendResponse(`404.html`, 404, response);
        }
        // if = get method, so else = post method
    } else {
        if (request.url === "/process-login") {
            let body = [];

            request.on("data", (chunk) => {
                body.push(chunk);
            });

            request.on("end", () => {
                // combine chunk into whole 
                body = Buffer.concat(body).toString();
                body = qs.parse(body);
                console.log(body)

                // usually we need database for below
                if (body.username === "francis" && body.password === "francis123") {
                    response.statusCode = 301;
                    response.setHeader("Location", "/login-success.html");
                } else {
                    response.statusCode = 301;
                    response.setHeader("Location", "/login-fail.html");
                }
                response.end();
            });
        }
    }
});

server.listen(port, ip, () => {
    console.log(`Server is running at http://${ip}:${port}`);
});