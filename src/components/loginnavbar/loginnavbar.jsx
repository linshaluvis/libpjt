import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './loginnavbar.css';


function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="lg" className=" nav-con bg-body-tertiary">
      <Container className="me-CONTAINER" >
        <Navbar.Brand href="#home"><strong>BOOKSHARE</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="me-link" href="/">HOME</Nav.Link>
           
          </Nav>
          <Nav>
          <Nav.Link className="me-li" href="/login">LOGIN</Nav.Link>
            <Nav.Link className="me-li" href="/signup">SIGN UP</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;