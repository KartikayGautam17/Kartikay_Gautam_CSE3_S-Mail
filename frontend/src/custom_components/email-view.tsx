import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import axios from "axios";

const EmailView = () => {
  const navigate = useNavigate();
  const [_emailId, setEmailId] = useState<undefined | string | null>(null);
  const [emailContent, setEmailContent] = useState<string>("<html></html>");
  if (_emailId === null) {
    const { emailId } = useParams();
    setEmailId(emailId);
  }
  useEffect(() => {
    if (_emailId === null) return;
    const newTab = window.open(
      `https://mail.google.com/mail/u/0/#inbox/${_emailId}`,
      "_blank"
    );
    // navigate(`https://mail.google.com/mail/u/0/#inbox/${_emailId}`, {
    //   replace: true,
    // });
    axios
      .post(import.meta.env.VITE_API_BASE_URL + `/fetch/mail/${_emailId}`, {})
      .then((res) => {
        const data = res.data;
        console.log(data);
        setEmailContent(data);
      });
  }, [_emailId]);
  return (
    <div>
      <div>EmailView</div>
      <div>{_emailId}</div>
      <div
        className=" max-w-[500px]"
        dangerouslySetInnerHTML={{ __html: emailContent }}
      ></div>
    </div>
  );
};

export default EmailView;
