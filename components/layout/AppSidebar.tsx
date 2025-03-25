"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/layout/NavMain"
import { NavProjects } from "@/components/layout/NavProjects"
import { NavUser } from "@/components/layout/NavUser"
import { TeamSwitcher } from "@/components/layout/TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Jackson He",
    email: "JacksonHe04c@gmail.com",
  },
  teams: [
    {
      name: "SEU",
      logo: GalleryVerticalEnd,
      plan: "Southeast University",
    },
    {
      name: "PALM Lab",
      logo: AudioWaveform,
      plan: "东南大学 PALM 实验室",
    }
  ],
  navMain: [
    {
      title: "模型",
      url: "/models",
      icon: Bot,
      items: [
        {
          title: "DeepSeek-R1",
          url: "/models/deepseek-r1",
        },
        // {
        //   title: "DeepSeek-V3",
        //   url: "/models/deepseek-v3",
        // },
        {
          title: "Doubao-1.5-Lite-32K",
          url: "/models/doubao-1.5-lite-32k",
        },
        // {
        //   title: "Doubao-1.5-Vision-Pro-32K",
        //   url: "/models/doubao-1.5-vision-pro-32k",
        // },
      ],
    },
    // {
    //   title: "知识库",
    //   url: "/knowledge",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "文档管理",
    //       url: "/knowledge/documents",
    //     },
    //     {
    //       title: "知识图谱",
    //       url: "/knowledge/graph",
    //     },
    //     {
    //       title: "数据分析",
    //       url: "/knowledge/analysis",
    //     },
    //   ],
    // },
    // {
    //   title: "多模态",
    //   url: "/multimodal",
    //   icon: Frame,
    //   items: [
    //     {
    //       title: "文档生成",
    //       url: "/multimodal/word",
    //     },
    //     {
    //       title: "PPT 生成",
    //       url: "/multimodal/ppt",
    //     },
    //     {
    //       title: "图片生成",
    //       url: "/multimodal/image",
    //     },
    //     {
    //       title: "视频生成",
    //       url: "/multimodal/video",
    //     },
    //   ],
    // },
    // {
    //   title: "设置",
    //   url: "/settings",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "基本设置",
    //       url: "/settings/general",
    //     },
    //     {
    //       title: "API 配置",
    //       url: "/settings/api",
    //     },
    //     {
    //       title: "用户管理",
    //       url: "/settings/users",
    //     },
    //   ],
    // },
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
        <NavProjects sessions={data.sessions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
