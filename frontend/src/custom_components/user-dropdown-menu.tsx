import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconLogout2, IconMail } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function UserDropdown({
  name,
  image,
  email,
}: {
  name: string | null;
  email: string | null;
  image: string | null;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const SignOut = async () => {
    setDisabled(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/auth/logout",
        {}
      );
      const data: { error?: string; success: boolean; message?: string } =
        res.data;
      if (res) {
        navigate("/");
      } else {
        alert("error in loggin out " + data.error);
      }
      setDisabled(false);
    } catch (error) {
      console.log(error);
      setDisabled(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={image as string}
              alt={name ? name : ""}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>{name ? name[0] : ""}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between space-x-2 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground text-center w-full">
            {email}
          </p>
          <Button
            variant="ghost"
            className="h-4 w-4 p-0"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={image as string}
              alt={name ? name : ""}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>{name ? name[0] : ""}</AvatarFallback>
          </Avatar>
          <p className="text-lg font-medium leading-none">Hi, {name}!</p>
        </div>
        <div className="p-2">
          <DropdownMenuItem className="w-full flex justify-center p-0 mx-auto">
            <Button variant="outline" className="w-full p-2">
              <IconMail /> Gmail
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center p-0 m-2 w-full mx-auto ">
            <Button
              disabled={disabled}
              className="w-full h-full p-2 "
              variant={"outline"}
              onClick={SignOut}
            >
              {disabled ? (
                <IconLoader2 className="animate-spin" />
              ) : (
                <IconLogout2 />
              )}
              {disabled ? "" : <span>Logout</span>}
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
