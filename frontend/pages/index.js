import Link from 'next/link';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <Container fluid className="p-0">
      {/* Header */}
      <header className="text-center py-4">
        <Typography variant="h2" component="h1" className="fw-bold">
          Forkin-Flavors
        </Typography>
      </header>

      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Body */}
      <main className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <Typography variant="h5" component="p">
                Discover amazing recipes, share your own, and explore the world of flavors!
              </Typography>
              <div className="mt-4">
                <Link href="/signup">
                  <button className="btn btn-primary me-2">Get Started</button>
                </Link>
                <Link href="/login">
                  <button className="btn btn-outline-light">Log In</button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      {/* Footer */}
      <footer className="text-center bg-dark text-light py-3">
        <Typography variant="body2">
          © {new Date().getFullYear()} Forkin-Flavors. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
}
