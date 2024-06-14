import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './usernavbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faBell, faUser, faBook, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function OffcanvasExample() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/logout/', {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.data.status === 'success') {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error('Logout failed:', res.data.message);
            }
        } catch (err) {
            console.error('An error occurred during logout:', err);
        }
    };

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="custom-navbar bg-gradient-custom mb-3">
                    <Container fluid className='Navbar'>
                        <Navbar.Brand className='Navbar-head' href="#"><strong>BOOKSHARE</strong></Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                            className="offcanvas-custom"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="offcanvas-title-custom">
                                    WELCOME USER
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className="offcanvas-body-custom">
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="/userhome">
                                        <FontAwesomeIcon icon={faHome} /> Home
                                    </Nav.Link>
                                    <Nav.Link href="/cart">
                                        <FontAwesomeIcon icon={faShoppingCart} /> Book CART
                                    </Nav.Link>
                                    {/* <Nav.Link href="/notifications">
                                        <FontAwesomeIcon icon={faBell} /> Notifications
                                    </Nav.Link> */}
                                    <Nav.Link href="/Memberprofile">
                                        <FontAwesomeIcon icon={faUser} /> Profile
                                    </Nav.Link>
                                    <Nav.Link href="/Changepassword">
                                        <FontAwesomeIcon icon={faUser} /> Change Password
                                    </Nav.Link>
                                    <NavDropdown
                                        title={<><FontAwesomeIcon icon={faBook} /> Book Details</>}
                                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                                    >
                                        <NavDropdown.Item href="/orderuser">
                                            Order Details
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="/borrow">
                                            Rent Details
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link onClick={handleLogout} className="logout-link">
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                                    </Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default OffcanvasExample;
