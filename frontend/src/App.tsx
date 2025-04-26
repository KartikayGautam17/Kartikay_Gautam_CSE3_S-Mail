import { useEffect, useState } from "react";
import { Navbar } from "@/custom_components/navbar";
import { Sidebar } from "@/custom_components/sidebar";
import { InboxScreen } from "@/screens/inbox-screen";
import { SentScreen } from "@/screens/sent-screen";
import { DraftsScreen } from "@/screens/drafts-screen";
import { SpamScreen } from "@/screens/spam-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import EmailView from "./custom_components/email-view";
import { useNavigate } from "react-router-dom";
import { TrashScreen } from "./screens/trash-screen";
export default function App({
  email,
  view,
}: {
  email?: boolean;
  view?: string;
}) {
  const [indexList, setIndexList] = useState<number[]>([]);
  const navigate = useNavigate();
  const navigateTo = (path: string) => {
    navigate(path);
  };
  const [userProfile, setUserProfile] = useState<{
    name: string | null;
    email: string | null;
    image: string | null;
  }>({ name: null, email: null, image: null });

  const [isAuth, setIsAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const ToggleSidbar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/auth/login", {})
      .then((val) => {
        setIsAuth(true);
        setUserProfile({
          name: val.data.name,
          email: val.data.email,
          image: val.data.photo,
        });
      });
  }, []);
  if (!isAuth) {
    return <div>loading...</div>;
  }
  const getViewScreen = (view: string) => {
    switch (view) {
      case "sent":
        return <SentScreen />;
      case "drafts":
        return <DraftsScreen />;
      case "spam":
        return <SpamScreen />;
      case "trash":
        return <TrashScreen />;
      default:
        return <InboxScreen />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen" {...userProfile}>
        <Navbar ToggleSidebar={ToggleSidbar} {...userProfile} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            navigate={navigateTo}
            activeTab={view}
            indexList={indexList}
            setIndexList={setIndexList}
          />
          {email ? (
            <EmailView />
          ) : view ? (
            getViewScreen(view)
          ) : (
            <InboxScreen indexList={indexList} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
