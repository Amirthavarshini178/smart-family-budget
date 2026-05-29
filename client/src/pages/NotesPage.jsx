import Notes from '../components/Notes';

export default function NotesPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Notes</h2>
        <p>Family notes, grocery lists, reminders, and monthly planning</p>
      </div>
      <Notes />
    </div>
  );
}
