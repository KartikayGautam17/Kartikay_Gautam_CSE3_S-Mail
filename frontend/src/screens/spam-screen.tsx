import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmailsTab from "../custom_components/tab-content";
import { MailsLoaderIcon } from "../custom_components/mails-loader-icon";
import { EmailProps } from "@/utils";

export function SpamScreen() {
  const navigate = useNavigate();
  const navigateToEmail = (id: string) => {
    navigate(`/email/${id}`);
  };
  const [spamEmails, setSpamEmails] = useState<EmailProps[] | null>(null);
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [starredEmails, setStarredEmails] = useState<string[]>([]);
  useEffect(() => {
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/fetch/spam")
      .then((value) => {
        setSpamEmails(value.data);
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
      {spamEmails === null ? (
        <MailsLoaderIcon />
      ) : (
        <EmailsTab
          name="Spam"
          emails={spamEmails}
          {...EmailUtility_fn}
          onClick={navigateToEmail}
        />
      )}
    </div>
  );
}
