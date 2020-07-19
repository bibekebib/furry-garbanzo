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

function buildList() {
  var wrapper = document.querySelector('.list-wrapper')
  wrapper.innerHTML = ''
  var url = 'http://127.0.0.1:8000/api/task-list/'

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      console.log('data:', data)

      var list = data
      for (var i in list) {
        var item = `
          <div class="items" id="data-row-$(i)">
            <div style="flex: 7;">
              <span class="title">${list[i].title}</span>
            </div>
            <div style="flex: 1;">
              <button class="button">Edit</button>
            </div>
            <div style="flex: 1;">
              <button class="button">
                delete
              </button>
            </div>
          </div>
          <hr>`
        wrapper.innerHTML += item
      }
    })
}

var form = document.querySelector('.form-wrapper')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('form sumbitted')
  var url = 'http://127.0.0.1:8000/api/task-create/'
  var title = document.querySelector('#title').value
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
