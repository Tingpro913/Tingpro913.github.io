import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
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
  tagline: '一个正在学习用 AI 做产品和流程的国际派遣 HR',
  doing: [
    '整理国际派遣流程',
    '跨国员工管理',
    '探索 AI 方向',
  ],
  interests: ['AI 应用', '跨国员工流动'],
  highlights: [
    '喜欢探索未知和尝试新东西',
    '多年跨国员工管理 HR 经验',
    '能和多元背景团队高效对接',
    '具备自驱力、服务意识',
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
      content: '嗨，我是 LT 的数字分身～想了解 LT 的经历、方向或近况，尽管问我吧。',
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {/* 头部区域 */}
        <section className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 md:h-28 md:w-28 border-2 border-border shadow-sm">
            <AvatarImage src="/images/avatar.svg" alt={`${profile.name} 的头像`} />
            <AvatarFallback className="bg-muted text-foreground text-2xl">
              {profile.name}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-md">
            {profile.tagline}
          </p>
        </section>

        {/* 个人信息展示区 */}
        <section className="mt-10 grid gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                我正在做
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {profile.doing.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg font-semibold">我的兴趣</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {profile.interests.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg font-semibold">我的标签</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {profile.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm md:text-base text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10 bg-border" />

        {/* 数字分身聊天区 */}
        <section>
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border pb-4">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Digital Me
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                想了解 LT 的经历、方向或近况，尽管问我吧
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea
                ref={scrollRef}
                className="h-80 md:h-96 px-4 py-4"
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
                            : 'bg-muted text-foreground'
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
                      <div className="rounded-2xl bg-muted px-4 py-2 text-sm text-muted-foreground">
                        数字分身正在思考…
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* 快捷问题 */}
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => onQuickQuestionClick(question)}
                      disabled={loading}
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs md:text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* 输入区 */}
              <div className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入你想问的问题…"
                    disabled={loading}
                    maxLength={500}
                    className="flex-1 rounded-full border-border bg-muted px-4 py-2 text-sm md:text-base focus-visible:ring-accent"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    size="icon"
                    className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    aria-label="发送"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
