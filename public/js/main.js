;(function () {
  'use strict'
  const ws = io.connect()

  ws.on('connect', (socket) => {
    console.log('***** Front-End Socket Connected *****')
  })

  ws.on('receiveChat', msgs => {
    msgs.forEach(displayChat)
  })

  const form = document.querySelector('form')
  const name = document.querySelector('input[name="name"]')
  const text = document.querySelector('input[name="text"]')
  const ul = document.querySelector('ul')

  form.addEventListener('submit', () => {
    const chat = {
      name: name.value,
      text: text.value
    }

    ws.emit('sendChat', chat)
    displayChat(chat)
    text.value = ''
    event.preventDefault()
  })

  function displayChat (chat) {
    //if (!document.querySelector(`[data-id="${chat._id}"]`)) {
      const li = generateLI(chat)

      ul.appendChild(li)
    //}
  }

  function generateLI (chat) {
    const li = document.createElement('li')
    const textNode = document.createTextNode(`${chat.name}: ${chat.text}`)
    const dataId = document.createAttribute('data-id')

    dataId.value = chat._id

    li.setAttributeNode(dataId)
    li.appendChild(textNode)

    return li
  }

  function getJSON(url, cb) {
    const request = new XMLHttpRequest()

    request.open('GET', url)

    request.onload = () => {
      cb(JSON.parse(request.responseText))
    }

    request.send()
  }

  // document.addEventListener('DOMContentLoaded', () => {
  //   getJSON('/chats', chats => {
  //     chats.forEach(displayChat)
  //   })
  // })

}());
