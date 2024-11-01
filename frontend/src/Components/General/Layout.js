import React from 'react';

function Layout({ children }) {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: '1', padding: '0px 0 0 0' }}> {/* Adjust padding-top as needed */}
        {children}
      </main>
      <footer style={{ backgroundColor: '#C51D34', padding: '10px', color: 'white', textAlign: 'center' }}>
        <p>&copy; 2024 Flowban. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
