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
  res.sendFile(__dirname + '/gomoku.html');
});

io.on('connection', (socket) => {
  console.log('client connected');

  let elems = [];
  var rooms=[];
  var room_people=[];

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

  socket.on('joinRoom',(data) =>{
    var join=false;
    if(rooms.indexOf(data.roomNum)==-1){
      rooms.push(data.roomNum);
      room_people.push(1);
      join=true;
    }
    else{
      var index=rooms.indexOf(data.roomNum);
      if(room_people[index]==1){
        room_people[index]=2;
        join=true;
      }
      else{
        join=false;
      }
    }
    io.emit('assignRoom',{
      join: join,
      room_people: room_people[rooms.indexOf(data.roomNum)],
    });
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});