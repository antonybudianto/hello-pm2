var http = require("http");

http
  .createServer(function (req, res) {
    console.log("Child ID", typeof process.env.NODE_APP_INSTANCE);
    res.write("Hello World 111 ! " + process.env.ABC);
    res.end(); //end the response
  })
  .listen(8080);
