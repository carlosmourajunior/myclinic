import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import '../styles/custom.css'; // Certifique-se de importar o arquivo CSS

const Financeiro = () => {
  const [matriculas, setMatriculas] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    axiosInstance.get(`/matriculas-do-mes/?mes=${mes}&ano=${ano}`)
      .then(response => {
        setMatriculas(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the matriculas!', error);
      });
  }, [mes, ano]);

  const handleMesChange = (event) => {
    setMes(event.target.value);
  };

  const handleAnoChange = (event) => {
    setAno(event.target.value);
  };

  const handleMarcarComoPago = (matriculaId) => {
    axiosInstance.post(`/marcar-como-pago/`, { matricula_id: matriculaId, mes, ano })
      .then(response => {
        setMatriculas(matriculas.map(matricula => 
          matricula.id === matriculaId ? { ...matricula, status_pagamento: true } : matricula
        ));
      })
      .catch(error => {
        console.error('There was an error updating the payment status!', error);
      });
  };

  const isAtrasado = (diaPagamento) => {
    const hoje = new Date().getDate();
    return hoje > diaPagamento;
  };

  return (
    <div>
      <h1>Financeiro</h1>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formMes">
              <Form.Label>Selecione o mês:</Form.Label>
              <Form.Control as="select" value={mes} onChange={handleMesChange}>
                {meses.map((mesNome, index) => (
                  <option key={index + 1} value={index + 1}>{mesNome}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formAno">
              <Form.Label>Selecione o ano:</Form.Label>
              <Form.Control as="select" value={ano} onChange={handleAnoChange}>
                {[...Array(10).keys()].map(i => (
                  <option key={ano - i} value={ano - i}>{ano - i}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data de Pagamento</th>
            <th>Horário da Aula</th>
            <th>Status do Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {matriculas.map(matricula => (
            <tr key={matricula.id} className={!matricula.status_pagamento && isAtrasado(matricula.dia_pagamento) ? 'table-row-atrasado' : ''}>
              <td>{matricula.cliente_nome}</td>
              <td>{matricula.dia_pagamento}/{mes}/{ano}</td>
              <td>{matricula.horario_aula}</td>
              <td>{matricula.status_pagamento ? 'Pago' : 'Pendente'}</td>
              <td>
                {!matricula.status_pagamento && (
                  <Button variant="primary" onClick={() => handleMarcarComoPago(matricula.id)}>Marcar como Pago</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Financeiro;