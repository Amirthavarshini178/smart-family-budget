import FamilyChat from '../components/FamilyChat';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();
  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Family Chat</h2>
        <p>Shared family communication space · Family ID: <code style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>{user?.familyId || 'N/A'}</code></p>
      </div>
      <div className="section" style={{ maxWidth: 700 }}>
        <FamilyChat />
      </div>
    </div>
  );
}
