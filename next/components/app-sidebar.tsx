"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  // 移除未使用的导入
  // Map,
  // PieChart,
  Settings2,
  // SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "模型",
      url: "/models",
      icon: Bot,
      items: [
        {
          title: "GPT-4",
          url: "/models/gpt4",
        },
        {
          title: "Claude 2",
          url: "/models/claude2",
        },
        {
          title: "Gemini Pro",
          url: "/models/gemini-pro",
        },
        {
          title: "LLaMA 2",
          url: "/models/llama2",
        },
      ],
    },
    {
      title: "知识库",
      url: "/knowledge",
      icon: BookOpen,
      items: [
        {
          title: "文档管理",
          url: "/knowledge/documents",
        },
        {
          title: "知识图谱",
          url: "/knowledge/graph",
        },
        {
          title: "数据分析",
          url: "/knowledge/analysis",
        },
      ],
    },
    {
      title: "多模态",
      url: "/multimodal",
      icon: Frame,
      items: [
        {
          title: "文档生成",
          url: "/multimodal/word",
        },
        {
          title: "PPT生成",
          url: "/multimodal/ppt",
        },
        {
          title: "图片生成",
          url: "/multimodal/image",
        },
        {
          title: "视频生成",
          url: "/multimodal/video",
        },
      ],
    },
    {
      title: "设置",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "基本设置",
          url: "/settings/general",
        },
        {
          title: "API配置",
          url: "/settings/api",
        },
        {
          title: "用户管理",
          url: "/settings/users",
        },
      ],
    },
  ],
  projects: [
    {
      name: "GPT-4对话",
      url: "/chat/gpt4",
      icon: Bot,
    },
    {
      name: "Claude对话",
      url: "/chat/claude",
      icon: Bot,
    },
    {
      name: "Gemini对话",
      url: "/chat/gemini",
      icon: Bot,
    },
    {
      name: "LLaMA对话",
      url: "/chat/llama",
      icon: Bot,
    },
    {
      name: "Mixtral对话",
      url: "/chat/mixtral",
      icon: Bot,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
