import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import LogOut from 'payload/dist/admin/components/icons/LogOut';

const baseClass = 'nav';

const Logout = (props) => {
  const {
      navbarOpen
  } = props;  
  const config = useConfig();
  const {
    routes: { admin },
    admin: {
      logoutRoute,
      components: { logout }
    }
  } = config;
  return (
    <Link to={`${admin}${logoutRoute}`} className={`${baseClass}__log-out`}>
      <LogOut />
      {navbarOpen && <p>Logout</p>}
    </Link>
  );
};

export default Logout;