import { z } from "zod";

export const get_current_time = {
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
};