"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";

import { useModel } from "@/hooks/use-model-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  Check,
  Crown,
  UserMinusIcon,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import qs from "query-string";
import { useRouter } from "next/navigation";
import axios from "axios";


const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  CREATOR: <Crown className="h-4 w-4 text-yellow-500" />
};

// Define role hierarchy
const roleHierarchy = {
  CREATOR: 4,
  ADMIN: 3,
  MODERATOR: 2,
  GUEST: 1
};

const MembersModel = () => {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const [loadingId, setLoadingId] = useState("");

  const isModelOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const router = useRouter();
  const memberRef = useRef(null);


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
        console.log(data)
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update memberRef when profile or data changes
  useEffect(() => {
    if (server?.members && profile) {
      const foundMember = server.members.find(
        (mbm) => mbm.profileId === profile.id
      );
      if (foundMember) {
        console.log("FOUND;;;", foundMember.role);
        memberRef.current = foundMember;
        setRenderKey((prevKey) => prevKey + 1); // Force re-render
      }
    }
  }, [data, profile]);

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  // Function to check if the current user has a higher role than the member
  const hasHigherRole = (currentRole: MemberRole, memberRole: MemberRole) => {
    return roleHierarchy[currentRole] > roleHierarchy[memberRole];
  };

    // Function to check if the current user is a moderator
    const isModerator = (role:MemberRole) => {
      return role === "MODERATOR";
    };

  return (
    <Dialog open={isModelOpen && type === "members"} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#1e1f22] text-black dark:text-white overflow-hidden">
        <DialogHeader className="pt-4 px-2">
          <DialogTitle className="text-2xl text-left font-bold">
            <img
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              className="object-cover mb-2"
            />
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-left text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.creatorId !== member.profileId &&
                loadingId !== member.id &&
                member.profileId !== profile?.id && // Hide dropdown for current user
                hasHigherRole(memberRef.current?.role, member.role) && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                      {!isModerator(memberRef.current?.role) && ( // Show role options only for non-moderators
                        <>
                                                <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {memberRef.current?.role === "CREATOR" && (

                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      onRoleChange(member.id, "ADMIN");
                                    }}
                                  >
                                    <ShieldAlert className="h-4 w-4 mr-2" />
                                    ADMIN
                                    {member.role === "ADMIN" && (
                                      <Check className="h-4 w-4 text-green-600 ml-2" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onRoleChange(member.id, "MODERATOR")}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="h-4 w-4 text-green-600 ml-2" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onRoleChange(member.id, "GUEST")}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="h-4 w-4 text-green-600 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </>

                              )}
                              {memberRef.current?.role === "ADMIN" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => onRoleChange(member.id, "MODERATOR")}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="h-4 w-4 text-green-600 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onRoleChange(member.id, "GUEST")}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="h-4 w-4 text-green-600 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        
                        </>
                      )}

                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <UserMinusIcon className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModel;

/*
 <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 text-green-600 ml-auto" />
                                )}
                              </DropdownMenuItem>
                                    <DropdownMenuItem
                                    onClick={() => {
                                      onRoleChange(member.id, "MODERATOR");
                                    }}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="h-4 w-4 text-green-600 ml-2" />
                                    )}
                                  </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => {
                                  onRoleChange(member.id, "ADMIN");
                                }}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                ADMIN
                                {member.role === "ADMIN" && (
                                  <Check className="h-4 w-4 text-green-600 ml-2" />
                                )}
                              </DropdownMenuItem> 
                              
                              ----------------------------
                              
                                                     {memberRef.current?.role === "MODERATOR" && (
                                <DropdownMenuItem
                                  onClick={() => onRoleChange(member.id, "GUEST")}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              )}       
                              
                              ------------------------
                              
                              
                              
                                                          <DropdownMenuSubContent>
                              {server?.members?.map((members) => {
                                if (members.role === "MODERATOR") {
                                  return (
                                    <DropdownMenuItem
                                      onClick={() => onRoleChange(member.id, "GUEST")}
                                    >
                                      <Shield className="h-4 w-4 mr-2" />
                                      Guest
                                      {member.role === "GUEST" && (
                                        <Check className="h-4 w-4 text-green-600 ml-auto" />
                                      )}
                                    </DropdownMenuItem>
                                  );
                                }
                                else if (members.role === "ADMIN") {
                                  return (
                                    <>
                                      <DropdownMenuItem
                                      onClick={() => {
                                        onRoleChange(member.id, "MODERATOR");
                                      }}
                                      >
                                      <ShieldCheck className="h-4 w-4 mr-2" />
                                      Moderator
                                      {member.role === "MODERATOR" && (
                                        <Check className="h-4 w-4 text-green-600 ml-2" />
                                      )}
                                    </DropdownMenuItem>
                                    </>
                                  );
                                }
                                else if(members.role ="CREATOR"){
                                  return(<>
                                  <DropdownMenuItem
                                      onClick={() => {
                                        onRoleChange(member.id, "ADMIN");
                                      }}
                                      >
                                      <Crown className="h-4 w-4 mr-2" />
                                      Admin
                                      {member.role === "ADMIN" && (
                                        <Check className="h-4 w-4 text-green-600 ml-2" />
                                      )}
                                    </DropdownMenuItem>                                                        
                                  </>)
                                }                               
                              })}
                            </DropdownMenuSubContent>
                              
                              
                              
                              
                              
                              
                              
                              
                              
                              
                              */