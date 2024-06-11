import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './showmember.css'; 
import AdminNavbar from '../adminnavbar/adminnavbar';

function MemberDetails() {
    const [members, setMembers] = useState([]);
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
                setPendingCount(response.data.pending_count || 0);
            } catch (error) {
                setError('An error occurred while fetching data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/memberdetails')
            .then(response => {
                setMembers(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching member details:', error);
            });
    }, []);

    const baseURL = 'http://127.0.0.1:8000';

    return (
        <div>
            <AdminNavbar pendingCount={pendingCount} />
            <div>
                {error && <div className="error-message">{error}</div>}
                <h1 className='text-center text-uppercase'>Member Details</h1>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>SL. NO</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th>IMAGE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                            <tr key={member.id}>
                                <td>{index + 1}</td>
                                <td>{member.user.first_name} {member.user.last_name}</td>
                                <td>{member.user.email}</td>
                                <td>{member.number}</td>
                                <td>
                                    <img 
                                        src={`${baseURL}${member.mebimage}`} 
                                        alt={`${member.user.first_name} ${member.user.last_name}`}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberDetails;
