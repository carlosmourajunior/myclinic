import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

function TopNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/" className="ms-3">Clinica</Navbar.Brand>
      <Nav className="ms-auto">
        <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
        <Nav.Link as={Link} to="/agenda">Agenda</Nav.Link>
        <Nav.Link as={Link} to="/fisioterapeutas">Fisioterapeutas</Nav.Link>
        <Nav.Link as={Link} to="/financeiro">Financeiro</Nav.Link>
        <Nav.Link as={Link} to="/modalidades">Financeiro</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default TopNavbar;
