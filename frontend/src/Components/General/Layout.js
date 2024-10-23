
import React from 'react';

function Layout({ children }) {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#007bff', padding: '10px', color: 'white', textAlign: 'center' }}>
        <h1>FlowBan</h1>
      </header>

      <main style={{ flex: '1', padding: '20px' }}>
        {children}  
      </main>

      <footer style={{ backgroundColor: '#007bff', padding: '10px', color: 'white', textAlign: 'center' }}>
        <p>Footer Content © 2024</p>
      </footer>
    </div>
  );
}

export default Layout;
