import { Button } from "@/components/ui/button";
import { useState } from "react";

const AiContentCard = ({
  content,
  indexList,
  setIndexList,
}: {
  content: {
    Important: number[];
    Ordinary: number[];
    Summary: string;
    VeryImportant: number[];
    Priority: number[];
    Emails: { id: number; snippet: string }[];
  };
  indexList: number[];
  setIndexList: Function;
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const priortize = () => {
    console.log("Priortize clicked");
    setDisabled(true);
    setIndexList(content.Priority);
    // Add your logic for prioritizing emails here
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}
    >
      <h2>Summary</h2>
      <p>{content.Summary}</p>
      <h3>Details</h3>
      <ul>
        <li>
          <strong>Important:</strong> {content.Important.length} E-Mails
        </li>
        <li>
          <strong>Ordinary:</strong> {content.Ordinary.length} E-Mails
        </li>
        <li>
          <strong>Very Important:</strong> {content.VeryImportant.length}{" "}
          E-Mails
        </li>
      </ul>
      <div className="flex items-center justify-center">
        <Button
          onClick={priortize}
          disabled={isDisabled}
          className="mt-4 w-full"
        >
          {isDisabled ? "Prioritized" : "Prioritize"}
        </Button>
      </div>
    </div>
  );
};

export default AiContentCard;
