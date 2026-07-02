import { z } from "zod";

export const get_location = {
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
};