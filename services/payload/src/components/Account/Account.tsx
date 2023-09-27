import React from 'react';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Gravatar from './Gravatar';

import './account.scss';

const Default: React.FC = () => (
    <svg
        className="graphic-account"
        width="25"
        height="25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
    >
        <circle className="circle1" cx="12.5" cy="12.5" r="11.5" />
        <circle className="circle2" cx="12.5" cy="10.73" r="3.98" />
        <path d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z" />
    </svg>
);

const Account = () => {
    const {
        admin: { avatar: Avatar },
    } = useConfig();
    const { user } = useAuth();

    if (!user.email || Avatar === 'default') return <Default />;
    if (Avatar === 'gravatar') return <Gravatar />;
    if (Avatar) return <Avatar />;

    return <Default />;
};

export default Account;
