import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";

const EmailPageDescription: React.FC = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();

  const sendTestEmail=async()=>{
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({message:'test message'}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
      });
      if (res.status === 200) {
        const { data } = await res.json();
  
        console.log("///send test email", data);
      }
  
  }


  const handleSendTestEmail=()=> {
    sendTestEmail();
  }

  return (
    <div>
      <Link
        className="header_button"
        activeClassName="active"
        to={`${adminRoute}/collections/email-template/create`}
      >
        Create New Template
      </Link>

      <button onClick={handleSendTestEmail}>Send Test Email</button>
    </div>
  );
};

export default EmailPageDescription;
