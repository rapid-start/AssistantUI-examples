import { useAui, ThreadHistoryAdapter } from "@assistant-ui/react";

export function messageHistoryAdapterFactory() {
    const aui = useAui();

    /**
     * 消息历史读写适配器：读写数据库消息
     * 用于存储和检索会话历史消息。
     */
    const messageHistoryAdapter: ThreadHistoryAdapter = {

        /**
         * 路线一：useLocalRuntime走这里
         */

        // 加载当前线程全部历史消息

        async load() {
            console.log("load", aui.threadListItem().getState().id);
            return { headId: null, messages: [] };
        },

        // 新增消息入库（发送消息、流式增量完成都会触发）
        async append(item) {
            console.log("append", aui.threadListItem().getState().id, item);
        },

        /**
         * 路线二：useChatRuntime / useAISDKRuntime 走这里
         */
        // withFormat(fmt) {
        //     return {

        //         // 加载当前线程全部历史消息
        //         async load() {
        //             return {
        //                 headId: null,
        //                 messages: [],
        //             };
        //         },

        //         // 新增消息入库（发送消息、流式增量完成都会触发）
        //         async append(item) {
        //             console.log("withFormat.append", item);
        //         }

        //     };
        // }
    };

    return messageHistoryAdapter;
}