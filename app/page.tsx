"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "./hooks/use-chat-runtime"; // 自定义聊天运行时钩子
import { ChatContent } from "./components/ChatContent";
import { ThreadList } from "./components/ThreadList";

/**
 * 主页组件
 * 作为应用的入口组件，配置全局布局和运行时
 */
export default function Home() {

  // 获取聊天运行时实例
  // 【存储全局唯一大仓库 ｜ runtime 运行实例】对接后端流式接口、消息发送、中断输出、工具调用底层能力
  const runtime = useChatRuntime();

  return (
    <div>
      {/* 
        将运行时注入到整个应用
      */}
      <AssistantRuntimeProvider runtime={runtime}>

        {/* 
          聊天视图
        */}
        <ChatContent />

        {/* 
          会话列表
        */}
        <ThreadList />

      </AssistantRuntimeProvider>
    </div>
  );
}