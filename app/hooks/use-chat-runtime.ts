import { useLocalRuntime } from "@assistant-ui/react";
import { chatAdapter } from "../lib/chat-adapter";

export function useChatRuntime() {
  return useLocalRuntime(chatAdapter);
}

