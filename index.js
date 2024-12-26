const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        if (req.url === "/") {
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                    return;
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(data);
            });
        } else if (req.url === "/allstudent") {
            fs.readFile("allstudent.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                    return;
                }
                res.end(data);
            });
        } else if (req.url === "/register") {
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                    return;
                }
                res.end(data);
            });
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    } else if (req.method === "POST") {
        if (req.url === "/register") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {
                let userData = {};
                body.split('&').forEach(pair => {
                    let [key, value] = pair.split('=');
                    userData[key] = decodeURIComponent(value);
                });

                let users = [];
                try {
                    const fileData = fs.readFileSync("User.json", "utf-8");
                    if (fileData) {
                        users = JSON.parse(fileData);
                    }
                } catch (err) {
                    console.error(err);
                }

                users.push(userData);
                fs.writeFileSync("User.json", JSON.stringify(users));
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Registration successful!");
            });
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    }
});

server.listen(3000, () => console.log("Server running on port 3000"));