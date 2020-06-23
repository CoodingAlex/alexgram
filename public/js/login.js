const loginForm = document.getElementById('login__form')
const passwordValidator = document.querySelector('.password__validation')
const usernameValidator = document.querySelector('.username__validation')

const username = document.querySelector('#username')
const password = document.querySelector('#password')

const signUpButton = document.querySelector('.sign-up__button')
console.log(signUpButton)

let user = {}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (
    validateCamp('username', usernameValidator) === true &&
    validateCamp('password', passwordValidator) === true
  ) {
    try {
      const { status } = await axios({
        method: 'post',
        url: '/login',
        auth: {
          username: user.username,
          password: user.password,
        },
      })

      if (status !== 401) {
        window.location.replace('/chats')
      }
    } catch (err) {
      if (err.message === 'Request failed with status code 401') {
        usernameValidator.classList.toggle('unvalid')
        usernameValidator.innerHTML = 'username or password incorrects'
      }
    }
  }
})

function validateCamp(camp, validator) {
  if (!loginForm.elements[camp].value) {
    validator.classList.toggle('unvalid')
    validator.innerHTML = `please, field the ${camp}`
    return false
  } else {
    validator.innerHTML = ``
    user[camp] = loginForm.elements[camp].value
    return true
  }
}

signUpButton.addEventListener('click', async (e) => {
  if (!password.value || !username.value) {
    console.log('unvalid')
    return
  }
  const { status } = await axios({
    method: 'post',
    data: {
      username: username.value,
      password: password.value,
    },
    url: '/sign-up',
  })
  console.log(status)

  if (status === 201) {
    username.value = ''
    password.value = ''
  }
})
