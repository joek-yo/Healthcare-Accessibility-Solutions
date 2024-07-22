const ROOM_ID = window.location.pathname.split('/')[2];
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

let myVideoStream;

document.getElementById('startButton').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream);
        });
    });
    document.getElementById('startButton').disabled = true;
    document.getElementById('endButton').disabled = false;
});

document.getElementById('endButton').addEventListener('click', () => {
    myVideoStream.getTracks().forEach(track => track.stop());
    socket.disconnect();
    document.getElementById('startButton').disabled = false;
    document.getElementById('endButton').disabled = true;
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
});

const peers = {};

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '5000'
});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message) {
        socket.emit('message', message);
        addMessage(`You: ${message}`);
        chatInput.value = '';
    }
});

socket.on('createMessage', message => {
    addMessage(message);
});

function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.append(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
