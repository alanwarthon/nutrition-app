import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Importar estilos

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Función para cerrar el menú cuando se hace clic en un enlace
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <h2>Nutrition App</h2>

      {/* Botón de menú hamburguesa */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="menu-button">
        ☰
      </button>

      {/* Lista de navegación */}
      <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/register" onClick={closeMenu}>
            Registro
          </Link>
        </li>
        <li>
          <Link to="/login" onClick={closeMenu}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={closeMenu}>
            Perfil
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
