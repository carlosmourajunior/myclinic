import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

function Fisioterapeutas() {
  const [fisioterapeutas, setFisioterapeutas] = useState([]);
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo_usuario: 'fisioterapeuta'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentFisioterapeutaId, setCurrentFisioterapeutaId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Função para buscar fisioterapeutas do backend
  useEffect(() => {
    const fetchFisioterapeutas = async () => {
      try {
        const response = await axiosInstance.get('fisioterapeutas/');
        setFisioterapeutas(response.data);
      } catch (error) {
        console.error('Erro ao carregar fisioterapeutas:', error);
      }
    };

    fetchFisioterapeutas();
  }, []);

  // Função para atualizar o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar ou editar fisioterapeuta
  const handleSaveFisioterapeuta = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    const url = isEditing
      ? `fisioterapeutas/${currentFisioterapeutaId}/`
      : 'fisioterapeutas/';
    const method = isEditing ? 'put' : 'post';

    try {
      const response = await axiosInstance({
        method: method,
        url: url,
        data: formData
      });

      if (response.status === 200 || response.status === 201) {
        const updatedFisioterapeuta = response.data;
        if (isEditing) {
          setFisioterapeutas(fisioterapeutas.map(fisioterapeuta => (fisioterapeuta.id === currentFisioterapeutaId ? updatedFisioterapeuta : fisioterapeuta)));
        } else {
          setFisioterapeutas([...fisioterapeutas, updatedFisioterapeuta]);
        }
        setFormData({ nome_completo: '', cpf: '', telefone: '', email: '', senha: '', confirmarSenha: '', tipo_usuario: 'fisioterapeuta' });
        setShowModal(false); // Fechar o modal após salvar o fisioterapeuta
        setIsEditing(false);
        setCurrentFisioterapeutaId(null);
        setErro('');
        setSucesso('Fisioterapeuta salvo com sucesso!');
      } else {
        console.error("Erro ao salvar fisioterapeuta.");
      }
    } catch (error) {
      console.error("Erro de conexão ao backend:", error);
      setErro('Erro ao salvar fisioterapeuta.');
    }
  };

  // Função para editar fisioterapeuta
  const handleEditFisioterapeuta = (fisioterapeuta) => {
    setFormData({ ...fisioterapeuta, senha: '', confirmarSenha: '' });
    setCurrentFisioterapeutaId(fisioterapeuta.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Função para excluir fisioterapeuta
  const handleDeleteFisioterapeuta = async (fisioterapeutaId) => {
    if (window.confirm('Tem certeza que deseja excluir este fisioterapeuta?')) {
      try {
        const response = await axiosInstance.delete(`fisioterapeutas/${fisioterapeutaId}/`);

        if (response.status === 204) {
          setFisioterapeutas(fisioterapeutas.filter(fisioterapeuta => fisioterapeuta.id !== fisioterapeutaId));
        } else {
          console.error("Erro ao excluir fisioterapeuta.");
        }
      } catch (error) {
        console.error("Erro de conexão ao backend:", error);
      }
    }
  };

  return (
    <div>
      <h4 className="text-center bg-dark text-white py-2">Fisioterapeutas</h4>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        <FaPlus />
      </Button>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Tipo de Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fisioterapeutas.map((fisioterapeuta) => (
              <tr key={fisioterapeuta.id}>
                <td>{fisioterapeuta.nome_completo}</td>
                <td>{fisioterapeuta.cpf}</td>
                <td>{fisioterapeuta.telefone}</td>
                <td>{fisioterapeuta.email}</td>
                <td>{fisioterapeuta.tipo_usuario}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEditFisioterapeuta(fisioterapeuta)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeleteFisioterapeuta(fisioterapeuta.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar ou editar fisioterapeuta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Fisioterapeuta' : 'Adicionar Fisioterapeuta'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {erro && <Alert variant="danger">{erro}</Alert>}
          {sucesso && <Alert variant="success">{sucesso}</Alert>}
          <form onSubmit={handleSaveFisioterapeuta}>
            <div className="mb-3">
              <label htmlFor="nome_completo" className="form-label">Nome Completo</label>
              <input type="text" id="nome_completo" name="nome_completo" className="form-control" value={formData.nome_completo} onChange={handleChange} required />
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
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input type="password" id="senha" name="senha" className="form-control" value={formData.senha} onChange={handleChange} required={!isEditing} />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmarSenha" className="form-label">Confirmar Senha</label>
              <input type="password" id="confirmarSenha" name="confirmarSenha" className="form-control" value={formData.confirmarSenha} onChange={handleChange} required={!isEditing} />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo_usuario" className="form-label">Tipo de Usuário</label>
              <select id="tipo_usuario" name="tipo_usuario" className="form-control" value={formData.tipo_usuario} onChange={handleChange} required>
                <option value="fisioterapeuta">Fisioterapeuta</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button variant="primary" type="submit">
              {isEditing ? 'Salvar Alterações' : 'Adicionar Fisioterapeuta'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Fisioterapeutas;