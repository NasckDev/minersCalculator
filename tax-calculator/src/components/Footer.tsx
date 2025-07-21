import React from 'react';

/** Rodapé simples com copyright e info do desafio */
const Footer: React.FC = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-white text-center text-muted py-3 mt-4">
      <div className="container">
        <p className="mb-1">© {anoAtual} Calculadora IR Bolsa</p>
        <small className="d-block">Desenvolvido para o desafio MindMiners</small>
      </div>
    </footer>
  );
};

export default Footer;
