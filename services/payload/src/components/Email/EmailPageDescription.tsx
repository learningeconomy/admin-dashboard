import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";

const EmailPageDescription: React.FC = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();

  return (
    <div>
      <Link
        className="header_button"
        activeClassName="active"
        to={`${adminRoute}/collections/email-template/create`}
      >
        Create New Template
      </Link>
    </div>
  );
};

export default EmailPageDescription;
