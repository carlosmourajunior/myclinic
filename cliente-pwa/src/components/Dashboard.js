import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import '../styles/custom.css'; // Inclua um CSS atualizado
import { FaUserGraduate, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/dashboard-data/');
        setDados(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1 className="mb-4 text-center">Dashboard</h1>
      <Row className="justify-content-center">
        {dados.map((item, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Card className="mb-4 shadow-sm custom-card">
              <Card.Header className="bg-primary text-white text-center">
                <h5>{item.fisioterapeuta_nome}</h5>
              </Card.Header>
              <Card.Body>
                <Card.Text className="d-flex align-items-center">
                  <FaUserGraduate className="me-2 text-info" size={20} />
                  <strong>Alunos Matriculados:</strong>
                  <span className="ms-auto">{item.alunos_matriculados}</span>
                </Card.Text>
                <Card.Text className="d-flex align-items-center bg-light p-2 rounded">
                  <FaDollarSign className="me-2 text-success" size={20} />
                  <strong>Total Recebido:</strong>
                  <Badge bg="success" className="ms-auto">
                    R$ {item.total_recebido}
                  </Badge>
                </Card.Text>
                <Card.Text className="d-flex align-items-center bg-light p-2 rounded">
                  <FaDollarSign className="me-2 text-danger" size={20} />
                  <strong>Total a Receber:</strong>
                  <Badge bg="danger" className="ms-auto">
                    R$ {item.total_a_receber}
                  </Badge>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
