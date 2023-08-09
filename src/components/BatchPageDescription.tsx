import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";

const BatchPageDescription: React.FC = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();

  return (
    <div>
      <p>25 Issued Batches</p>
      <Link
        className="header_button"
        activeClassName="active"
        to={`${adminRoute}/createbatch`}
      >
        Create New Batch
      </Link>
    </div>
  );
};

export default BatchPageDescription;
