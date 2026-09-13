import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, User, Bot, Sparkles, Compass, Tag, Mail, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { fetchMiniMaxReply, type ChatMessage } from '@/services/chat';

const profile = {
  name: 'LT',
  title: '全球人才流动HR',
  subtitle: '用数据与自动化，重构全球人才流动的效率边界。',
  badges: ['流程自动化', '全球合规', '数据洞察'],
  doing: [
    '整理国际派遣流程',
    '跨国员工管理',
    '探索 AI 方向',
  ],
  interests: ['AI 应用', '跨国员工流动'],
  experiences: [
    {
      company: '世界500强外企',
      role: '国际派遣HR',
      period: '2022.04 - 至今',
      situation: '负责集团下多国家海外员工来华派遣全流程，涉及本地福利方案设计、政策咨询与风险控制。',
      action: '利用 Power Query & VBA 设计员工数据看板和薪资计算器，为业务决策和福利方案提供数据支持。利用 Power Automate 搭建自动化流程，减少手动工作并提高整体效率。',
      result: '实现 SLA 100% 履行和国际派遣 100% 满意度，合规 0 风险；数据分析看板成为业务部门计划国际派遣的支撑工具。',
    },
    {
      company: 'Top人力资源乙方',
      role: '跨境员工管理顾问',
      period: '2019.11 - 2022.02',
      situation: '托管 20+ 家大客户的跨国员工管理，涉及欧、美、东南亚等 10+ 个国家，应对不同国家落地合规要求和不同客户信用账期管理。',
      action: '定制化设计跨国流动 SOP；开发 10+ 家海外落地供应商，并建立多国政策知识库；实施信用管控与应收账款预警。',
      result: '客户满意度 100%，财务指标完成率高达 130%。',
    },
    {
      company: 'Top互联网公司',
      role: '海外HRSSC',
      period: '2017.12 - 2019.06',
      situation: '负责澳、英、韩、俄等 6 国海外员工管理，涉及雇佣、入职、签证、发薪、报税、社保、数据安全等全流程。',
      action: '独立主导 3 个新设国家（澳/英/韩）的公司主体落地，包括发薪系统搭建；完成欧洲境内主题 GDPR 合规申报，梳理跨国 HR 流程 SOP。',
      result: '确保 6 国员工 100% 合规管理和准时发薪，规避潜在数据安全问题，体系化 SOP 赋能事业部团队。',
    },
  ],
  aboutTitle: '关于我',
  aboutIntro:
    '在过去的几年里，我穿梭于互联网大厂、Top级人力资源乙方以及世界500强外企，从海外SSC、到全球员工管理解决方案顾问、再到国际派遣，我关注的不只是流程，更是如何让全球化雇佣更轻盈、合规、透明。',
  aboutValueTitle: '我能为你带来什么？',
  aboutValues: [
    '曾管理 10+ 个国家的员工部署，处理过来自 10+ 个国家的国际派遣，通过流程自动化和风险控制，为海外扩张节省至少 20% 的隐性成本。',
    '能把 Excel 里海量的员工数据，变成 Power BI 里一目了然的可视化看板，让决策有据可依。',
  ],
  contactActions: [
    { text: '聊聊你的海外用工痛点', icon: 'mail', href: 'mailto:lt@example.com' },
    { text: '查看我的"自动化武器库"', icon: 'zap', href: null },
  ],
};

