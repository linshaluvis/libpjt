import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../adminnavbar/adminnavbar';
import './ApproveDisapproveUser.css'; // Import CSS file

function ApproveDisapproveUser() {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_user_status/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setPendingMembers(response.data.pending_users || []);
        setApprovedMembers(response.data.approved_users || []);
        setPendingCount(response.data.pending_count || 0);
      } catch (error) {
        setError('An error occurred while fetching data');
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://127.0.0.1:8000/approve_disapprove_mail/${id}/`, 
        { action: 'approve' },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert('Failed to approve user');
    }
  };

  const handleDisapprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://127.0.0.1:8000/approve_disapprove_mail/${id}/`, 
        { action: 'disapprove' },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert('Failed to disapprove user');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <AdminNavbar pendingCount={pendingCount} />  {/* Pass pendingCount to AdminNavbar */}
      <div className="container">
        <h1 className="title">Approve/Disapprove Users</h1>
        <section className="section">
          <h2 className="section-title">Pending Members ({pendingCount})</h2>
          {pendingMembers.length > 0 ? (
            pendingMembers.map(member => (
              <div key={member.id} className="member-card">
                <p>{member.username} {member.last_name}</p>
                <button className="approve-button w-25" onClick={() => handleApprove(member.id)}>Approve</button>
                <button className="disapprove-button w-25" onClick={() => handleDisapprove(member.id)}>Disapprove{member.id}</button>
              </div>
            ))
          ) : (
            <p>No pending members.</p>
          )}
        </section>

        <section className="section">
          <h2 className="section-title">Approved Members</h2>
          {approvedMembers.length > 0 ? (
            approvedMembers.map(member => (
              <div key={member.id} className="member-card">
                <p>{member.first_name} {member.last_name}</p>
              </div>
            ))
          ) : (
            <p>No approved members.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default ApproveDisapproveUser;
