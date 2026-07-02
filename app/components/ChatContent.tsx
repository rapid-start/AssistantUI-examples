import { ThreadPrimitive, ComposerPrimitive, useAui, AuiProvider, Tools, MessagePrimitive } from "@assistant-ui/react";
import { toolkit } from "../tools/index"; // 工具集合配置

/**
 * 聊天内容组件
 * 负责渲染消息列表和输入区域
 */
export function ChatContent() {

    // 创建 AUI 上下文，配置可用工具
    // 【存储全局唯一大仓库 ｜ aui 全局配置】全局注册自定义渲染组件、工具函数、快捷提问、UI 全局设置
    const aui = useAui({
        tools: Tools({ toolkit }),
    });

    return (
        <AuiProvider value={aui}>
            <div>

                {/* 
                线程根组件，管理消息列表状态和渲染 
                整个对话会话的根上下文容器，所有消息、滚动区、输入框都必须包裹在它内部
                提供全局 thread 状态上下文
                */}
                <ThreadPrimitive.Root>

                    {/* 
                    视口组件，定义可滚动区域 
                    聊天界面的「滚动窗口 + 智能自动滚动控制器」
                    所有消息必须放在它里面，才能实现：
                        1、自动滚动
                        2、不打断用户查看历史
                        3、流式输出时平滑跟随
                    */}
                    <ThreadPrimitive.Viewport style={{ height: "calc(70vh - 60px)", marginTop: "0px", overflowY: "auto" }}
                        autoScroll={true}  // 🔥 开启智能自动滚动（默认就是true）
                    >

                        {/* 
                        自动渲染所有聊天消息的列表组件
                        它会自动读取 ThreadPrimitive.Root 里的所有消息
                        自动循环、自动绑定 key、自动处理流式更新
                        你只需要自定义：用户消息长啥样、助手消息长啥样（含思考块）
                        */}
                        <ThreadPrimitive.Messages>
                            {({ message }) => (
                                <div style={{
                                    padding: "12px 16px",
                                    marginBottom: "8px",
                                    borderRadius: "8px",
                                    backgroundColor: message.role === "user" ? "#3b82f6" : "#f3f4f6",
                                    color: message.role === "user" ? "white" : "black",
                                    maxWidth: "70%",
                                    marginLeft: message.role === "user" ? "auto" : "0",
                                }}>

                                    {/* 
                                    消息内容片段渲染组件 
                                    */}
                                    <MessagePrimitive.Parts>
                                        {({ part }) => {

                                            // 消息内容
                                            if (part.type === "text") {
                                                return <span>{part.text}</span>;
                                            }

                                            // 推理内容
                                            else if (part.type === "reasoning") {
                                                return <span style={{ color: "gray" }}>{part.text}</span>;
                                            }

                                            return null;
                                        }}
                                    </MessagePrimitive.Parts>

                                </div>
                            )}
                        </ThreadPrimitive.Messages>
                    </ThreadPrimitive.Viewport>
                </ThreadPrimitive.Root>
            </div>

            {/*
            编辑器根组件，管理输入状态
            */}
            <ComposerPrimitive.Root style={{
                display: "flex"
            }}>

                <ComposerPrimitive.Input style={{
                    flexGrow: 1,
                    padding: "10px"
                }} placeholder="请输入内容？" />

                <ComposerPrimitive.Send style={{
                    width: "70px",
                    height: "40px",
                    marginLeft: "10px",
                    color: "white",
                    backgroundColor: "#E91E63"
                }}>发送</ComposerPrimitive.Send>

            </ComposerPrimitive.Root>

        </AuiProvider>
    );
}