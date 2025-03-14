<div align="center">
  <h1>LIKEN</h1>
  <b>LLM Interactive Knowledge Engine Next.js</b>
  <p>基于 Next.js 的大模型交互知识引擎</p>
</div>

<div align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </a>
</div>

## 📖 简介

LIKEN (LLM Interactive Knowledge Engine Next.js) 的目标是开发一个强大的知识库交互引擎，它能够将任何领域的专业知识转化为智能对话系统。通过多模态交互、知识图谱增强和检索增强生成（RAG）等技术，为用户提供精准的知识服务。

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Python 3.10+
- PostgreSQL 15+（需安装 pgvector 扩展）
- MongoDB

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/JacksonHe04/liken.git
cd liken
```

2. 安装前端依赖
```bash
pnpm install
```

3. 安装Python依赖
```bash
pip install -r requirements.txt
```

4. 配置环境变量
```bash
cp .env.example .env.local
```
编辑 `.env.local` 文件，填写必要的配置信息。

5. 启动开发服务器
```bash
pnpm run dev
```

## 🏗️ 技术架构

- **前端**：Next.js 14+, TypeScript, TailwindCSS
- **后端**：Python微服务
- **数据库**：PostgreSQL + pgvector
- **AI模型**：支持多种LLM接口
- **部署**：Vercel (前端) + Docker (后端微服务)

## 🔧 功能清单

### 基础对话功能
- [x] 输入
    - [x] 样式修改
    - [x] 换行
    - [ ] 重新提问
    - [ ] 编辑提问
- [ ] 输出
    - [x] 聊天气泡
    - [ ] markdown格式的渲染
        - [x] 行内代码
        - [ ] 代码
    - [ ] 输入和输出的复制
    - [ ] 代码的复制
    - [ ] 加载的提示效果
- [ ] 聊天记录
    - [ ] 路由的动态渲染
    - [ ] 对话历史记录保存
- [ ] 模型的切换
    - [ ] 不同的输入方式
    - [ ] 不同的输出方式

### 知识库管理
- [ ] 文档导入功能
  - [ ] 支持PDF文档导入
  - [ ] 支持Word文档导入
  - [ ] 支持Markdown文档导入
  - [ ] 支持网页URL导入
- [ ] 知识库索引
  - [ ] 自动文本分段
  - [ ] 向量化存储
  - [ ] 相似度检索
- [ ] 知识图谱
  - [ ] 实体识别与关系抽取
  - [ ] 图谱可视化展示
  - [ ] 知识推理能力

### 多模态交互
- [ ] 语音交互
  - [ ] 语音输入转文字
  - [ ] 文字转语音输出
  - [ ] 实时语音识别
- [ ] 图像处理
  - [ ] 图片上传与显示
  - [ ] 图像内容识别
  - [ ] 图文混合对话

### 检索增强生成（RAG）
- [ ] 智能检索系统
  - [ ] 上下文相关性排序
  - [ ] 多路召回策略
  - [ ] 动态知识融合
- [ ] 实时联网能力
  - [ ] 网络搜索集成
  - [ ] 实时信息更新
  - [ ] 源链接追踪

### 系统功能
- [ ] 用户管理
  - [ ] 多用户支持
  - [ ] 权限控制
  - [ ] 使用统计
- [ ] 系统监控
  - [ ] 性能监控
  - [ ] 错误追踪
  - [ ] 使用量统计

## 📦 项目结构

```plaintext
liken/
├── app/                    # Next.js 应用主目录
├── services/               # Python微服务
├── config/                 # 配置文件
└── public/                 # 静态资源
```

详细的项目结构请参考 [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)。

## 🤝 贡献指南

我们欢迎所有形式的贡献，无论是新功能、文档改进还是问题报告。请查看我们的[贡献指南](CONTRIBUTING.md)了解更多信息。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者。

## 📬 联系我们

如有任何问题或建议，欢迎提出 Issue 或 PR。