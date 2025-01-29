import React, { useState } from 'react';

function ClienteForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cliente = { nome, email, telefone };

    fetch('http://localhost:8000/api/clientes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Cliente cadastrado com sucesso:', data);
      })
      .catch((error) => {
        console.error('Erro ao cadastrar cliente:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome:
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Telefone:
        <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      </label>
      <button type="submit">Cadastrar Cliente</button>
    </form>
  );
}

export default ClienteForm;
