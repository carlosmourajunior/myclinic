import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';

const Login = ({ handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('auth/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.key);
        handleClose && handleClose();
        navigate(from, { replace: true });
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleRegister = () => {
    handleClose && handleClose();
    navigate('/register');
  };

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center">
        <Col xs={12} md={6} lg={4}>
          <div style={{ minWidth: '300px' }}>
            <h2>Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
              </Button>
              <Button variant="link" onClick={handleRegister} className="w-100 mt-2">
                Register
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;