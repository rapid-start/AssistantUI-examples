import { defineToolkit } from "@assistant-ui/react";
import { get_current_time } from "./get_current_time";
import { get_location } from "./get_location";
import { show_info } from "./show_info";

// 工具集
export const toolkit = defineToolkit({
    get_current_time,
    get_location,
    show_info
} as any);
