document.addEventListener('DOMContentLoaded', () => {
  let allNotes = []
  const notePreviewContainer = document.getElementById("preview-container")
  const fullNotesContainer = document.getElementById("full-notes-container")
  const newNoteForm = document.getElementById("note-form")


  fetch('http://localhost:3000/api/v1/notes')
    .then(responseObj => responseObj.json())
    .then((parsedJSON) => {
      allNotes = parsedJSON
      notePreviewContainer.innerHTML += addPreviewToDom(allNotes)
    }) //End of Fetch

  notePreviewContainer.addEventListener('click', (event) => {
    let foundNote = allNotes.find((note) => {
      return note.id == event.target.parentElement.dataset.id
    })

    if (event.target.dataset.action === "edit") {
      let currentNoteDiv = event.target.parentElement.querySelector('[data-id]')
      let currentNoteData = allNotes.find((note) => {
        return note.id == currentNoteDiv.dataset.id
      })
      fullNotesContainer.innerHTML = addFullNoteToDom(currentNoteData)
      fullNotesContainer.innerHTML +=
        `<div id="update-note">
          <form id="update-note-form">
            <input id="title" placeholder="title...">
            <input id="content" placeholder="enter your note...">
            <button>UPDATE</button>
          </form>
        </div>`
        const updateNoteForm = document.getElementById("update-note-form")
        updateNoteForm.title.value = currentNoteData.title
        updateNoteForm.content.value = currentNoteData.body

      fullNotesContainer.addEventListener('submit', (event) => {
        event.preventDefault()
        const fullNoteDiv = event.target.parentElement.parentElement
        let currentNoteDiv = event.target.parentElement.parentElement.querySelector('[data-id]')
        let currentNoteData = allNotes.find((note) => {
          return note.id == currentNoteDiv.dataset.id
        })

        fetch(`http://localhost:3000/api/v1/notes/${currentNoteDiv.dataset.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            'title': `${updateNoteForm.title.value}`,
            'body': `${updateNoteForm.content.value}`,
            'user_id': 1
          })
        })
        .then(response => response.json())
        .then(responseJson => {
          currentNoteData.title = responseJson.title
          currentNoteData.body = responseJson.body
          currentNoteDiv.innerHTML = addFullNoteToDom(responseJson)
          notePreviewContainer.innerHTML = addPreviewToDom(allNotes)
        })
      })

    } else if (event.target.dataset.action === "delete") {
      const noteDiv = event.target.parentElement
      const id = noteDiv.dataset.containerid
      fetch(`http://localhost:3000/api/v1/notes/${id}`, {
        method: "DELETE"
      })
      .then(response => {
        if (response.ok) {
          allNotes= allNotes.filter(note => note.id != id)
          noteDiv.remove()
        }
      })

    } else {
    fullNotesContainer.innerHTML = addFullNoteToDom(foundNote)
    }
  })

  newNoteForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let noteTitle = document.getElementById("title").value
    let noteContent = document.getElementById("content").value

    fetch('http://localhost:3000/api/v1/notes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        'title': `${noteTitle}`,
        'body': `${noteContent}`,
        'user_id': 1
      })
    })
    .then(response => response.json())
    .then((newNoteData) => {
      allNotes.push(newNoteData)
      let newNoteHTML = addNewNoteToDom(newNoteData)
      let noteElement = document.createElement(`div`)
      noteElement.innerHTML = newNoteHTML
      notePreviewContainer.appendChild(noteElement)
    })
    newNoteForm.reset()
  }) // End of submitEventListener


}) //End of DOMContentLoaded

const addPreviewToDom = (notesArray) => {
  return notesArray.map((note) => {
    return `
      <div class="ind-note" data-containerId=${note.id}>
        <div data-id=${note.id}>
          <h3>${note.id} - </h3>
          <p>${note.title}</p>
        </div>
        <button id="edit" data-action="edit">edit</button>
        <button id="delete" data-action="delete">delete</button>
      </div>
    `
  }).join("")
}

function addFullNoteToDom(note) {
  return `
    <div class="full-note">
      <div data-id=${note.id}>
        <h2>Title: ${note.title}</h2>
        <p>Body: ${note.body}</p>
        <p>Author: ${note.user.name}</p>
      </div>
    </div>
  `
}

function addNewNoteToDom(note) {
  return `
    <div class="ind-note">
      <div data-id=${note.id}>
        ${note.id} - ${note.title}
      </div>
    </div>
  `
}
