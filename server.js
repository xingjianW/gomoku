const express = require('express');
const app = express();
const server = require('http').Server(app);
const assert = require('assert');
const io = require('socket.io')(server);
const port = process.env.PORT ||5000;

server.listen(port, () => {
  console.log(`Application running at "http://localhost:${port}/"`);
});

//app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/gomoku.html');
});

var rooms=[];
var room_people=[];
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

  socket.on('joinRoom',(data) =>{
    var join=false;
    var color=null;
    if(rooms.indexOf(data.roomNum)==-1){
      rooms.push(data.roomNum);
      room_people.push(1);
      join=true;
      color="black";
      socket.emit('assignRoom',{
        join: join,
        status: 1,
      });
      socket.emit('assignColor',{
        color: color,
      })
    }
    else{
      var index=rooms.indexOf(data.roomNum);
      if(room_people[index]==1){
        room_people[index]=2;
        join=true;
        color="white";
        io.emit('assignRoom',{
          join: join,
          status: 2,
        });
        socket.emit('assignColor',{
          color: color,
        })
      }
      else{
        join=false;
        socket.emit('assignRoom',{
          join: join,
          status: 3,
        });
      }
    }
  });
  socket.on('win',(data)=>{
    io.emit('win',{
      color: data.color,
    })
  })

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});