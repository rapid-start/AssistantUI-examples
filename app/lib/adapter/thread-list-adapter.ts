import type { RemoteThreadListAdapter } from "@assistant-ui/react";
import { createAssistantStream } from "assistant-stream";

/**
 * RemoteThreadListAdapter 实现
 * 定义会话列表的 CRUD 操作，对接服务端线程管理 API
 */
export const ThreadListAdapter: RemoteThreadListAdapter = {
  /** 查询会话列表，返回分页数据 */
  async list() {
    console.log("查询会话列表");
    return {
      threads: [
        { remoteId: "thread-1", status: "regular", title: "会话 1" },
        { remoteId: "thread-2", status: "archived", title: "会话 2" },
      ],
      nextCursor: undefined,
    };
  },

  /** 获取单个会话详情 */
  async fetch(threadId) {
    console.log("获取单个会话", threadId);
    return { remoteId: threadId, status: "regular", title: "某个会话" };
  },

  /** 初始化新会话，返回 remoteId 和 externalId */
  async initialize(threadId) {
    console.log("新建会话", threadId);
    return { remoteId: threadId, externalId: undefined };
  },

  /** 重命名会话标题 */
  async rename(remoteId, newTitle) {
    console.log("重命名", remoteId, newTitle);
  },

  /** 归档会话 */
  async archive(remoteId) {
    console.log("归档", remoteId);
  },

  /** 取消归档会话 */
  async unarchive(remoteId) {
    console.log("取消归档", remoteId);
  },

  /** 删除会话 */
  async delete(remoteId) {
    console.log("删除", remoteId);
  },

  /**
   * 根据消息生成会话标题
   * @param remoteId - 会话远程 ID
   * @param unstable_messages - 当前会话消息列表
   * @returns AssistantStream 流式标题结果
   */
  async generateTitle(remoteId, unstable_messages) {
    console.log("生成会话标题", remoteId, unstable_messages);

    return createAssistantStream(async (controller) => {
      controller.appendText("会话标题【" + remoteId + "】");
    });
  },
};