const quickQuestions = [
  '你现在在做什么？',
  '你能解决什么问题？',
  '怎么联系你？',
];

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '嗨，我是 LT 的数字分身～想了解 LT 的经历、方向或近况，随时问我吧！',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const scrollEl = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollEl) {
      scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) {
      toast.error('请输入问题');
      return;
    }

    if (question.length > 500) {
      toast.error('问题长度超过 500 字，请精简后重试');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: question };
    const updatedMessages = [...messages, userMessage];
    if (updatedMessages.length > 20) {
      updatedMessages.splice(0, updatedMessages.length - 20);
    }
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = updatedMessages.filter((m) => m.role !== 'system');
      const reply = await fetchMiniMaxReply(history);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '抱歉，暂时无法回答，请稍后再试';
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '抱歉，暂时无法回答，请稍后再试。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const onQuickQuestionClick = (question: string) => {
    void handleSend(question);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(30 70% 90% / 0.6), transparent)' }}>
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* 头部区域 - 全宽居中 */}
        <section className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 md:h-28 md:w-28 border-2 border-accent/30 shadow-md">
            <AvatarImage src="/images/avatar.svg" alt={`${profile.name} 的头像`} />
            <AvatarFallback className="bg-secondary text-accent text-2xl md:text-3xl font-semibold">
              {profile.name}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-5 text-2xl md:text-4xl font-bold tracking-tight">
            👋 嗨，我是 {profile.name}
          </h1>
          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            {profile.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-1 text-xs text-muted-foreground border border-border"
              >
                📍 {badge}
              </span>
            ))}
          </div>
          <p className="mt-5 text-lg md:text-xl font-semibold text-foreground">
            {profile.title}
          </p>
          <p className="mt-1.5 text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
            {profile.subtitle}
          </p>
        </section>

        <Separator className="my-10 bg-border md:hidden" />

        {/* 双栏卡片区 */}
        <div className="md:mt-16 md:grid md:grid-cols-2 md:gap-8 lg:gap-12 md:items-stretch">
          {/* 左栏 */}
          <div className="flex flex-col gap-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  最近在忙什么
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {profile.doing.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center rounded-full bg-secondary px-3.5 py-1.5 text-sm text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent" />
                  {profile.aboutTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-foreground leading-relaxed">
                  {profile.aboutIntro}
                </p>
                <div>
                  <p className="text-sm md:text-base font-semibold text-foreground mb-2.5">
                    {profile.aboutValueTitle}
                  </p>
                  <ul className="grid gap-2.5">
                    {profile.aboutValues.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm md:text-base text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右栏 */}
          <div className="mt-4 md:mt-0 flex flex-col gap-4">
            {/* 我做过什么 */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Compass className="h-4 w-4 text-accent" />
                  我做过什么
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {profile.experiences.map((exp, i) => (
                    <div key={i} className="border-l-2 border-accent/30 pl-3">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm md:text-base font-semibold text-foreground">{exp.company}</span>
                        <span className="text-xs md:text-sm text-muted-foreground">| {exp.role}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{exp.period}</span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-xs md:text-sm text-muted-foreground leading-relaxed">
                        <p><span className="font-medium text-foreground/80">情境：</span>{exp.situation}</p>
                        <p><span className="font-medium text-foreground/80">行动：</span>{exp.action}</p>
                        <p><span className="font-medium text-foreground/80">结果：</span>{exp.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 数字分身聊天区 */}
            <Card className="bg-card border-border overflow-hidden shadow-card flex-1 flex flex-col">
              <CardHeader className="bg-secondary/60 border-b border-border pb-3 shrink-0">
                <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-accent" />
                  和 LT 聊聊天
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  有什么好奇的，直接问就好～
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <ScrollArea
                  ref={scrollRef}
                  className="flex-1 min-h-[14rem] px-4 py-4"
                >
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent text-accent-foreground'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm md:text-base leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="rounded-2xl bg-secondary px-4 py-2 text-sm text-muted-foreground">
                          数字分身正在思考…
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* 快捷问题 */}
                <div className="px-4 pb-3 pt-2 shrink-0">
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => onQuickQuestionClick(question)}
                        disabled={loading}
                        className="inline-flex items-center rounded-full border border-border bg-background px-3.5 py-1.5 text-xs md:text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground hover:border-accent/40 disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 输入区 */}
                <div className="border-t border-border p-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="输入你想问的问题…"
                      disabled={loading}
                      maxLength={500}
                      className="flex-1 rounded-full border-border bg-secondary px-4 py-2.5 text-sm md:text-base focus-visible:ring-accent"
                    />
                    <Button
                      onClick={() => handleSend()}
                      disabled={loading || !input.trim()}
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      aria-label="发送"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 联系方式区 */}
        <section className="mt-8 md:mt-12">
          <Card className="bg-card border-border shadow-card">
            <CardContent className="pt-5">
              <div className="flex flex-col sm:flex-row gap-3">
                {profile.contactActions.map((action) => (
                  action.href ? (
                    <a
                      key={action.text}
                      href={action.href}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm md:text-base text-primary-foreground font-medium transition-colors hover:bg-primary/90"
                    >
                      {action.icon === 'mail' && <Mail className="h-4 w-4 shrink-0" />}
                      {action.icon === 'zap' && <Zap className="h-4 w-4 shrink-0" />}
                      {action.text}
                    </a>
                  ) : (
                    <button
                      key={action.text}
                      type="button"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm md:text-base text-foreground font-medium transition-colors hover:bg-accent/15 hover:text-accent"
                    >
                      {action.icon === 'mail' && <Mail className="h-4 w-4 shrink-0" />}
                      {action.icon === 'zap' && <Zap className="h-4 w-4 shrink-0" />}
                      {action.text}
                    </button>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
