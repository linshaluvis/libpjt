import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserNavbar from '../usernavbar/usernavbar';

const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
`;

const TableHeader = styled.th`
    background-color: #343a40;
    color: #fff;
    padding: 12px;
    text-align: left;
    font-size: 16px;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 12px;
    font-size: 14px;
    &:nth-child(odd) {
        background-color: #f9f9f9;
    }
`;

const Button = styled.button`
    margin-right: 10px;
    padding: 8px 16px;
    width:100px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: opacity 0.3s;
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

const Header = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    color: #343a40;
    text-align: center;
`;

const Borrow = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        const token = localStorage.getItem('token');

        try {
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleReturnBook = async (id, isMissing) => {
        const token = localStorage.getItem('token');
        const originalBorrows = [...borrows]; // Copy the original state

        // Optimistically update the state
        setBorrows(borrows.map(borrow =>
            borrow.id === id ? { ...borrow, returned: 'Yes', fine: isMissing ? 'Pending' : '0' } : borrow
        ));

        try {
            const response = await axios.post(`http://localhost:8000/return_book/${id}/`, {
                book_missing: isMissing ? 'yes' : 'no'
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.data.status === 'success') {
                // Update the state with the actual fine from the server response
                setBorrows(borrows.map(borrow =>
                    borrow.id === id ? { ...borrow, fine: response.data.fine } : borrow
                ));
                // Re-fetch the borrow details from the server
                fetchData();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error marking book as missing:', error);
            // Revert to the original state in case of an error
            setBorrows(originalBorrows);
            fetchData();
        }
    };

    if (loading) {
        return <Container>Loading...</Container>;
    }

    if (error) {
        return <Container>Error: {error}</Container>;
    }

    return (
        <div>
            <UserNavbar />
            <Container>
                <Header className='text-uppercase'>My Borrowed Books</Header>
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
                                                    Missing 
                                                </DangerButton>
                                                <SuccessButton 
                                                    onClick={() => handleReturnBook(borrow.id, false)}
                                                >
                                                    Return 
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
