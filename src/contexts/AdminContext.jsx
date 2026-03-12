import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const adminLogin = (username, password) => {
    // Pour l'instant, authentification simple (à remplacer par une vraie API)
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: 1,
        username: 'admin',
        role: 'super_admin',
        email: 'admin@jeutaime.com'
      };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('jeutaime_admin_session', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('jeutaime_admin_session');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
