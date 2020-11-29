const express = require('express');
const app = express();
const server = require('http').Server(app);
const assert = require('assert');
const io = require('socket.io')(server);
const port = 5000;

server.listen(port, () => {
  console.log(`Application running at "http://localhost:${port}/"`);
});

//app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/mi_test.html');
});

io.on('connection', (socket) => {
  console.log('client connected');

  let elems = [];

  // elems.forEach((item) => {
  //   io.emit('clk', item);
  // });

  socket.on('clk', (data) => {
    console.log(data);

    assert(data.pi !== undefined);
    assert(data.pj !== undefined);
    assert(data.color !== undefined);

    elems[data.pi*100+data.pj] = data;

    io.emit('clk', data);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});