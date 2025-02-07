import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{ padding: '10px', background: '#282c34', color: 'white' }}>
      <nav>
        <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Login</Link>
        <Link to="/signup" style={{ color: 'white' }}>Signup</Link>
      </nav>
    </header>
  );
};

export default Header;
