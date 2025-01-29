import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Offcanvas } from 'react-bootstrap';

function Sidebar({ onAddCliente, onAddFisioterapeuta, show, handleClose }) {
  const handleItemClick = () => {
    handleClose();
  };

  return (
    <>
      {/* Menu Offcanvas para dispositivos menores */}
      <Offcanvas show={show} onHide={handleClose} className="bg-dark text-white d-lg-none" responsive="lg" placement="start" style={{ width: '100%' }}>
        <Offcanvas.Header closeButton className="bg-dark text-white">
          <Offcanvas.Title>
            <Link to="/" className="navbar-brand">Clínica</Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark text-white">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/clientes" onClick={handleItemClick}>Alunos</Nav.Link>
            <Nav.Link as={Link} to="/fisioterapeutas" onClick={handleItemClick}>Fisioterapeutas</Nav.Link>
            <Nav.Link as={Link} to="/modalidades" onClick={handleItemClick}>Modalidades</Nav.Link>
            <Nav.Link as={Link} to="/matriculas" onClick={handleItemClick}>Matrículas</Nav.Link>
            <Nav.Link as={Link} to="/agenda" onClick={handleItemClick}>Agenda</Nav.Link>
            <Nav.Link as={Link} to="/financeiro" onClick={handleItemClick}>Financeiro</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Menu lateral para visualização normal */}
      <div className="sidebar d-none d-lg-block bg-dark text-white" style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: '250px' }}>
        <div className="p-3">
          <h2>Clinica</h2>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/fisioterapeutas">Fisioterapeutas</Nav.Link>
            <Nav.Link as={Link} to="/modalidades">Modalidades</Nav.Link>
            <Nav.Link as={Link} to="/matriculas">Matrículas</Nav.Link>
            <Nav.Link as={Link} to="/agenda">Agenda</Nav.Link>
            <Nav.Link as={Link} to="/financeiro">Financeiro</Nav.Link>
          </Nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;