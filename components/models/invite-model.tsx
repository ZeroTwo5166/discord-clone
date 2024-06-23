"use client";
import { useModel } from "@/hooks/use-model-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

const InviteModel = () => {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const origin = useOrigin();

  const isModelOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#1e1f22] text-black dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-left font-bold">
            <img
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              className="object-cover mb-4"
            />
            Invite people to{" "}
            <span className="text-indigo-500">{server?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-800 dark:text-zinc-400">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 dark:bg-zinc-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon" className="">
              {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="link"
            onClick={onNew}
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModel;
