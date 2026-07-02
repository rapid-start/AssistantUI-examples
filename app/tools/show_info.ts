import { z } from "zod";

export const show_info = {
    type: "frontend",
    description: "显示用户信息，需要先获取时间和位置信息",
    parameters: z.object({
        time: z.string().describe("当前时间，通过调用get_current_time获取"),
        location: z.string().describe("当前位置，通过调用get_location获取")
    }),
    execute: async (result: any) => {
        return result;
    },
    renderText: {
        running: "正在准备显示用户信息...",
        complete: ({ result }: any) => {
            console.log("调用工具show_info", result);
            return `用户信息 ${result}`;
        },
    }
};