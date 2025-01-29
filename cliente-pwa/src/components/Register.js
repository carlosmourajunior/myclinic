import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/auth/registration/', {
        username,
        email,
        password1,
        password2
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center">
        <Col xs={12} md={6} lg={4}>
          <div style={{ minWidth: '300px' }}>
            <h2>Register</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ minWidth: '250px' }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ minWidth: '250px' }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  style={{ minWidth: '250px' }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  style={{ minWidth: '250px' }}
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Register
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;