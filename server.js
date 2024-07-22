const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs',
});

app.use('/peerjs', peerServer);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Routes
app.get('/consultation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'consultation.html'));
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
      console.log('Client disconnected:', socket.id);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
