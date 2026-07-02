import type { ChatModelAdapter, ChatModelRunResult } from "@assistant-ui/react";
import parseString from "../parseString";
import callFuns from "../callFuns";
import { z } from "zod";

/**
 * 获取并处理聊天消息的异步生成器函数
 * @param messages - 聊天消息历史数组
 * @param tools - 可用的工具对象集合
 * @param abortSignal - 用于中止请求的 AbortSignal
 * @returns 异步生成器，产生 ChatModelRunResult 对象
 */
async function* fetchAndProcess(
  messages: Array<any>,
  tools: any,
  abortSignal: AbortSignal
): AsyncGenerator<ChatModelRunResult> {

  // 将工具对象转换为 API 所需的格式
  let tools_info: any = []
  if (tools) {
    tools_info = Object.entries(tools).map(([name, t]) => {
      const parameters = z.toJSONSchema((t as any).parameters)
      return {
        type: "function" as const,
        function: {
          name,
          description: (t as any).description,
          parameters: {
            required: parameters.required,
            properties: parameters.properties
          },
        },
      }
    });
  }

  // 向本地 Ollama API 发送请求
  const res = await fetch("http://localhost:11434/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ollama"
    },
    body: JSON.stringify({
      model: "qwen3.5",  // 使用的模型名称
      stream: true,      // 启用流式响应
      messages: [{
        role: "assistant",
        content: "任何任务，如果有可以用的工具，请优先使用用户扩展的工具"
      }, ...messages],
      tools: tools_info
    }),
    signal: abortSignal,
  });

  // 创建流式响应的读取器
  const reader = res.body!.getReader();
  const decoder = new TextDecoder("utf-8");

  // 用于累积完整的文本内容和推理内容
  let fullText = "", fullReasoning = "";
  // 标记是否存在工具调用
  let hasToolCall = false;
  // 缓冲工具调用数据
  let toolCallsBuffer: Array<any> = [];

  // 逐块读取流式响应
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 解码当前数据块
    const chunk = decoder.decode(value, { stream: true });
    const parseItem = parseString(chunk);

    // 处理响应内容
    if (parseItem.choices) {
      for (let choice of parseItem.choices) {
        // 处理普通文本内容
        if (choice.delta.content) {
          fullText += choice.delta.content;
          yield {
            content: [{ type: "text", text: fullText }],
          };
        }

        // 处理推理内容
        if (choice.delta.reasoning) {
          fullReasoning += choice.delta.reasoning;
          yield {
            content: [{
              type: "reasoning",
              text: fullReasoning
            }],
          };
        }

        // 处理工具调用
        if (choice.delta.tool_calls && choice.delta.tool_calls.length > 0) {
          hasToolCall = true;
          toolCallsBuffer.push(...choice.delta.tool_calls);
        }
      }
    } else if (parseItem.error) {
      console.log(parseItem.error);
    }
  }

  // 如果存在工具调用，执行工具并继续处理
  if (hasToolCall && toolCallsBuffer.length > 0) {
    yield {
      content: [{ type: "text" as const, text: "正在执行工具调用..." }],
    };

    // 调用工具并获取结果
    const tool_results = await callFuns(tools, toolCallsBuffer);

    // 准备已执行的工具调用和工具消息
    const executedToolCalls: Array<any> = [];
    const toolMessages: Array<any> = [];

    for (let i = 0; i < toolCallsBuffer.length; i++) {
      const toolResult = tool_results[i];
      const toolCall = toolCallsBuffer[i];

      // 记录已执行的工具调用
      executedToolCalls.push({
        type: "tool-call" as const,
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        args: toolCall.function.arguments,
        result: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult),
      });

      // 创建工具消息用于后续对话
      toolMessages.push({
        role: "tool" as const,
        tool_call_id: toolCall.id,
        name: toolCall.function.name,
        content: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult),
      });
    }

    // 返回工具调用结果
    yield { content: executedToolCalls as any };

    // 构建新的消息历史，包含工具调用和结果
    const newMessages = [...messages, {
      role: "assistant" as const,
      tool_calls: toolCallsBuffer,
    }, ...toolMessages];

    // 递归调用以继续处理后续对话
    yield* fetchAndProcess(newMessages, tools, abortSignal);
  }
}

/**
 * 聊天模型适配器
 * 实现了 ChatModelAdapter 接口，用于连接 Assistant UI 和后端 API
 */
export const chatAdapter: ChatModelAdapter = {
  /**
   * 运行聊天会话的主方法
   * @param messages - 聊天消息历史
   * @param context - 包含工具等上下文信息
   * @param abortSignal - 用于中止请求的信号
   * @returns 异步生成器，产生聊天运行结果
   */
  async *run({ messages, context, abortSignal }): AsyncGenerator<ChatModelRunResult> {

    // 显示思考状态
    yield {
      content: [{ type: "text" as const, text: "思考中..." }],
    };

    // 调用核心处理函数
    yield* fetchAndProcess(messages as any, context.tools, abortSignal);
  },
};