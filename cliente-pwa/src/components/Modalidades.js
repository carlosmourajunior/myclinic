import React, { useState, useEffect } from 'react';
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

function Modalidades({ showModal, setShowModal }) {
  const [modalidades, setModalidades] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    descricao: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentModalidadesId, setCurrentModalidadesId] = useState(null);

  // Função para buscar Modalidades do backend
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const response = await axiosInstance.get('modalidades/');
        setModalidades(response.data);
      } catch (error) {
        console.error('Erro ao carregar Modalidades:', error);
      }
    };

    fetchModalidades();
  }, []);

  // Função para atualizar o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar ou editar modalidade
  const handleSaveModalidade = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `modalidades/${currentModalidadesId}/`
      : 'modalidades/';
    const method = isEditing ? 'put' : 'post';

    try {
      const response = await axiosInstance({
        method: method,
        url: url,
        data: formData
      });

      if (response.status === 200 || response.status === 201) {
        const updatedModalidade = response.data;
        if (isEditing) {
          setModalidades(modalidades.map(modalidade => (modalidade.id === currentModalidadesId ? updatedModalidade : modalidade)));
        } else {
          setModalidades([...modalidades, updatedModalidade]);
        }
        setFormData({ nome: '', valor: '', descricao: '' });
        setShowModal(false); // Fechar o modal após salvar a modalidade
        setIsEditing(false);
        setCurrentModalidadesId(null);
      } else {
        console.error("Erro ao salvar modalidade.");
      }
    } catch (error) {
      console.error("Erro de conexão ao backend:", error);
    }
  };

  // Função para editar modalidade
  const handleEditModalidade = (modalidade) => {
    setFormData(modalidade);
    setCurrentModalidadesId(modalidade.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Função para excluir modalidade
  const handleDeleteModalidade = async (modalidadeId) => {
    if (window.confirm('Tem certeza que deseja excluir esta modalidade?')) {
      try {
        const response = await axiosInstance.delete(`modalidades/${modalidadeId}/`);

        if (response.status === 204) {
          setModalidades(modalidades.filter(modalidade => modalidade.id !== modalidadeId));
        } else {
          console.error("Erro ao excluir modalidade.");
        }
      } catch (error) {
        console.error("Erro de conexão ao backend:", error);
      }
    }
  };

  return (
    <div>
      <h4 className="text-center bg-black text-white py-2">Modalidades</h4>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        <FaPlus />
      </Button>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map((modalidade) => (
              <tr key={modalidade.id}>
                <td>{modalidade.nome}</td>
                <td>{modalidade.valor}</td>
                <td>{modalidade.descricao}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEditModalidade(modalidade)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeleteModalidade(modalidade.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar ou editar modalidade */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Modalidade' : 'Adicionar Modalidade'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveModalidade}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input type="text" id="nome" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="valor" className="form-label">Valor</label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <FormControl 
                  type="number" 
                  id="valor" 
                  name="valor" 
                  className="form-control" 
                  value={formData.valor} 
                  onChange={handleChange} 
                  required 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                />
              </InputGroup>
            </div>

            <div className="mb-3">
              <label htmlFor="descricao" className="form-label">Descricao</label>
              <input type="text" id="descricao" name="descricao" className="form-control" value={formData.descricao} onChange={handleChange} required />
            </div>

            <Button variant="primary" type="submit">
              {isEditing ? 'Salvar Alterações' : 'Adicionar Modalidade'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Modalidades;