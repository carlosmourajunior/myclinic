import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

function Clientes({ showModal, setShowModal }) {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    cpf: '',
    telefone: '',
    endereco: '',
    historico_medico: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentClienteId, setCurrentClienteId] = useState(null);

  // Função para buscar clientes do backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axiosInstance.get('clientes/');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar Alunos:', error);
      }
    };

    fetchClientes();
  }, []);

  // Função para atualizar o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar ou editar cliente
  const handleSaveCliente = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `clientes/${currentClienteId}/`
      : 'clientes/';
    const method = isEditing ? 'put' : 'post';

    try {
      const response = await axiosInstance({
        method: method,
        url: url,
        data: formData
      });

      if (response.status === 200 || response.status === 201) {
        const updatedClient = response.data;
        if (isEditing) {
          setClientes(clientes.map(cliente => (cliente.id === currentClienteId ? updatedClient : cliente)));
        } else {
          setClientes([...clientes, updatedClient]);
        }
        setFormData({ nome_completo: '', data_nascimento: '', cpf: '', telefone: '', endereco: '', historico_medico: '' });
        setShowModal(false); // Fechar o modal após salvar o cliente
        setIsEditing(false);
        setCurrentClienteId(null);
      } else {
        console.error("Erro ao salvar cliente.");
      }
    } catch (error) {
      console.error("Erro de conexão ao backend:", error);
    }
  };

  // Função para editar cliente
  const handleEditCliente = (cliente) => {
    setFormData(cliente);
    setCurrentClienteId(cliente.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Função para excluir cliente
  const handleDeleteCliente = async (clienteId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await axiosInstance.delete(`clientes/${clienteId}/`);

        if (response.status === 204) {
          setClientes(clientes.filter(cliente => cliente.id !== clienteId));
        } else {
          console.error("Erro ao excluir cliente.");
        }
      } catch (error) {
        console.error("Erro de conexão ao backend:", error);
      }
    }
  };

  // Função para formatar a data no formato dia/mês/ano
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div>
      <h4 className="text-center bg-black text-white py-2">Alunos</h4>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        <FaPlus />
      </Button>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th className="d-none d-lg-table-cell">Data de Nascimento</th>
              <th className="d-none d-lg-table-cell">CPF</th>
              <th>Telefone</th>
              <th className="d-none d-lg-table-cell">Endereço</th>
              <th className="d-none d-lg-table-cell">Histórico Médico</th>
              <th className="d-none d-lg-table-cell">Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome_completo}</td>
                <td className="d-none d-lg-table-cell">{cliente.data_nascimento}</td>
                <td className="d-none d-lg-table-cell">{cliente.cpf}</td>
                <td>{cliente.telefone}</td>
                <td className="d-none d-lg-table-cell">{cliente.endereco}</td>
                <td className="d-none d-lg-table-cell">{cliente.historico_medico}</td>
                <td className="d-none d-lg-table-cell">{formatDate(cliente.data_cadastro)}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEditCliente(cliente)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeleteCliente(cliente.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar ou editar cliente */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Cliente' : 'Adicionar Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveCliente}>
            <div className="mb-3">
              <label htmlFor="nome_completo" className="form-label">Nome Completo</label>
              <input type="text" id="nome_completo" name="nome_completo" className="form-control" value={formData.nome_completo} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="data_nascimento" className="form-label">Data de Nascimento</label>
              <input type="date" id="data_nascimento" name="data_nascimento" className="form-control" value={formData.data_nascimento} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input type="text" id="cpf" name="cpf" className="form-control" value={formData.cpf} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="telefone" className="form-label">Telefone</label>
              <input type="text" id="telefone" name="telefone" className="form-control" value={formData.telefone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="endereco" className="form-label">Endereço</label>
              <input type="text" id="endereco" name="endereco" className="form-control" value={formData.endereco} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="historico_medico" className="form-label">Histórico Médico</label>
              <textarea id="historico_medico" name="historico_medico" className="form-control" value={formData.historico_medico} onChange={handleChange}></textarea>
            </div>

            <Button variant="primary" type="submit">
              {isEditing ? 'Salvar Alterações' : 'Adicionar Cliente'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Clientes;