// let allNoteData = [] come back to this refactor
const noteContainer = document.getElementById('note-container')
const sidebarContainer = document.getElementById('sidebar-container')
const mainPageContainer = document.getElementById('main-page-container')
const noteForm = document.querySelector(".create-note-form")
// const noteSummaryContainer = document.querySelector(".note-box-summary")
let url = `http://localhost:3000/api/v1/notes`
let noteSnippet;
let userId;

function getNotes (){
  fetch(url, {
   method: 'GET'
 }).then(function(responseObj){
   // console.log(responseObj)
   return responseObj.json()
 }).then(function(parsedJSON){
   //console.log(parsedJSON)
   noteSnippet = parsedJSON
   userId = noteSnippet[0].user.id
   sidebarContainer.innerHTML = ''
   appendNoteSnippetToDOM(noteSnippet)
 })
};


function appendNoteSnippetToDOM(noteSnippet) {
  // sidebarContainer.innerHTML = ''
  for (i in noteSnippet) {
    let sidebarDiv = document.createElement('div')
    // console.log('noteSnippet[i].title')
    sidebarDiv.innerHTML = `<div class="note-box">
      <h2 id="note-title" data-id="${i}">${noteSnippet[i].title}</h2>
      <input id="delete-button" type="button" data-id="${noteSnippet[i].id}" value="Delete Me Mah Dude"></input>
      </div>`
    sidebarContainer.appendChild(sidebarDiv)
  }
}

sidebarContainer.addEventListener('click', (event) => {

  let mainPageDiv = document.createElement('div')
  // console.log(event.target.dataset.id)
  mainPageContainer.innerHTML = ''
  if (event.target.id === 'note-title' ){
  // mainPageContainer.innerHTML = ''
  // console.log(event.target.dataset.id)
  mainPageDiv.innerHTML = `<div class="note-box-summary">
  <form class="update-note-form" id="update-note-form" >
    <input id="note-title" contenteditable="true" value="${noteSnippet[event.target.dataset.id].title}"></input>
    <input id="note-summary" contenteditable="true" value="${noteSnippet[event.target.dataset.id].body}"></input>
    <input id="update-button" type="submit" data-id="${noteSnippet[event.target.dataset.id].id}" value="Update"></input>
    </form>
    </div>`
mainPageContainer.appendChild(mainPageDiv)

    document.getElementById("update-note-form").addEventListener('submit', (event) =>{
      event.preventDefault()
      // console.log(event)
      let noteInputName = event.target[0].value
      // console.log(event.target[0].value)
      let noteInputDescription = event.target[1].value
      // console.log(event.target[2].dataset.id)

      fetch(url + `/${event.target[2].dataset.id}`,
      {
        method: 'PATCH',
        headers:
        {
          "Content-Type": "application/json; charset=utf-8",
          // Accept: "application/json"
        },
        body: JSON.stringify (
        {
          title: noteInputName,
          body: noteInputDescription,
        })
      }).then(response => {
      return response.json()
    }).then(() => {
      getNotes()
      })

    });//end addEventListener


  } else if (event.target.id === 'delete-button' ) {
    fetch(url + `/${event.target.dataset.id}`,
    {
      method: 'DELETE',
      headers:
      {
        "Content-Type": "application/json; charset=utf-8",
        // Accept: "application/json"
      }
    }).then(response => {
    return response.json()
  }).then(() => {
    getNotes()
    })
  }
  // getNotes()
}); //end of addEventListener

noteForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let noteInputName = event.target[0].value
  // console.log(event.target[0].value)
  let noteInputDescription = event.target[1].value
  // console.log(event.target[1].value)

  fetch(url,
  {
    method: 'POST',
    headers:
    {
      "Content-Type": "application/json; charset=utf-8",
      // Accept: "application/json"
    },
    body: JSON.stringify(
    {
      title: noteInputName,
      body: noteInputDescription,
      user_id: userId
    })
  }).then(response => {
  return response.json()
}).then(() => {
  getNotes()
  })
}); //end addEventListener




getNotes();
