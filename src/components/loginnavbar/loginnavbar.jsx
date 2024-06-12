import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './loginnavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="lg" className="nav-con bg-gradient-custom">
      <Container className="me-container ">
        <Navbar.Brand href="#home" className="brand-text"><strong>BOOKSHARE</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="me-link" href="/">
              <FontAwesomeIcon icon={faHome} /> HOME
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="me-li" href="/login">
              <FontAwesomeIcon icon={faSignInAlt} /> LOGIN
            </Nav.Link>
            <Nav.Link className="me-li" href="/signup">
              <FontAwesomeIcon icon={faUserPlus} /> SIGN UP
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
