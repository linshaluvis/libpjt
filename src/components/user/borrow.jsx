import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserNavbar from '../usernavbar/usernavbar';
import { Modal, Button as BootstrapButton, Form } from 'react-bootstrap';
import Swal from "sweetalert2";
import Footer from '../Footer/Footer';

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
    background-color: #711aa0;
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
    width: 100px;
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

const StyledModal = styled(Modal)`
    .modal-content {
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }

    .modal-header {
        background-color: #711aa0;
        color: white;
        border-bottom: none;
        padding: 20px;
    }

    .modal-title {
        font-size: 1.75rem;
        font-weight: bold;
    }

    .modal-body {
        background: linear-gradient(45deg, #c487c4 0%, #b5afe3 100%);
        text-align: center;
        color: #333;
    }

    .modal-footer {
        border-top: none;
        padding: 15px 20px;
        background-color: #f8f9fa;
        display: flex;
        justify-content: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
        justify-content: center;

    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        margin-left: 1.5rem;
        padding: 10px;
        justify-content: center;


    }

    .form-control {
        justify-content: center;

        width: 120%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        font-size: 16px;
        margin-left: 4.5rem;
        
    }

    .btn-secondary {
        background-color: #6c757d;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 16px;
    }

    .btn-primary {
        background-color: #6c43ad;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 16px;
    }

    @media (max-width: 768px) {
        .modal-content {
            padding: 10px;
            border-radius: 8px;
        }

        .modal-header {
            padding: 15px;
        }

        .modal-title {
            font-size: 1.5rem;
        }

        .modal-body {
            padding: 20px;
        }

        .modal-footer {
            padding: 10px;
        }

        .btn-secondary, .btn-primary {
            padding: 8px 16px;
            font-size: 14px;
        }
    }

    @media (max-width: 576px) {
        .modal-content {
            padding: 5px;
            border-radius: 5px;
        }
        .form-control {
        justify-content: center;

        width: 80%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        font-size: 16px;

        .modal-header {
            padding: 10px;
        }

        .modal-title {
            font-size: 1.25rem;
        }

        .modal-body {
            padding: 15px;
        }

        .modal-footer {
            padding: 5px;
            flex-direction: column;
            align-items: center;
        }

        .btn-secondary, .btn-primary {
            width: 100%;
            padding: 10px;
            font-size: 14px;
            margin-bottom: 5px;
        }
    }
`;

const Borrow = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedBorrowId, setSelectedBorrowId] = useState(null);

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

    const handleShowModal = (borrowId) => {
        setSelectedBorrowId(borrowId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBorrowId(null);
    };

    const handlePayFine = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const { firstName, lastName, city, state, country, creditCardNumber, cvv } = event.target.elements;

        try {
            await axios.post(`http://localhost:8000/pay_fine/${selectedBorrowId}/`, {
                firstName: firstName.value,
                lastName: lastName.value,
                city: city.value,
                state: state.value,
                country: country.value,
                creditCardNumber: creditCardNumber.value,
                cvv: cvv.value
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            // Close the modal and re-fetch borrow details
            handleCloseModal();
            Toast.fire({
                icon: "success",
                title: `Payment successful`,
            });
            fetchData();
        } catch (error) {
            console.error('Error paying fine:', error);
        }
    };

    if (loading) {
        return <Container>Loading...</Container>;
    }

    if (error) {
        return <Container>Error: {error}</Container>;
    }

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

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
                                        {borrow.fine > 0 && !borrow.paid && (
                                            <Button onClick={() => handleShowModal(borrow.id)}>
                                                Pay Fine
                                            </Button>
                                        )}
                                    </TableData>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </Container>
            <StyledModal show={showModal} onHide={handleCloseModal}>
                <Form onSubmit={handlePayFine}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pay Fine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group controlId="state">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group controlId="creditCardNumber">
                            <Form.Label>Credit Card Number</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group controlId="cvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <BootstrapButton variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </BootstrapButton>
                        <BootstrapButton type="submit" variant="primary">
                            Pay Fine
                        </BootstrapButton>
                    </Modal.Footer>
                </Form>
            </StyledModal>
            <br></br>
            <Footer />
        </div>
    );
};

export default Borrow;
