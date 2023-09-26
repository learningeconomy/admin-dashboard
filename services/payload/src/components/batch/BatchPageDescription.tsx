import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";

const BatchPageDescription: React.FC = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();

  return (
    <div>
      <div className="header_wrapper">
        <p className="header_paragraph"><span className="header_number">25</span> Issued Batches</p>
        <Link
          className="header_button"
          activeClassName="active"
          to={`${adminRoute}/collections/credential-batch/create`}
        >
          <img className="header_plus_icon" src="/assets/plus-icon.svg" alt="plus icon"/>Upload and Prepare Batch
        </Link>
      </div>
    </div>
  );
};

export default BatchPageDescription;
