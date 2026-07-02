import { ThreadListPrimitive, ThreadListItemPrimitive } from "@assistant-ui/react";

/**
 * 会话列表组件
 * 显示所有对话会话，用户可以切换会话或删除会话
 */
export function ThreadList() {

    // 【存储全局唯一大仓库 ｜ 多会话列表 threads】管理所有对话会话、切换新建 / 删除会话

    return (<div style={{
        marginTop: "10px"
    }}>
        <ThreadListPrimitive.Root>
            <ThreadListPrimitive.New>
                新建会话
            </ThreadListPrimitive.New>
            <ThreadListPrimitive.Items>
                {() => (
                    <ThreadListItemPrimitive.Root>
                        <ThreadListItemPrimitive.Trigger>
                            <ThreadListItemPrimitive.Title fallback="会话标题" />
                        </ThreadListItemPrimitive.Trigger>
                        <ThreadListItemPrimitive.Archive>
                            归档
                        </ThreadListItemPrimitive.Archive>
                        <ThreadListItemPrimitive.Delete>
                            删除
                        </ThreadListItemPrimitive.Delete>
                    </ThreadListItemPrimitive.Root>
                )}
            </ThreadListPrimitive.Items>
        </ThreadListPrimitive.Root>
    </div>)

}
