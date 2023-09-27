import React from 'react';
import './SideNav.scss';
import { Link, NavLink } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

import Logo from '../../assets/tdm-alt-logo.png';
import ListChecks from '../../assets/list-checks.svg';
import FileCheck from '../../assets/file-check.svg';
import FileEdit from '../../assets/file-edit.svg';
import MailPlus from '../../assets/mail-plus.svg';
import Users from '../../assets/users.svg';

const SideNav: React.FC = () => {
    const { user } = useAuth();

    const {
        routes: { admin },
    } = useConfig();

    return (
        <nav className="navbar-wrapper">
            <header>
                <img src={Logo} alt="Tec de Monterray logo" />
            </header>

            <section>
                <NavLink className="navbar-buttons" to="/admin/collections/credential-batch">
                    <img src={ListChecks} alt="credential-batch" /> Issuance Overview
                </NavLink>
                <NavLink className="navbar-buttons" to="/admin/collections/credential">
                    <img src={FileCheck} alt="credential" /> Credentials
                </NavLink>
                <NavLink className="navbar-buttons" to="/admin/collections/credential-template">
                    <img src={FileEdit} alt="credential-template" /> Credential Templates
                </NavLink>
                <NavLink className="navbar-buttons" to="/admin/collections/email-template">
                    <img src={MailPlus} alt="email-template" /> Email Templates
                </NavLink>
                <NavLink className="navbar-buttons" to="/admin/collections/users">
                    <img src={Users} alt="users" /> Users
                </NavLink>
            </section>

            <footer>
                <section>
                    <Link to={`${admin}/account`} className="nav__account">
                        <Account />
                        <p>{user.email}</p>
                    </Link>
                </section>

                <section>
                    <Logout />
                </section>
            </footer>
        </nav>
    );
};

export default SideNav;
