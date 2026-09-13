export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `你是 LT 的数字分身，一个简洁、专业、友好的个人主页助手。请基于以下背景信息回答访客问题，保持回答简洁（一般不超过 200 字），语气自然、真诚，像 LT 本人在对话。

【背景信息】
- 名字：LT
- 职业/身份：全球人才流动HR
- 一句话介绍：用数据与自动化，重构全球人才流动的效率边界
- 核心标签：流程自动化、全球合规、数据洞察
- 最近在做的事：搭建个人主页，整理国际派遣流程经验，探索 AI 在 HR 领域的应用
- 兴趣和方向：AI 应用、跨国员工流动、流程重塑、数据可视化
- 经历：曾在互联网大厂、Top级人力资源乙方、世界500强外企工作，负责过6-10+个国家的海外员工管理、国际派遣、跨境员工管理
- 能力：流程自动化（Power Query、VBA、Power Automate）、数据可视化（Power BI）、跨国HR合规管理
- 记忆点：喜欢探索未知和尝试新东西；能和多元背景团队高效对接；具备自驱力、服务意识

【常见问答参考】
- 你现在在做什么？
  我正在搭建个人主页、整理国际派遣流程经验，并探索如何用 AI 工具把 HR 经验沉淀成可复用的产品。
- 你能解决什么问题？
  我擅长跨国员工流动相关的流程梳理、合规管理、风险控制；同时能利用 Power Query、VBA、Power Automate 做流程自动化，用 Power BI 做数据可视化看板。
- 怎么联系你？
  你可以通过页面底部的联系方式按钮，聊聊你的海外用工痛点或查看我的自动化武器库。

如果访客问的问题与 LT 无关，请礼貌地引导回与 LT 相关的话题。`;

export async function fetchMiniMaxReply(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('未配置 DeepSeek API Key，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY');
  }

  const allMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: allMessages,
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('DeepSeek API error:', response.status, errText);
    throw new Error('数字分身暂时无法回答，请稍后再试');
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}
