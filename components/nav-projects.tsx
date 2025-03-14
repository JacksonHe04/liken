"use client"

import { useEffect, useState } from "react"
import {
  Bot,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { chatDB } from "@/lib/db/chat-db"

interface Session {
  id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

export function NavProjects() {
  const { isMobile } = useSidebar()
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const sessionList = await chatDB.listSessions(20);
      setSessions(sessionList);
    };
    loadSessions();

    // 每30秒刷新一次会话列表
    const interval = setInterval(loadSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Sessions</SidebarGroupLabel>
      <SidebarMenu>
        {sessions.map((session) => (
          <SidebarMenuItem key={session.id}>
            <SidebarMenuButton asChild>
              <a href={`/chat/${session.id}`}>
                <Bot />
                <span>
                  {session.messages[0]?.content.slice(0, 20) || '新会话'}
                  {session.messages[0]?.content.length > 20 ? '...' : ''}
                </span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={async () => {
                  await chatDB.deleteSession(session.id);
                  setSessions(sessions.filter(s => s.id !== session.id));
                }}>
                  <Trash2 className="text-muted-foreground" />
                  <span>删除会话</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
