
const socket = io('http://localhost:8000'); 

const form = document.getElementById('send-container');
const msgInput = document.getElementById('msgInput');
const msgContainer = document.querySelector(".container");
var audio = new Audio('Notifi sound.wav')

const append = (message, position, isCenter = false) => {
    const msgElement = document.createElement('div');  
    msgElement.innerText = message;
    msgElement.classList.add('message');
    msgElement.classList.add(position); 
    if(isCenter) {
        msgElement.classList.add('center'); 
    }
    if(position == 'left') {
        audio.play(); 
    }
    msgContainer.append(msgElement);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

const name = prompt("Enter your Name to join");  
socket.emit('new-user-joined', name);  

const usernameDisplay = document.getElementById('username');
usernameDisplay.innerText = name;

socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'center', true);
});

socket.on('user-left', (name) => {
    append(`${name} left the chat`, 'center', true);
});

socket.on('receive', (data) => {
    append(`${data.user} : ${data.message}`, 'left');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msgInput.value;
    socket.emit('send', message);  
    append(`${message}`, 'right');
    msgInput.value = '';  
});
