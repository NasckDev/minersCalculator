import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/** Cabeçalho da aplicação com logo MindMiners */
const Header: React.FC = () => {
  const logoUrl =
    "https://cdn.prod.website-files.com/61e6bab6b436a4078bacffaf/654e6e9a661458e915d21a5d_MindMiners-Logo_Degrade%CC%82%201.svg";

  return (
    <header className="bg-white shadow-sm py-3 content-header">
      <div className="container text-center">
        <img
          src={logoUrl}
          alt="Logo MindMiners"
          style={{ height: "70px" }}
          loading="lazy"
        />
      </div>
    </header>
  );
};

export default Header;
