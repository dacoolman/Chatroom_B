var users = {};
var comments = [];
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/static"));
// This sets the location where express will look for the ejs views
app.set('views', __dirname + '/views');
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');
app.get("/", function (request, response){
    // hard-coded user data
    response.render('index');
})
var server = app.listen(8000, function(){
	console.log('listening on port 8000')
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  socket.on('enter_user', function(data){
  users[data.name] = socket.id
  socket.emit('update_user', {comments: comments} );
  });
//Possible implmentation of disconnect:
// socket.on('disconnect', function(){
//        console.log(users);
//        for (value in users)
//        {
//         console.log(users[value]);
//         console.log(socket.id);
//         if (users[value] == socket.id)
//         { 
//          delete users[value];
//         break;}
//        }
//        console.log(users);
//         io.emit('update_user', users);
//     });

socket.on('add_message', function(data){
    //get name
    console.log('hi', users);
  temp = {}
  for (value in users)
  {
    console.log('hey', users[value], socket.id);
    if (users[value] == socket.id)
      {temp[value] = data.message;
      comments.push(temp);
    break;}
  }
  io.emit('update_messages', {comments: comments});
})
})


