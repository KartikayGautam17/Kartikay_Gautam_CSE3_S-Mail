import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Inbox,
  Send,
  DraftingCompassIcon as Drafts,
  Trash,
  TagIcon as Label,
  Plus,
  Sparkles,
  MessageCircleWarningIcon as Spam,
} from "lucide-react";
import axios from "axios";
import AiContentCard from "./AiContentCard";

export function Sidebar({
  isOpen,
  navigate,
  activeTab = "inbox",
  indexList,
  setIndexList,
}: {
  activeTab?: string;
  isOpen: boolean;
  navigate: Function;
  indexList: number[];
  setIndexList: Function;
}) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(true);
  const [aiContent, setAiContent] = useState<any>("");
  const labels = [
    { name: "Inbox", icon: Inbox, onClick: () => navigate("/inbox") },
    { name: "Sent", icon: Send, onClick: () => navigate("/sent") },
    { name: "Drafts", icon: Drafts, onClick: () => navigate("/drafts") },
    { name: "Trash", icon: Trash, onClick: () => navigate("/trash") },
    { name: "Spam", icon: Spam, onClick: () => navigate("/spam") },
  ];

  const DemoAIContent = {
    Priority: [2, 3, 0, 8, 7, 9, 1, 4, 5, 6],
    VeryImportant: [2, 3, 0, 8],
    Important: [7, 9],
    Ordinary: [1, 4, 5, 6],
    Summary:
      "This collection of email snippets provides a diverse glimpse into a typical primary inbox. Several messages pertain to financial matters, specifically concerning an HDFC bank account, with notifications about inactivity and the deduction of non-maintenance charges. There are also announcements for upcoming programming contests hosted on AtCoder, indicating an interest in competitive coding. Furthermore, the inbox contains job recruitment notifications for Railway Recruitment Board (RRB) and National Thermal Power Corporation (NTPC), suggesting potential job-seeking activity. Beyond these, there's a monthly newsletter from Privy, a platform focused on crypto products, and a notification from Kenneth Acoustic about a new post for paid subscribers, highlighting engagement with online content creators and communities.",
    Emails: [
      {
        id: 0,
        snippet:
          "Gmail-Handler was granted access to your Google Account kartikaygautam24617@gmail.com If you did not grant access, you should check this activity and secure your account. Check activity You can also",
      },
      {
        id: 1,
        snippet:
          "Dear Kartikay Gautam, We&#39;re reaching out to inform you about your HDFC Bank account XXXXXXXXXX3400. We wish to bring to your attention that no transactions have been initiated in this account",
      },
      {
        id: 2,
        snippet:
          "We will hold AtCoder Grand Contest 072. This contest counts for GP30 scores. Contest URL: https://atcoder.jp/contests/agc072 Start Time: http://www.timeanddate.com/worldclock/fixedtime.html?iso=",
      },
      {
        id: 3,
        snippet:
          "Web-version Dear Customer, We would like to inform you that your account no. XXX3400 has been debited with non-maintenance charges of ₹300 + GST for MAR-25, as the required balance was not maintained.",
      },
      {
        id: 4,
        snippet:
          "Web-version Dear Customer, We would like to inform you that your account no. XXX3400 has been debited with non-maintenance charges of ₹300 + GST for MAR-25, as the required balance was not maintained.",
      },
      {
        id: 5,
        snippet:
          "We will hold Tokio Marine &amp; Nichido Fire Insurance Programming Contest 2025 (AtCoder Beginner Contest 402). - Contest URL: https://atcoder.jp/contests/abc402 - Start Time: http://www.timeanddate.",
      },
      {
        id: 6,
        snippet:
          "A way to keep up with the latest changes Privy has to offer! Welcome back to Privy Monthly! We build so you can craft better products on crypto rails. In case you missed it, here are our most notable",
      },
      {
        id: 7,
        snippet:
          "Kenneth Acoustic New post: &quot;Please Give Your Song Suggestions&quot; Kenneth Acoustic just shared a new post for paid members. To view the post and get access to exclusive benefits, upgrade your",
      },
      {
        id: 8,
        snippet:
          "RRB Recruitment 2025 RRB Assistant Loco Pilot 2025 job notification, candidates who completed... More Details &gt;&gt; If you do not want to receive emails from us click here to unsubscribe.",
      },
      {
        id: 9,
        snippet:
          "Dear Investor, With reference to NSE circulars NSE/INSP/46704 dated December 17, 2020, and NSE/INSP/55039 dated December 28, 2022, Trading members are required to upload clients&#39; securities balance",
      },
    ],
  };

  const AnalyzeWithAI = async () => {
    await axios
      .post(import.meta.env.VITE_API_BASE_URL + "/analyze", {})
      .then((res) => {
        setAiContent(res.data);
        console.log(res.data);
        setIsAnalysing(false);
      });
    // setIsAnalysing(false);
  };

  return (
    <div
      className={`${
        isOpen
          ? " w-64 h-full bg-background border-r p-4  "
          : "w-0 p-0 overflow-hidden"
      } transition-all duration-300 `}
    >
      {/* <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mb-4">
            <Plus className=" h-4 w-4" />
            Compose
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="To" />
            <Input placeholder="Subject" />
            <div
              className="border rounded-md p-2 h-40 overflow-y-auto whitespace-pre-wrap"
              contentEditable
            ></div>
            <Button>Send</Button>
          </div>
        </DialogContent>
      </Dialog> */}
      <div className="space-y-2">
        {labels.map((label) => (
          <Button
            key={label.name}
            variant="ghost"
            className={`w-full justify-start ${
              label.name.toLowerCase() === activeTab
                ? "bg-gray-600 text-white"
                : ""
            }`}
            onClick={label.onClick}
          >
            <label.icon className="mr-2 h-4 w-4" />
            {label.name}
          </Button>
        ))}
        <div className="spacy-y-2"></div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => {
                AnalyzeWithAI();
              }}
            >
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Analyze with AI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isAnalysing ? <p>Analyzing...</p> : <p>Analysis</p>}
              </DialogTitle>
            </DialogHeader>
            {isAnalysing ? (
              <div className="flex justify-center items-center h-20">
                <Sparkles className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div>
                <AiContentCard
                  content={aiContent}
                  indexList={indexList}
                  setIndexList={setIndexList}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* <Button className="w-full mt-4" variant="outline" onClick={() => {}}>
          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
          Analyze with AI
        </Button> */}
      </div>
    </div>
  );
}
