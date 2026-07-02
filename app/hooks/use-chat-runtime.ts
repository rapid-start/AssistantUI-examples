import { useLocalRuntime, useRemoteThreadListRuntime } from "@assistant-ui/react";
import { chatAdapter } from "../lib/adapter/chat-adapter";
import { ThreadListAdapter } from "../lib/adapter/thread-list-adapter";
import { messageHistoryAdapterFactory } from "../lib/adapter/message-history-adapter";

export function useChatRuntime() {
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: () => useLocalRuntime(chatAdapter, {
      adapters: {
        history: messageHistoryAdapterFactory() as any, // 消息自动落库
      }
    }), // 聊天
    adapter: ThreadListAdapter, // 会话列表
  });

  return runtime;
}

