import React from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from "react-router-dom";
import './EmailPageDescription.scss';

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
    <div className="header_wrapper">
      <p className="header_paragraph"><span className="header_number">2</span> Published Templates</p>
      <Link
        className="header_template_button"
        activeClassName="active"
        to={`${adminRoute}/collections/email-template/create`}
      >
        <img className="plus_icon" src="/assets/plus-icon.svg" alt="plus icon"/>Create New Template
      </Link>
       <h2>TEST2</h2>
      <button onClick={handleSendTestEmail}>Send Test Email</button>
    </div>
  );
};

export default EmailPageDescription;
