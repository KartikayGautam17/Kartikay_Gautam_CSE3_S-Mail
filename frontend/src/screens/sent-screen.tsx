import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmailsTab from "../custom_components/tab-content";
import { MailsLoaderIcon } from "../custom_components/mails-loader-icon";
import { EmailProps } from "@/utils";

export function SentScreen() {
  const navigate = useNavigate();
  const navigateToEmail = (id: string) => {
    navigate(`/email/${id}`);
  };
  const [sentEmails, setSentEmails] = useState<EmailProps[] | null>(null);
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [starredEmails, setStarredEmails] = useState<string[]>([]);
  useEffect(() => {
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/fetch/sent")
      .then((value) => {
        setSentEmails(value.data);
      });
  }, []);
  const toggleStar = (id: string) => {
    setStarredEmails((prev) =>
      prev.includes(id)
        ? prev.filter((emailId) => emailId !== id)
        : [...prev, id]
    );
  };
  const EmailUtility_fn = {
    hoveredEmail,
    setHoveredEmail,
    toggleStar,
    starredEmails,
    setStarredEmails,
  };
  return (
    <div className="flex-1 overflow-auto">
      {sentEmails === null ? (
        <MailsLoaderIcon />
      ) : (
        <EmailsTab
          name="Sent"
          emails={sentEmails}
          {...EmailUtility_fn}
          onClick={navigateToEmail}
        />
      )}
    </div>
  );
}
