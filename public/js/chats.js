const createChatBtn = document.getElementById('add__user')

createChatBtn.addEventListener('click', createChat)

function createChat(e) {
  e.preventDefault()
  swal({
    text: 'Put the name of the chat',
    content: 'input',
    button: {
      text: 'Create it!',
      closeModal: false,
    },
  })
    .then((name) => {
      if (!name) throw null

      return axios({
        method: 'post',
        url: '/chats',
        data: {
          name,
        },
      })
    })
    .then(async ({ data }) => {
      swal({
        title: 'The chat was created:',
        icon: 'success',
      })
    })
    .then(() => location.reload())
    .catch((err) => {
      console.log(err)

      if (err) {
        swal('Oh noes!', 'The AJAX request failed!', 'error')
      } else {
        swal.stopLoading()
        swal.close()
      }
    })
}
