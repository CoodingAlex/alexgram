const socket = io()

//DOM elements
const sendButton = document.getElementById('send__message__button')
const messageInput = document.getElementById('message__input')
const messageContainer = document.querySelector('.messages-container')
const chat = document.querySelector('.chat')
const usersList = document.querySelector('.users__list')
const userItem = document.querySelectorAll('.user__item')

const addUserIcon = document.querySelector('#add__user')

const chatId = chat.attributes.chatId.value
//DOM events
//Add an user
addUserIcon.addEventListener('click', (e) => {
  e.preventDefault()
  swal({
    text: 'Add a new user',
    content: 'input',
    button: {
      text: 'Add!',
      closeModal: false,
    },
  })
    .then((username) => {
      if (!username) throw null

      return axios({
        method: 'post',
        data: {
          users: [username],
        },
        url: `/chats/${chatId}/add/users`,
      })
    })
    .then(({ data }) => {
      data.usersAdded.forEach((u) => {
        usersList.innerHTML += `   
        <div class="list__item__container" id="${u}">

        <div class="delete__button" href="" user={{this}} onclick="deleteUser('${u}')">
          <img src="/public/assets/images/delete.png" class="delete__icon" alt="">
        </div>         
        <li class="list-group-item disabled" id="${u}" aria-disabled="true">
                ${u}
        </li>
        </div>`
      })

      swal({
        title: 'User(s) added',
        text: 'The user(s) were added',
        icon: 'success',
      })
    })
    .catch((err) => {
      swal({
        icon: 'error',
        title: 'Error',
        text: 'thera was an error adding the user',
      })
    })
})

//delete User
sendButton.addEventListener('click', async (e) => {
  e.preventDefault()
  let message = messageInput.value
  if (!message) {
    return
  }
  socket.emit('new:message', { value: message, chat: chatId })
  const { data, status } = await axios({
    method: 'post',
    url: `/chats/${chatId}`,
    data: {
      value: message,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })
  messageInput.value = ''
})

//sockets events
socket.on('chat:message', (data) => {
  const { value, user, chat } = data
  if (chatId == chat) {
    messageContainer.innerHTML += `

            <div class="message">
              <div class="message-container">
                <strong><p>${user}</strong>: ${value}</p>
              </div>
            </div>`
  }
})

function deleteUser(username) {
  swal({
    title: 'Are you sure?',
    text: `You will delete ${username}!`,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then(async (willDelete) => {
    try {
      if (willDelete) {
        const { data, status } = await axios({
          url: `/chats/${chatId}/delete/users`,
          data: {
            users: [username],
          },
          method: 'delete',
        })
        if (status !== 200) {
          if (data.error === 'A user does not exist') {
            return swal({
              icon: 'error',
              text: 'A user does not exists',
            })
          }
          return swal({
            icon: 'error',
            text: 'there was an error deleting the user',
          })
        }
        let userItem = document.getElementById(username)
        userItem.innerHTML = ''
        swal({
          icon: 'success',
          text: 'your friendwas deleted',
        })
      } else {
        swal(`Your friend is still here!`)
      }
    } catch (err) {}
  })
}
