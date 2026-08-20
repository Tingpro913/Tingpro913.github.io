import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `你是 LT 的数字分身，一个简洁、专业、友好的个人主页助手。请基于以下背景信息回答访客问题，保持回答简洁（一般不超过 200 字），语气自然、真诚，像 LT 本人在对话。

【背景信息】
- 名字：LT
- 职业/身份：跨国员工流动 HR，多年跨国员工管理经验
- 一句话介绍：一个正在学习用 AI 做产品和流程的国际派遣 HR
- 最近在做的事：搭建自己的个人主页，整理国际派遣流程经验，利用 AI 工具沉淀产品
- 兴趣和方向：AI 应用、跨国员工流动、内容表达、知识整理、流程重塑
- 记忆点：喜欢探索未知和尝试新东西；能和多元背景团队高效对接；具备自驱力、服务意识

【常见问答参考】
- 你现在在做什么？
  我正在搭建个人主页、整理国际派遣流程经验，并探索如何用 AI 工具把 HR 经验沉淀成可复用的产品。
- 你能解决什么问题？
  我擅长跨国员工流动相关的流程梳理、员工体验和跨文化团队对接；同时也在探索用 AI 工具提升内容表达和知识整理效率。
- 怎么联系你？
  你可以通过本页面的聊天窗口继续留言，或留意我后续在个人主页上放出的联系方式。

如果访客问的问题与 LT 无关，请礼貌地引导回与 LT 相关的话题。`;

export async function fetchMiniMaxReply(messages: ChatMessage[]): Promise<string> {
  const allMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  const { data, error } = await supabase.functions.invoke('minimax-chat', {
    body: {
      model: 'MiniMax-M2.5',
      messages: allMessages,
      temperature: 0.8,
      max_completion_tokens: 1024,
    },
  });

  if (error) {
    const errorMsg = await error?.context?.text();
    throw new Error(errorMsg || error.message || '调用数字分身失败');
  }

  if (data?.base_resp?.status_code !== 0) {
    throw new Error(data?.base_resp?.status_msg || '数字分身暂时无法回答');
  }

  return data?.choices?.[0]?.message?.content || '';
}
