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

// 定义会话接口
interface Session {
  id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

// 导出NavProjects组件
export function NavProjects() {
  const { isMobile } = useSidebar() // 获取是否为移动设备的状态
  const [sessions, setSessions] = useState<Session[]>([]); // 定义会话状态

  useEffect(() => {
    // 异步加载会话
    const loadSessions = async () => {
      const sessionList = await chatDB.listSessions(30); // 从数据库获取会话列表
      // console.log('Loaded sessions:', sessionList); // 添加日志输出
      setSessions(sessionList); // 更新会话状态
    };
    loadSessions();

    // 每30秒刷新一次会话列表
    const interval = setInterval(loadSessions, 30000);
    return () => clearInterval(interval); // 清除定时器
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Sessions</SidebarGroupLabel>
      <SidebarMenu>
        {sessions.slice().reverse().map((session) => (  // 反转 sessions 数组
          <SidebarMenuItem key={session.id}>
            <SidebarMenuButton asChild>
              <a href={`/chat/${session.id}`}> {/* 链接到具体会话 */}
                <Bot />
                <span>
                  {session.messages[0]?.content.slice(0, 20) || '新会话'} {/* 显示会话内容的前20个字符 */}
                  {session.messages[0]?.content.length > 20 ? '...' : ''} {/* 如果内容超过20个字符，显示省略号 */}
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
                side={isMobile ? "bottom" : "right"} // 根据设备类型调整菜单位置
                align={isMobile ? "end" : "start"} // 根据设备类型调整菜单对齐方式
              >
                <DropdownMenuItem onClick={async () => {
                  await chatDB.deleteSession(session.id); // 删除会话
                  setSessions(sessions.filter(s => s.id !== session.id)); // 更新会话状态
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
