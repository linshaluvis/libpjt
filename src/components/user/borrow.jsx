import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserNavbar from '../usernavbar/usernavbar';


const Container = styled.div`
    padding: 20px;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

const TableHeader = styled.th`
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    padding: 8px;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
`;

const Button = styled.button`
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

const SuccessButton = styled(Button)`
    background-color: #28a745;
    color: white;
`;

const DangerButton = styled(Button)`
    background-color: #dc3545;
    color: white;
`;

const Borrow = () => {
    const [books, setBooks] = useState([]);
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                const booksResponse = await axios.get('http://localhost:8000/api/books/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setBooks(booksResponse.data);

                const borrowsResponse = await axios.get('http://localhost:8000/borrow_details/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setBorrows(borrowsResponse.data.borrows);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'An error occurred');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleReturnBook = async (id, isMissing) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:8000/return_book/${id}/`, {
                book_missing: isMissing ? 'yes' : 'no'
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.data.status === 'success') {
                setBorrows(borrows.map(borrow => 
                    borrow.id === id ? { ...borrow, returned: 'Yes' } : borrow
                ));
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error marking book as missing:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
        <UserNavbar />
        <Container>
            <h2>My Borrowed Books</h2>
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Book Title</TableHeader>
                            <TableHeader>Borrow Date</TableHeader>
                            <TableHeader>Return Date</TableHeader>
                            <TableHeader>Returned</TableHeader>
                            <TableHeader>Fine</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {borrows.map(borrow => (
                            <tr key={borrow.id}>
                                <TableData>{borrow.book.book}</TableData>
                                <TableData>{borrow.borrow_date}</TableData>
                                <TableData>{borrow.return_date}</TableData>
                                <TableData>{borrow.returned}</TableData>
                                <TableData>{borrow.fine}</TableData>
                                <TableData>
                                    {borrow.returned === 'No' && (
                                        <>
                                            <DangerButton 
                                                onClick={() => handleReturnBook(borrow.id, true)}
                                            >
                                                Missing Book
                                            </DangerButton>
                                            <SuccessButton 
                                                onClick={() => handleReturnBook(borrow.id, false)}
                                            >
                                                Return Book
                                            </SuccessButton>
                                        </>
                                    )}
                                </TableData>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </Container>
        </div>
    );
};

export default Borrow;
