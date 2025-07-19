import React from 'react';

function Footer() {
  return (
    <footer className="bg-white text-center text-muted py-3 mt-4">
      <div className="container">
        <p className="mb-1">© {new Date().getFullYear()} Calculadora IR Bolsa</p>
        <small className="d-block">Desenvolvido para o desafio MindMiners</small>
      </div>
    </footer>
  );
}

export default Footer;
