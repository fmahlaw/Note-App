"use strict";
// let notes = JSON.parse(localStorage.getItem('notes')) || [];
//   // Get form and note list elements from the HTML
//   const noteForm = document.querySelector('form');
//   const noteList = document.querySelector('ul');
//   // Function to render notes to the HTML
//   function renderNotes() {
//     // Clear the note list
//     noteList.innerHTML = '';
//     // Loop through the notes array and create an HTML list item for each note
//     notes.forEach((note, index) => {
//       const li = document.createElement('li');
//       const h3 = document.createElement('h3');
//       h3.textContent = note.title;
//       const p = document.createElement('p');
//       p.textContent = note.content;
//       const editButton = document.createElement('button');
//       editButton.textContent = 'Edit';
//       editButton.addEventListener('click', () => {
//         editNoteForm(index);
//       });
//       const deleteButton = document.createElement('button');
//       deleteButton.textContent = 'Delete';
//       deleteButton.addEventListener('click', () => {
//         deleteNote(index);
//       });
//       li.appendChild(h3);
//       li.appendChild(p);
//       li.appendChild(editButton);
//       li.appendChild(deleteButton);
//       noteList.appendChild(li);
//     });
//   }
//   // Function to add a new note to the notes array and update the HTML
//   function addNote() {
//     const noteTitle = document.querySelector('#note-title').value;
//     const noteContent = document.querySelector('#note-content').value;
//     if (noteTitle && noteContent) {
//       notes.push({title: noteTitle, content: noteContent});
//       localStorage.setItem('notes', JSON.stringify(notes));
//       renderNotes();
//     }
//   }
//   // Function to edit an existing note and update the HTML
//   function editNoteForm(index) {
//     const note = notes[index];
//     document.querySelector('#note-title').value = note.title;
//     document.querySelector('#note-content').value = note.content;
//     noteForm.removeEventListener('submit', addNote);
//     noteForm.addEventListener('submit', (event) => {
//       event.preventDefault();
//       note.title = document.querySelector('#note-title').value;
//       note.content = document.querySelector('#note-content').value;
//       localStorage.setItem('notes', JSON.stringify(notes));
//       renderNotes();
//       noteForm.removeEventListener('submit', editNoteForm);
//       noteForm.addEventListener('submit', addNote);
//       noteForm.reset();
//     });
//   }
//   // Function to delete an existing note and update the HTML
//   function deleteNote(index) {
//     notes.splice(index, 1);
//     localStorage.setItem('notes', JSON.stringify(notes));
//     renderNotes();
//   }
//   // Render the notes to the HTML on page load
//   renderNotes();
//   // Add an event listener to the note form to handle form submissions
//   noteForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     addNote();
//     noteForm.reset();
//   });
