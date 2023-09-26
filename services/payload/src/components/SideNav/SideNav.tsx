import React from 'react';
import './SideNav.scss';
import { Link, NavLink } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

const SideNav: React.FC = () => {
    const { user } = useAuth();

    const {
        routes: {
          admin,
        },
      } = useConfig();

  return (
    <div className="navbar-wrapper">
        <div className="navbar-icon-wrapper">
            <img src="/assets/tdm-alt-logo.png" alt="Tec de Monterray logo"/>
        </div>
        <div className="navbar-buttons-wrap">
            <NavLink className="navbar-buttons" to="/admin/collections/credential-batch">
                <img src="/assets/list-checks.svg" alt="credential-batch"/> Issuance Overview
            </NavLink>
            <NavLink className="navbar-buttons" to="/admin/collections/credential">
                <img src="/assets/file-check.svg" alt="credential"/> Credentials
            </NavLink>
            <NavLink className="navbar-buttons" to="/admin/collections/credential-template">
                <img src="/assets/file-edit.svg" alt="credential-template"/> Credential Templates
            </NavLink>
            <NavLink className="navbar-buttons" to="/admin/collections/email-template">
                <img src="/assets/mail-plus.svg" alt="email-template"/> Email Templates
            </NavLink>
            <NavLink className="navbar-buttons" to="/admin/collections/users">
                <img src="/assets/users.svg" alt="users"/> Users
            </NavLink>
        </div>
        <div className="navbar-user-wrapper">
            <div className="navbar-user">
                <Link
                to={`${admin}/account`}
                className="nav__account"
                >
                <Account /> 
                <p>{user.email}</p>
                </Link>
            </div>
            <div className="navbar-logout-wrapper">
                <Logout /> 
            </div>
        </div>   
    </div>
  );
};

export default SideNav;