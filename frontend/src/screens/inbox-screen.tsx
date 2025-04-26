import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmailsTab from "../custom_components/tab-content";
import { MailsLoaderIcon } from "../custom_components/mails-loader-icon";
import { EmailProps } from "@/utils";

export function InboxScreen({ indexList }: { indexList?: number[] }) {
  const navigate = useNavigate();
  const navigateToEmail = (id: string) => {
    navigate(`/email/${id}`);
  };
  const [primaryEmails, setPrimaryEmails] = useState<EmailProps[] | null>(null);
  const [promotionEmails, setPromotionEmails] = useState<EmailProps[] | null>(
    null
  );
  const [socialEmails, setSocialEmails] = useState<EmailProps[] | null>(null);
  const [updatesEmails, setUpdatesEmails] = useState<EmailProps[] | null>(null);
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [starredEmails, setStarredEmails] = useState<string[]>([]);
  useEffect(() => {
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/fetch/primary")
      .then((value) => {
        setPrimaryEmails(value.data);
      });
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/fetch/updates")
      .then((value) => {
        setUpdatesEmails(value.data);
      });
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/fetch/social")
      .then((value) => {
        setSocialEmails(value.data);
      });

    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/fetch/promotion")
      .then((value) => {
        setPromotionEmails(value.data);
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
      <Tabs defaultValue="primary" className="w-full">
        <TabsList className="w-full flex justify-between mb-4 rounded-none">
          <TabsTrigger value="primary" className="flex-1 mx-8">
            Primary
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex-1 mx-8">
            Promotions
          </TabsTrigger>
          <TabsTrigger value="social" className="flex-1 mx-8">
            Social
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex-1 mx-8">
            Updates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="primary" className="space-y-2">
          {primaryEmails === null ? (
            <MailsLoaderIcon />
          ) : (
            <EmailsTab
              name="primary"
              emails={primaryEmails}
              indexList={indexList}
              {...EmailUtility_fn}
              onClick={navigateToEmail}
            />
          )}
        </TabsContent>
        <TabsContent value="promotions" className="space-y-2">
          {promotionEmails === null ? (
            <MailsLoaderIcon />
          ) : (
            <EmailsTab
              onClick={navigateToEmail}
              name="promotions"
              emails={promotionEmails}
              {...EmailUtility_fn}
            />
          )}
        </TabsContent>
        <TabsContent value="social" className="space-y-2">
          <EmailsTab
            name="social"
            emails={socialEmails}
            {...EmailUtility_fn}
            onClick={navigateToEmail}
          />
        </TabsContent>
        <TabsContent value="updates" className="space-y-2">
          {updatesEmails === null ? (
            <MailsLoaderIcon />
          ) : (
            <EmailsTab
              onClick={navigateToEmail}
              name="updates"
              emails={updatesEmails}
              {...EmailUtility_fn}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
