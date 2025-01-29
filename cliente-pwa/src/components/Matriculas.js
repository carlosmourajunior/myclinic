import React, { useState, useEffect } from 'react';
import { Modal, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

function Matriculas({ showModal, setShowModal }) {
  const [matriculas, setMatriculas] = useState([]);
  const [formData, setFormData] = useState({
    cliente: '',
    fisioterapeuta: '',
    modalidade: '',
    porcentagem_comissao: '',
    dia_pagamento: '',
    horario_aula: '',
    dias_semana: [],
    status: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatriculaId, setCurrentMatriculaId] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [fisioterapeutas, setFisioterapeutas] = useState([]);
  const [modalidades, setModalidades] = useState([]);

  // Função para buscar dados do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matriculasResponse, clientesResponse, fisioterapeutasResponse, modalidadesResponse] = await Promise.all([
          axiosInstance.get('matriculas/'),
          axiosInstance.get('clientes/'),
          axiosInstance.get('fisioterapeutas/'),
          axiosInstance.get('modalidades/')
        ]);

        setMatriculas(matriculasResponse.data);
        setClientes(clientesResponse.data);
        setFisioterapeutas(fisioterapeutasResponse.data);
        setModalidades(modalidadesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função para atualizar o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'dias_semana') {
      const newDiasSemana = checked
        ? [...formData.dias_semana, value]
        : formData.dias_semana.filter(dia => dia !== value);
      setFormData({ ...formData, dias_semana: newDiasSemana });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  // Função para adicionar ou editar matrícula
  const handleSaveMatricula = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `matriculas/${currentMatriculaId}/`
      : 'matriculas/';
    const method = isEditing ? 'put' : 'post';

    try {
      const response = await axiosInstance({
        method: method,
        url: url,
        data: formData
      });

      if (response.status === 200 || response.status === 201) {
        const updatedMatricula = response.data;
        if (isEditing) {
          setMatriculas(matriculas.map(matricula => (matricula.id === currentMatriculaId ? updatedMatricula : matricula)));
        } else {
          setMatriculas([...matriculas, updatedMatricula]);
        }
        setFormData({ cliente: '', fisioterapeuta: '', modalidade: '', porcentagem_comissao: '', dia_pagamento: '', horario_aula: '', dias_semana: [], status: false });
        setShowModal(false); // Fechar o modal após salvar a matrícula
        setIsEditing(false);
        setCurrentMatriculaId(null);
      } else {
        console.error("Erro ao salvar matrícula.");
      }
    } catch (error) {
      console.error("Erro de conexão ao backend:", error);
    }
  };

  // Função para editar matrícula
  const handleEditMatricula = (matricula) => {
    setFormData(matricula);
    setCurrentMatriculaId(matricula.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Função para excluir matrícula
  const handleDeleteMatricula = async (matriculaId) => {
    if (window.confirm('Tem certeza que deseja excluir esta matrícula?')) {
      try {
        const response = await axiosInstance.delete(`matriculas/${matriculaId}/`);

        if (response.status === 204) {
          setMatriculas(matriculas.filter(matricula => matricula.id !== matriculaId));
        } else {
          console.error("Erro ao excluir matrícula.");
        }
      } catch (error) {
        console.error("Erro de conexão ao backend:", error);
      }
    }
  };

  return (
    <div>
      <h4 className="text-center bg-black text-white py-2">Matrículas</h4>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        <FaPlus />
      </Button>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fisioterapeuta</th>
              <th>Modalidade</th>
              <th>Dia Pagamento</th>
              <th>Horário da Aula</th>
              <th>Dias da Semana</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map((matricula) => (
              <tr key={matricula.id}>
                <td>{matricula.cliente_nome}</td>
                <td>{matricula.fisioterapeuta_nome}</td>
                <td>{matricula.modalidade_nome}</td>
                <td>{matricula.dia_pagamento}</td>
                <td>{matricula.horario_aula}</td>
                <td>{matricula.dias_semana.join(', ')}</td>
                <td>{matricula.status ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEditMatricula(matricula)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeleteMatricula(matricula.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar ou editar matrícula */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Matrícula' : 'Adicionar Matrícula'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveMatricula}>
            <div className="mb-3">
              <label htmlFor="cliente" className="form-label">Cliente</label>
              <select id="cliente" name="cliente" className="form-control" value={formData.cliente} onChange={handleChange} required>
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome_completo}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="fisioterapeuta" className="form-label">Fisioterapeuta</label>
              <select id="fisioterapeuta" name="fisioterapeuta" className="form-control" value={formData.fisioterapeuta} onChange={handleChange} required>
                <option value="">Selecione um fisioterapeuta</option>
                {fisioterapeutas.map((fisioterapeuta) => (
                  <option key={fisioterapeuta.id} value={fisioterapeuta.id}>{fisioterapeuta.nome_completo}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="modalidade" className="form-label">Modalidade</label>
              <select id="modalidade" name="modalidade" className="form-control" value={formData.modalidade} onChange={handleChange} required>
                <option value="">Selecione uma modalidade</option>
                {modalidades.map((modalidade) => (
                  <option key={modalidade.id} value={modalidade.id}>{modalidade.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="porcentagem_comissao" className="form-label">Porcentagem Comissão</label>
              <InputGroup>
                <FormControl 
                  type="number" 
                  id="porcentagem_comissao" 
                  name="porcentagem_comissao" 
                  className="form-control" 
                  value={formData.porcentagem_comissao} 
                  onChange={handleChange} 
                  required 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </div>

            <div className="mb-3">
              <label htmlFor="dia_pagamento" className="form-label">Dia Pagamento</label>
              <input 
                type="number" 
                id="dia_pagamento" 
                name="dia_pagamento" 
                className="form-control" 
                value={formData.dia_pagamento} 
                onChange={handleChange} 
                required 
                min="1" 
                max="31" 
                placeholder="1-31" 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="horario_aula" className="form-label">Horário da Aula</label>
              <input 
                type="time" 
                id="horario_aula" 
                name="horario_aula" 
                className="form-control" 
                value={formData.horario_aula} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dias_semana" className="form-label">Dias da Semana</label>
              <div>
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
                  <Form.Check 
                    key={dia}
                    type="checkbox"
                    id={`dias_semana_${dia}`}
                    name="dias_semana"
                    label={dia}
                    value={dia}
                    checked={formData.dias_semana.includes(dia)}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <Form.Check 
                type="checkbox" 
                id="status" 
                name="status" 
                label="Ativo" 
                checked={formData.status} 
                onChange={handleChange} 
              />
            </div>

            <Button variant="primary" type="submit">
              {isEditing ? 'Salvar Alterações' : 'Adicionar Matrícula'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Matriculas;