import React, { useState } from 'react';
import { Helmet } from "react-helmet";

import './SideNav.scss';
import { Link, NavLink } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

import ListChecks from '../../assets/list-checks.svg';
import FileCheck from '../../assets/file-check.svg';
import FileEdit from '../../assets/file-edit.svg';
import MailPlus from '../../assets/mail-plus.svg';
import Memberships from '../../assets/file-check.svg';
import MembershipBatches from '../../assets/list-checks.svg';
import MembershipTemplates from '../../assets/file-edit.svg';
import Users from '../../assets/users.svg';
import Caret from '../svgs/Caret';
import useScreenWidth from '../../hooks/useScreenWidth'; 
import useTenantMetadata from '../../hooks/useTenantMetadata';

const SideNav: React.FC = () => {
    const width = useScreenWidth();

    const [isOpen, setIsOpen] = useState(width > 1024);
    const { user } = useAuth();
    const { tenant, logo, icon, favicon } = useTenantMetadata();

    const close = () => {
        if (width <= 1024) setIsOpen(false);
    };

    const {
        routes: { admin },
    } = useConfig();

    return (
        <nav className={`navbar-wrapper relative ${isOpen ? 'open' : ''}`}>
            <Helmet>
                <link href={favicon} rel="icon" type="image/svg+xml" data-react-helmet="true" />
                <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
            </Helmet>
            <header>
                <button
                    className="flex px-5 py-1 bg-slate-100 rounded-3xl shadow-[0_4px_4px_0_rgba(0,0,0,.25)] relative dark:bg-slate-800"
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                >
                    
                    <Caret
                        className={`w-5 h-5 ${isOpen ? 'rotate-90' : '-rotate-90'
                            } -ml-1 transition-transform`}
                    />
                </button>

                <img
                    className={`side-nav-logo ${isOpen ? 'open' : ''}`}
                    src={isOpen ? logo?.src : icon?.src}
                    alt={logo?.alt}
                />
            </header>

            <section>
                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/credential-batch"
                    onClick={close}
                >
                    <img src={ListChecks} alt="credential-batch" />{' '}
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Send Credentials
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/credential"
                    onClick={close}
                >
                    <img src={FileCheck} alt="credential" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Find Credentials
                    </span>
                </NavLink>


                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/membership-batch"
                    onClick={close}
                >
                    <img src={MembershipBatches} alt="users" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                       Send Membership IDs
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/membership"
                    onClick={close}
                >
                    <img src={Memberships} alt="users" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Find Memberships IDs
                    </span>
                </NavLink>

                {isOpen &&
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4 text-gray-400">Management</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                }
                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/users"
                    onClick={close}
                >
                    <img src={Users} alt="users" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Users
                    </span>
                </NavLink>
                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/tenants"
                    onClick={close}
                >
                    <img src={Users} alt="tenants" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Tenants
                    </span>
                </NavLink>

                {isOpen &&
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4 text-gray-400">Configuration</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                }

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/credential-template"
                    onClick={close}
                >
                    <img src={FileEdit} alt="credential-template" />{' '}
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Credential Templates
                    </span>
                </NavLink>
                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/membership-template"
                    onClick={close}
                >
                    <img src={MembershipTemplates} alt="users" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Membership Templates
                    </span>
                </NavLink>
                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/email-template"
                    onClick={close}
                >
                    <img src={MailPlus} alt="email-template" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Email Templates
                    </span>
                </NavLink>
            </section>

            <footer className="flex flex-col gap-8">
                <section>
                    <Link
                        to={`${admin}/account`}
                        className={`flex justify-center transition-[gap] ${isOpen ? 'gap-5' : 'gap-0'
                            }`}
                        onClick={close}
                    >
                        <Account className="w-15 h-15 border border-slate-50 rounded-full shadow-fours" />
                        <section className="flex flex-col">
                            <p
                                className={`text-start m-0 transition-[font-size] font-inter text-lg font-medium ${isOpen ? '' : 'text-zero'
                                    }`}
                            >
                                {user.name}
                            </p>
                            <p
                                className={`text-start text-base m-0 transition-[font-size] ${isOpen ? '' : 'text-zero'
                                    }`}
                            >
                                {user.email}
                            </p>
                        </section>
                    </Link>
                </section>

                <section>
                    <Logout
                        onClick={close}
                        className={`flex justify-center transition-[gap] ${isOpen ? 'gap-2' : 'gap-0'
                            }`}
                        textClassName={`text-xl transition-[font-size] ${isOpen ? '' : 'text-zero'
                            }`}
                    />
                </section>
            </footer>
        </nav>
    );
};

export default SideNav;
