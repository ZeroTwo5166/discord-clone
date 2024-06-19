"use client"
import { useModel } from "@/hooks/use-model-store";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


const InviteModel = () => {
    const { onOpen, isOpen, onClose, type, data} = useModel();
    const origin = useOrigin();

    const isModelOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied,setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(()=>{
            setCopied(false);
        }, 1000)
    }

    const onNew = async() => {
        try {
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite", { server: response.data})
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    return (  
        <Dialog open={isModelOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite people
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold
                     text-zinc-500 dark:text-secondary/70">
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading}
                        className="bg-zinc-300/50 border-0
                         focus-visible:ring-0 text-black
                         focus-visible:ring-offset-0"
                         value={inviteUrl}/>
                        <Button disabled={isLoading} onClick={onCopy} size="icon"> 
                        {copied? <Check/> : <Copy className="w-4 h-4"/>
                        }
                        </Button>
                    </div>
                    <Button disabled={isLoading}
                     variant="link"
                     onClick={onNew}
                     size="sm"
                     className="text-xs text-zinc-500 mt-4">
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
 
export default InviteModel;