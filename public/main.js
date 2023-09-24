const socket = io()

const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

socket.on('chat-message', (data) => {
    addMessageToUI(false, data)
})

function sendMessage() {
    const name = nameInput.value
    const message = messageInput.value
    if(name.trim().length === 0 || message.trim().length === 0){
        return;
    }
    
    const data = {
        name,
        message,
        dateTime: new Date()
    }

    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

function addMessageToUI(isOwnMessage, {message, name, dateTime}) {
    const elem = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            ${message}
            <span>${name} ⚪ ${moment(dateTime).fromNow()}</span>
        </p>
    </li>`

    messageContainer.innerHTML += elem

    scrollToBottom()
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}