import { defineToolkit } from "@assistant-ui/react";
import { z } from "zod";

// 工具集
export const toolkit = defineToolkit({
  get_current_time: {
    type: "frontend",
    description: "获取当前系统时间",
    parameters: z.object({}),
    execute: async () => {
      console.log("调用工具get_current_time");
      const time = new Date().toLocaleString("zh-CN");
      return { time };
    },
    renderText: {
      running: "正在获取系统时间...",
      complete: ({ result }: any) => {
        return `当前时间: ${result.time}`;
      },
    }
  },
  get_location: {
    type: "frontend",
    description: "获取当前位置信息",
    parameters: z.object({}),
    execute: async () => {
      console.log("调用工具get_location");
      return { location: "南京" };
    },
    renderText: {
      running: "正在获取位置信息...",
      complete: ({ result }: any) => {
        return `当前位置: ${result.location}`;
      },
    }
  },
  show_info: {
    type: "frontend",
    description: "显示用户信息，需要先获取时间和位置信息",
    parameters: z.object({
      time: z.string().describe("当前时间，通过调用get_current_time获取"),
      location: z.string().describe("当前位置，通过调用get_location获取")
    }),
    execute: async (result) => {
      return result;
    },
    renderText: {
      running: "正在准备显示用户信息...",
      complete: ({ result }: any) => {
        console.log("调用工具show_info", result);
        return `用户信息 ${result}`;
      },
    }
  }
});
