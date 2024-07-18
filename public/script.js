const socket = io();

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('message').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('message').value.trim();

    if (username === '' || message === '') {
        alert('Por favor, introduce tu nombre y un mensaje.');
        return;
    }

    const fullMessage = `${username}: ${message}`;
    socket.emit('chat message', fullMessage);

    // Deshabilitar el campo de nombre después de enviar el primer mensaje
    document.getElementById('username').disabled = true; 
    document.getElementById('username').style.backgroundColor = '#e9ecef'; 

    // Limpiar el campo de mensaje
    document.getElementById('message').value = '';
}

socket.on('chat message', function(msg) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = msg;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Desplazar hacia abajo para ver el último mensaje
});

socket.on('user update', function(users) {
    const userList = document.getElementById('users');
    userList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        userList.appendChild(userElement);
    });
});

window.onload = function() {
    document.getElementById('username').focus();
};
