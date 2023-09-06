import React, { useState } from 'react';
import './SideNav.scss';
import { Link, useHistory } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';


import { Icon } from '../Icon';

const SideNav: React.FC = () => {
    const [activeButton, setActiveButton] = useState('');
    const [navbarOpen, setNavbarOpen] = useState(false);
    const history = useHistory();
    const baseClass = 'nav';
    const { user } = useAuth();

    const {
        routes: {
          admin,
        },
      } = useConfig();

    const handleClick = (e) => {
        if ((history?.location?.pathname.includes(`admin/account`))) {
            setActiveButton('');
        }
        setActiveButton(e.currentTarget.firstChild.alt);
        if (history?.location?.pathname.includes(`admin/collections`)) {
            history.push(`${e.currentTarget.firstChild.alt}?limit=10`);
        } else if (history?.location?.pathname.includes(`admin/`)) {
            history.push(`collections/${e.currentTarget.firstChild.alt}?limit=10`)
        } else {
            history.push(`admin/collections/${e.currentTarget.firstChild.alt}?limit=10`);
        }
    };

  return (
    <div className={!navbarOpen ? "navbar-wrapper closed" : "navbar-wrapper open"}>
        <button className="navbar-chevron-button" onClick={() => {setNavbarOpen(!navbarOpen)}}>
            {!navbarOpen ? <><img src="/assets/chevron-left.svg" alt="chevron left"/><img className="chevron-right" src="/assets/chevron-left.svg" alt="chevron right"/></> :
            <><img className="chevron-right navbar-open-chevron" src="/assets/chevron-left.svg" alt="chevron right"/><img src="/assets/chevron-left.svg" alt="chevron left"/></> }
        </button>
        {!navbarOpen ?
        <> 
            <div className="navbar-icon-wrapper">
                <Icon />
            </div>
            <div className="navbar-buttons-wrap">
                <button className={activeButton === 'credential-batch' ? "navbar-buttons active" : "navbar-buttons"} onClick={handleClick}>
                    <img src="/assets/list-checks.svg" alt="credential-batch"/>
                </button>
                <button className={activeButton === 'credential' ? "navbar-buttons active" : "navbar-buttons"}  onClick={handleClick}>
                    <img src="/assets/file-check.svg" alt="credential"/>
                </button>
                <button className={activeButton === 'credential-template' ? "navbar-buttons active" : "navbar-buttons"} onClick={handleClick}>
                    <img src="/assets/file-edit.svg" alt="credential-template"/>
                </button>
            </div>
            <div className='navbar-closed-user-wrapper'>
                <Link
                to={`${admin}/account`}
                className={`${baseClass}__account`}
                onClick={handleClick}
                >
                <Account />
                </Link>
                <Logout />
            </div> 
        </> :
        <> 
            <div className="navbar-open-icon-wrapper">
                <img src="/assets/tdm-alt-logo.png" alt="Tec de Monterray logo"/>
            </div>
            <div className="navbar-buttons-wrap">
                <button className={activeButton === 'credential-batch' ? "navbar-open-buttons active" : "navbar-open-buttons"} onClick={handleClick}>
                    <img src="/assets/list-checks.svg" alt="credential-batch"/> Issuance Overview
                </button>
                <button className={activeButton === 'credential' ? "navbar-open-buttons active" : "navbar-open-buttons"} onClick={handleClick}>
                    <img src="/assets/file-check.svg" alt="credential"/> Credentials
                </button>
                <button className={activeButton === 'credential-template' ? "navbar-open-buttons active" : "navbar-open-buttons"} onClick={handleClick}>
                    <img src="/assets/file-edit.svg" alt="credential-template"/> Credential Templates
                </button>
            </div>
            <div className='navbar-open-user-wrapper'>
                <div className='navbar-open-user'>
                    <Link
                    to={`${admin}/account`}
                    className={`${baseClass}__account`}
                    onClick={handleClick}
                    >
                    <Account /> 
                    </Link>
                    <p>{user.email}</p>
                </div>
                <div className='navbar-open-logout-wrapper'>
                    <Logout /> 
                    <p>Logout</p>
                </div>
            </div>   
        </>
        }
    </div>
  );
};

export default SideNav;