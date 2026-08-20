## Vibe
- Dieter Rams functionalism × blueprint: 理性、克制的科技产品美学，以深蓝与白色为主调，通过清晰的网格、细线和微妙的材质区分信息层级，营造「干净、可信赖、略带科技感」的专业氛围。

## Color
- Primary: #0F172A (深蓝)
- On Primary: #FFFFFF (白字)
- Accent: #3B82F6 (浅蓝)
- On Accent: #FFFFFF (白字)
- Background: #FFFFFF (纯白)
- Foreground: #0F172A (深蓝)
- Muted: #F1F5F9 (浅灰蓝)
- Border: #E2E8F0 (浅灰)
- Secondary: #64748B (中灰蓝)
- 色彩规则：
  - 角色：只列上方角色，大面积区域使用中性背景，Primary/Accent 仅用于按钮、图标、激活态和边框等小面积焦点。
  - 对比：Primary/On、Accent/On 满足 ≥4.5:1；卡面与背景 ≥3:1。
  - 背景：页面、卡片、聊天区使用白色或浅灰蓝，禁止深蓝大色块铺底。
  - 按钮：主操作用 Primary 底白字，次操作用 Muted 底深蓝字，浅底禁用白色细描边。

## Typography
- Heading: 阿里巴巴普惠体 3.0 (family: 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif; weight: 600; url: https://resource-static.bj.bcebos.com/fonts-skill/AlibabaPuHuiTi_SemiBold.ttf)
- Body: 阿里巴巴普惠体 3.0 (family: 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif; weight: 400; url: https://resource-static.bj.bcebos.com/fonts-skill/AlibabaPuHuiTi_Regular.ttf)

## Visual Language
- 核心视觉签名：极细深蓝/浅蓝线条勾勒出卡片与聊天区的边界，营造蓝图般的精准感；头像与数字分身使用圆形胶囊形态， soften 技术感的冷峻。
- 材质与深度：纯白背景上仅使用极浅灰蓝 Muted 底与 1px 浅灰 Border 区分容器；阴影仅保留一层极淡的 spread，避免厚重感。
- 容器与按钮：卡片使用 12px 圆角，聊天输入区使用 24px 圆角胶囊，按钮使用 8px 圆角，填充 Primary 或 Muted；悬停时背景加深、图标微移。
- 布局节奏：单列垂直流，头部居中，信息卡片与聊天区依次排列，间距充足，移动端自然垂直堆叠；仅聊天区内部消息气泡左右分布。

## Animation
- 入场：页面内容从下方淡入上移， stagger 60ms，时长 300ms，缓动 ease-out。
- 交互：按钮悬停 150ms 背景色过渡，点击时 100ms 轻微缩放；聊天消息发送后平滑滚动到底部。
- 过渡：无额外滚动动效，保持克制。

## Forbidden
- 霓虹/高饱和渐变/大色块铺底
- 表情符号与玻璃拟态光晕
- 圆角过大或厚重阴影

## Additional Notes
- 所有用户可见文案使用中文
- 数字分身头像与发送按钮使用浅蓝 Accent 强调，避免页面整体过于单调
- 响应式优先保证移动端可读，聊天输入区在移动端保持全宽