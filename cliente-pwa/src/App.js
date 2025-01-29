import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Clientes from './components/Clientes';
import Fisioterapeutas from './components/Fisioterapeutas';
import Modalidades from './components/Modalidades';
import Matriculas from './components/Matriculas';
import Agenda from './components/Agenda';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Financeiro from './components/Financeiro';
import Dashboard from './components/Dashboard';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showFisioterapeutaModal, setShowFisioterapeutaModal] = useState(false);
  const [showModalidadeModal, setShowModalidadeModal] = useState(false);
  const [showMatriculaModal, setShowMatriculaModal] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  const handleAddCliente = () => setShowClienteModal(true);
  const handleAddFisioterapeuta = () => setShowFisioterapeutaModal(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            <div className="App">
              <Button variant="primary" className="d-lg-none mb-3" onClick={handleSidebarShow}>
                Menu
              </Button>
              <Sidebar
                show={showSidebar}
                handleClose={handleSidebarClose}
                onAddCliente={handleAddCliente}
                onAddFisioterapeuta={handleAddFisioterapeuta}
              />
              <main className="container mt-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clientes" element={<PrivateRoute element={<Clientes showModal={showClienteModal} setShowModal={setShowClienteModal} />} />} />
                  <Route path="/fisioterapeutas" element={<PrivateRoute element={<Fisioterapeutas showModal={showFisioterapeutaModal} setShowModal={setShowFisioterapeutaModal} />} />} />
                  <Route path="/modalidades" element={<PrivateRoute element={<Modalidades showModal={showModalidadeModal} setShowModal={setShowModalidadeModal} />} />} />
                  <Route path="/matriculas" element={<PrivateRoute element={<Matriculas showModal={showMatriculaModal} setShowModal={setShowMatriculaModal} />} />} />
                  <Route path="/agenda" element={<PrivateRoute element={<Agenda />} />} />
                  <Route path="/financeiro" element={<PrivateRoute element={<Financeiro />} />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;