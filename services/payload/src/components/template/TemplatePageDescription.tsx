import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";

const TemplatePageDescription: React.FC = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();

  return (
    <div>
      <Link
        className="header_button"
        activeClassName="active"
        to={`${adminRoute}/collections/credential-template/create`}
      >
        Create New Template
      </Link>
    </div>
  );
};

export default TemplatePageDescription;
