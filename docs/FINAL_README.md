<div align="center">
  <h1>LIKEN</h1>
  <b>LLM Next Interactive Knowledge Engine</b>
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

LIKEN (LLM-Next-Interactive-Knowledge-Engine) 是一个强大的知识库交互引擎，它能够将任何领域的专业知识转化为智能对话系统。通过多模态交互、知识图谱增强和检索增强生成（RAG）等技术，为用户提供精准的知识服务。

### 🌟 主要特性

- 📚 **通用知识库**：支持任意领域的知识导入和交互
- 🎯 **多模态交互**：文本、语音、图像等多种交互方式
- 🔍 **智能检索**：基于RAG技术的精准知识检索
- 🗃️ **文档处理**：自动处理Word、PPT等多种文档格式
- 🎨 **知识图谱**：可视化知识连接，增强理解深度
- 🔊 **语音对话**：支持语音输入输出的自然交互
- 🌐 **实时联网**：支持实时网络信息检索和更新

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Python 3.10+
- MongoDB
- Docker (可选)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/LIKEN.git
cd LIKEN
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
- **数据库**：MongoDB
- **AI模型**：支持多种LLM接口
- **部署**：Vercel (前端) + Docker (后端微服务)

## 🔧 核心功能

### 知识库管理
- 支持多种格式文档导入
- 自动知识提取和索引
- 知识图谱可视化

### 智能交互
- 多轮对话记忆
- 多模态输入输出
- 实时语音交互

### 文档处理
- 自动文档生成
- 智能文档分析
- 格式转换

## 📦 项目结构

```plaintext
LIKEN/
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