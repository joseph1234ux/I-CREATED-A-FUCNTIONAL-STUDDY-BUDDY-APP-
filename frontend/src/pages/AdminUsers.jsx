import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setError('');
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers((currentUsers) => currentUsers.map((user) => (
        user.id === userId ? { ...user, role } : user
      )));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the user role.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users…</div>;

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>User Management</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Manage user roles for your StudyBuddy account.</p>
      {error && <p style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</p>}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
          <thead><tr style={{ background: '#f8fafc', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px' }}>Name</th><th style={{ padding: '12px 16px' }}>Email</th><th style={{ padding: '12px 16px' }}>Role</th>
          </tr></thead>
          <tbody>{users.map((user) => (
            <tr key={user.id} style={{ borderTop: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px 16px' }}>{user.name}</td>
              <td style={{ padding: '12px 16px' }}>{user.email}</td>
              <td style={{ padding: '12px 16px' }}>
                <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}>
                  <option value="STUDENT">Student</option><option value="INSTRUCTOR">Instructor</option><option value="ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminUsers;
