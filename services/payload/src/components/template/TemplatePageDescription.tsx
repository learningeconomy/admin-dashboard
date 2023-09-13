import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";
import './template.scss';

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
        <img className="plus_icon" src="/assets/plus-icon.svg" alt="plus icon"/>Create New Template
      </Link>
    </div>
  );
};

export default TemplatePageDescription;
