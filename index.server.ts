import type { PluginServerContext } from "@getpaseo/plugin/server";

const TARGET_TITLE = "Branch name generator";
const INSTRUCTION =
  "生成标题时必须使用简体中文。保留文件名、路径、命令、PR/issue 编号、包名、组件名等专有内容原样；git 分支名仍然使用英文小写 slug，不要用中文。";

export default function contribute(server: PluginServerContext) {
  return server.addHook("agent.open.before", async ({ request }) => {
    if (request.title !== TARGET_TITLE) return;
    console.log(`[zh-titles] injected title instruction provider=${request.provider} agent=${request.agentId}`);
    return {
      ...request,
      appendSystemPrompt: [...(request.appendSystemPrompt ?? []), INSTRUCTION],
    };
  });
}
