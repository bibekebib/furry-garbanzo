/*
key components
activeitem = null until and edit button is clicked. will contain object of item we are editing
"list_snapshot" = will contain parevious state of list, used for removing extra rows on list update

PROCESS
1. fetch data and buld rows "buildlist()"
2. create item on form submit
3. edit item click -profill form and change submit url
4. delete item -send id to delete url
5. cross our completed task -vent handle updated item

NOTES
--add event handlers to edit, delete, title, 
-- render with strike through items completed
-- remove extra data on re-render
--csrf token

*/

buildList()

function getCookie(name) {
  var cookieValue = null
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) == name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}
var csrftoken = getCookie('csrftoken')

var activeItem = null

var list_snapshot = []
function buildList() {
  var wrapper = document.querySelector('.list-wrapper')
  // wrapper.innerHTML = ''

  var url = 'http://127.0.0.1:8000/api/task-list/'

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      console.log('data:', data)

      var list = data
      for (var i in list) {
        try {
          document.getElementById(`data-row-${i}`).remove()
        } catch (err) {}
        var title = `<span class="title">${list[i].title}</span>`
        if (list[i].completed == true) {
          title = `<strike class="title">${list[i].title}</strike>`
        }
        var item = `
          <div class="items" id="data-row-${i}">
            <div style="flex: 7;">
              ${title}
            </div>
            <div style="flex: 1;">
              <button class="button edit">Edit</button>
            </div>
            <div style="flex: 1;">
              <button class="button delete">
                delete
              </button>
            </div>
          </div>
          `
        wrapper.innerHTML += item
      }
      if (list_snapshot.length > list.length) {
        for (var i = list.length; i < list_snapshot.length; i++) {
          document.getElementById(`data-row-${i}`).remove()
        }
      }
      list_snapshot = list
      for (var i in list) {
        var editBtn = document.querySelectorAll('.edit')[i]
        var deleteBtn = document.querySelectorAll('.delete')[i]
        var strikeBtn = document.querySelectorAll('.title')[i]
        editBtn.addEventListener(
          'click',
          (function (item) {
            return function () {
              editItem(item)
            }
          })(list[i]),
        )
        deleteBtn.addEventListener(
          'click',
          (function (item) {
            return function () {
              deleteItem(item)
            }
          })(list[i]),
        )
        strikeBtn.addEventListener(
          'click',
          (function (item) {
            return function () {
              strikeUnstrike(item)
            }
          })(list[i]),
        )
      }
    })
}

var form = document.querySelector('.form-wrapper')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('form sumbitted')
  var url = 'http://127.0.0.1:8000/api/task-create/'

  if (activeItem != null) {
    var url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
    activeItem = null
  }

  var title = document.querySelector('#titles').value
  console.log(title)
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({ title: title }),
  }).then(function (response) {
    buildList()
    document.querySelector('.form').reset()
  })
})

function editItem(item) {
  console.log('item clicked', item)
  activeItem = item
  document.getElementById('titles').value = activeItem.title
}

function deleteItem(item) {
  console.log('item clicked delete', item)
  var url = `http://127.0.0.1:8000/api/task-delete/${item.id}/`
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
  }).then((response) => {
    buildList()
  })
}

function strikeUnstrike(item) {
  console.log('strike ', item)
  item.completed = !item.completed
  var url = `http://127.0.0.1:8000/api/task-update/${item.id}/`
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      title: item.title,
      completed: item.completed,
    }),
  }).then((response) => {
    buildList()
  })
}
