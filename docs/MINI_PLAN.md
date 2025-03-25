尽可能保留原有的目录结构，同时添加小程序相关的内容：

```plaintext
liken/
├── src/                    # 保持原有的源代码目录
│   ├── components/         # 共享组件
│   ├── hooks/             # 共享 hooks
│   ├── utils/             # 共享工具函数
│   ├── styles/            # 共享样式
│   ├── web/               # Web 端特定代码
│   │   ├── pages/         
│   │   ├── layouts/
│   │   └── App.tsx
│   └── mini/              # 小程序特定代码
│       ├── pages/
│       ├── components/
│       └── app.config.ts
├── public/                 # 公共资源
└── package.json
```

### 实施步骤

1. 首先，创建小程序相关目录：
```bash
mkdir -p src/mini/pages src/mini/components
```

2. 初始化 Taro 项目：
```bash
cd /Users/jackson/WebstormProjects/liken && pnpm create @tarojs/app .
```

3. 调整 Taro 配置文件，修改源码目录结构：
```typescript
// liken/config/index.ts
const config = {
  sourceRoot: 'src/mini',
  outputRoot: 'dist',
  // ... 其他配置
}

export default config
```

### 方案优势

1. **最小化改动**
   - 保持原有的目录结构
   - 不影响现有 Web 端的开发
   - 共享代码无需移动位置

2. **代码共享**
   - components、hooks、utils 等可以直接共享
   - 样式系统可以复用
   - 业务逻辑可以共享

3. **独立开发**
   - Web 端和小程序端可以独立开发
   - 构建过程互不影响
   - 便于单独部署

### 注意事项

1. **代码共享原则**
   - 共享组件需要考虑平台兼容性
   - 使用条件编译处理平台差异
   - 抽象通用业务逻辑

2. **样式处理**
   - 小程序端需要使用 Taro 的样式规范
   - 可能需要调整部分 CSS 以适配小程序

3. **路由管理**
   - 小程序的路由需要单独配置
   - 可以保持与 Web 端类似的路由结构

4. **构建配置**
   - 需要配置不同的构建命令
   - 可以使用环境变量区分平台

### package.json 示例
```json
{
  "scripts": {
    "dev:web": "原有的 Web 开发命令",
    "build:web": "原有的 Web 构建命令",
    "dev:mini": "pnpm taro dev --type weapp",
    "build:mini": "pnpm taro build --type weapp"
  }
}
```