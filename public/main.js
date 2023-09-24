const socket = io()

// UI element refs
const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('./message-tone.mp3')

// Handle form submit
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    sendMessage()
})

// Handle message input focus
messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing . . .`
    })
})

// Handle message input keypress
messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing . . .`
    })
})

// Handle message input blur event
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
})

// Listening to clients-total event
socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

// Listening to chat-message broadcast event
socket.on('chat-message', (data) => {
    addMessageToUI(false, data)
    messageTone.play()
})

// Listening to feedback broadcast event
socket.on('feedback', ({feedback}) => {
    clearFeedback()

    const elem = `<li class="message-feedback">
        <p class="feedback" id="feedback">
            ${feedback}
        </p>
    </li>`

    messageContainer.innerHTML += elem
})


// send message function
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

// add message to ui function
function addMessageToUI(isOwnMessage, {message, name, dateTime}) {
    clearFeedback()

    const elem = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            ${message}
            <span>${name} ⚪ ${moment(dateTime).fromNow()}</span>
        </p>
    </li>`

    messageContainer.innerHTML += elem

    scrollToBottom()
}

// scroll to bottom function
function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(elem => {
        elem.parentNode.removeChild(elem)
    })
}