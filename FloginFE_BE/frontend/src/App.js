import React, { useState } from 'react';
import Login from './components/Login';
import Product from './components/Product';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <div className="app-header">
            <div className="user-info">
              {currentUser && <span>Xin chào, <strong>{currentUser.username || 'User'}</strong></span>}
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Đăng xuất
            </button>
          </div>
          <Product />
        </div>
      )}
    </div>
  );
}

export default App;
