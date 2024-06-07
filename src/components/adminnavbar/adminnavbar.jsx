import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './adminnavbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faPlus, faList, faBookOpen, faUsers, faSignOutAlt, faBookReader, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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
                                    WELCOME ADMIN
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className="offcanvas-body-custom">
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="/adminhome">
                                        <FontAwesomeIcon icon={faHome} /> Home
                                    </Nav.Link>
                                    <Nav.Link href="#action2">
                                        <FontAwesomeIcon icon={faBell} /> Notifications
                                    </Nav.Link>
                                    <Nav.Link href="/addbook">
                                        <FontAwesomeIcon icon={faPlus} /> Add Book
                                    </Nav.Link>
                                    <Nav.Link href="/add_category">
                                        <FontAwesomeIcon icon={faPlus} /> Add Category
                                    </Nav.Link>
                                    {/* <Nav.Link href="/showbook">
                                        <FontAwesomeIcon icon={faList} /> Book Details
                                    </Nav.Link> */}
                                    <Nav.Link href="/Showmember">
                                        <FontAwesomeIcon icon={faUsers} /> Members
                                    </Nav.Link>
                                    <NavDropdown
                                        title={<><FontAwesomeIcon icon={faBookReader} /> Book Details</>}
                                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                                    >
                                        <NavDropdown.Item href="/showbook">
                                            <FontAwesomeIcon icon={faList} /> Book Details
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="/order">
                                            <FontAwesomeIcon icon={faBookOpen} /> Order Details
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="/borrow_admin">
                                            <FontAwesomeIcon icon={faBookOpen} /> Rent Details
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/OverDueAdmin">
                                            <FontAwesomeIcon icon={faExclamationTriangle} /> Overdue
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
