next/
├── app/                           # Next.js 应用主目录
│   ├── api/                       # API Routes
│   │   ├── chat/                  # 聊天相关接口
│   │   ├── audio/                 # 语音处理接口
│   │   ├── documents/             # 文档处理接口
│   │   └── kg/                    # 知识图谱接口
│   ├── components/                # React组件
│   │   ├── chat/                  # 聊天相关组件
│   │   ├── audio/                 # 语音相关组件
│   │   └── documents/             # 文档处理组件
│   └── lib/                       # 前端工具函数
│
├── services/                      # Python微服务
│   ├── llm/                       # LLM服务 (原client/*)
│   │   ├── Dockerfile
│   │   └── src/
│   ├── audio/                     # 语音处理服务
│   │   ├── Dockerfile
│   │   └── src/
│   ├── kg/                        # 知识图谱服务
│   │   ├── Dockerfile
│   │   └── src/
│   ├── documents/                 # 文档处理服务 (原ppt_docx/*)
│   │   ├── Dockerfile
│   │   └── src/
│   └── qa/                        # QA服务
│       ├── Dockerfile
│       └── src/
│
├── config/                        # 配置文件
│   ├── .env.local                 # 本地环境变量
│   └── docker-compose.yml         # 容器编排配置
│
├── public/                        # 静态资源
│   └── images/
│
├── scripts/                       # 部署和工具脚本
│   ├── deploy.sh
│   └── setup.sh
│
├── tests/                         # 测试文件
│
├── .gitignore
├── README.md
├── MIGRATION_PLAN.md
├── package.json
└── tsconfig.json