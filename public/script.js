document.getElementById('save-note').addEventListener('click', async () => {
    const noteInput = document.getElementById('note-input').value;
    if (!noteInput) {
      alert('Note cannot be empty');
      return;
    }
  
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteInput })
      });
      document.getElementById('note-input').value = '';
      listNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  });
  
  document.getElementById('list-notes').addEventListener('click', listNotes);
  
  async function listNotes() {
    try {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      const notesList = document.getElementById('notes-list');
      notesList.innerHTML = '';
      notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.innerHTML = `
          <span>${note.content}</span>
          <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesList.appendChild(noteDiv);
      });
    } catch (error) {
      console.error('Error listing notes:', error);
    }
  }
  
  async function deleteNote(id) {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      listNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
  