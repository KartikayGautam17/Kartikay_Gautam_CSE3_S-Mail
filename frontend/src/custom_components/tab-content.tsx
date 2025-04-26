import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Archive, Clock, Trash2, Mail, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmailProps } from "@/utils";

const EmailsTab = ({
  name,
  emails,
  setHoveredEmail,
  toggleStar,
  starredEmails,
  hoveredEmail,
  onClick,
  indexList,
}: {
  onClick: (id: string) => void;
  name: string;
  emails: EmailProps[] | null;
  setHoveredEmail: (id: string | null) => void;
  toggleStar: (id: string) => void;
  starredEmails: string[];
  hoveredEmail: string | null;
  indexList?: number[];
}) => {
  if (emails?.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No emails in {name}</div>
      </div>
    );
  }
  return (
    <>
      {indexList && indexList.length > 0 && emails
        ? indexList.map((value) => {
            return (
              <ContextMenu key={emails[value].id}>
                <ContextMenuTrigger>
                  <div
                    className="flex items-center p-2 hover:bg-accent cursor-pointer w-full"
                    onMouseEnter={() => setHoveredEmail(emails[value].id)}
                    onMouseLeave={() => setHoveredEmail(null)}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(emails[value].id);
                      }}
                    >
                      {starredEmails.includes(emails[value].id) ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>

                    <div
                      className="flex-1 justify-normal"
                      onClick={() => {
                        onClick(emails[value].id);
                      }}
                    >
                      <div className="font-bold">{emails[value].from}</div>
                      <div className="font-normal text-sm">
                        {emails[value].subject}{" "}
                      </div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {/* {emails[value].snippet.replace("  ", " ").length > 197
                      ? emails[value].snippet.replace("  ", " ").substring(0, 197)
                      : emails[value].snippet.replace("  ", " ")}
                    ... */}
                        {emails[value].snippet}...
                      </div>
                    </div>

                    {
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Archive</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Snooze</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Unread</TooltipContent>
                        </Tooltip>
                      </div>
                    }
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Archive</ContextMenuItem>
                  <ContextMenuItem>Mark as unread</ContextMenuItem>
                  <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        : emails?.map((email) => {
            return (
              <ContextMenu key={email.id}>
                <ContextMenuTrigger>
                  <div
                    className="flex items-center p-2 hover:bg-accent cursor-pointer w-full"
                    onMouseEnter={() => setHoveredEmail(email.id)}
                    onMouseLeave={() => setHoveredEmail(null)}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                    >
                      {starredEmails.includes(email.id) ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>

                    <div
                      className="flex-1 justify-normal"
                      onClick={() => {
                        onClick(email.id);
                      }}
                    >
                      <div className="font-bold">{email.from}</div>
                      <div className="font-normal text-sm">
                        {email.subject}{" "}
                      </div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {/* {email.snippet.replace("  ", " ").length > 197
                      ? email.snippet.replace("  ", " ").substring(0, 197)
                      : email.snippet.replace("  ", " ")}
                    ... */}
                        {email.snippet}...
                      </div>
                    </div>

                    {
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Archive</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Snooze</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Unread</TooltipContent>
                        </Tooltip>
                      </div>
                    }
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Archive</ContextMenuItem>
                  <ContextMenuItem>Mark as unread</ContextMenuItem>
                  <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
    </>
  );
};

export default EmailsTab;
