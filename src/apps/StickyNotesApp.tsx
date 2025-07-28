import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Draggable from 'react-draggable';
import { AppProps } from '../types';
import './StickyNotesApp.css';

interface Note {
  id: number;
  text: string;
  position: { x: number; y: number };
  color: string;
}

const NOTE_COLORS = ['#fffb8f', '#a6f6a8', '#a8d8f8', '#f8c0c0', '#d8b8f8'];

const StickyNotesApp: React.FC<AppProps> = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const nodeRef = React.useRef(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('stickyNotes', JSON.stringify(newNotes));
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      text: 'New Note',
      position: { x: 20, y: 20 },
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };
    saveNotes([...notes, newNote]);
  };

  const deleteNote = (id: number) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const updateNoteText = (id: number, text: string) => {
    const newNotes = notes.map(note => (note.id === id ? { ...note, text } : note));
    saveNotes(newNotes);
  };

  const handleDragStop = (id: number, data: { x: number; y: number }) => {
    const newNotes = notes.map(note => (note.id === id ? { ...note, position: { x: data.x, y: data.y } } : note));
    saveNotes(newNotes);
  };

  return (
    <div className="sticky-notes-app" ref={nodeRef}>
      <div className="sticky-notes-header">
        <h2>Sticky Notes</h2>
        <button onClick={addNote} className="add-note-button">
          <Plus size={18} /> Add Note
        </button>
      </div>
      <div className="notes-canvas">
        {notes.map(note => (
          <Draggable
            key={note.id}
            handle=".note-header"
            defaultPosition={note.position}
            onStop={(_, data) => handleDragStop(note.id, data)}
            bounds="parent"
          >
            <div className="sticky-note" style={{ backgroundColor: note.color }}>
              <div className="note-header">
                <button onClick={() => deleteNote(note.id)} className="delete-note-button">
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                value={note.text}
                onChange={e => updateNoteText(note.id, e.target.value)}
                className="note-textarea"
                spellCheck="false"
              />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default StickyNotesApp;
