const http = require("http");

let SHARED;

http
  .createServer(function (req, res) {
    res.write("Hello World 111 ! " + process.env.NODE_APP_INSTANCE);
    res.end();
  })
  .listen(8080);

setInterval(() => {
  console.log(`ID: ${process.env.NODE_APP_INSTANCE} / SHARED: ${SHARED}`);
}, 1000);

process.on("message", function (packet) {
  if (packet.type === "lite:cpu-check") {
    SHARED = packet.data;
  }
});
