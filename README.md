#iot-platform-web

```
iot-open-web
├─ babel.config.js                    # Babel的配置文件
├─ config                             # 主题配置
├─ jsconfig.json                      # 项目目录配置
├─ package.json                       # 项目配置项与依赖
├─ postcss.config.js                  # CSS转换配置
├─ public
│  ├─ index.html                      # Vue 入口模板
│  └─ logo.png                        # LOGO
├─ README.md
├─ src
│  ├─ api                             # Api ajax 等
│  ├─ App.vue                         # Vue 模板入口
│  ├─ assets                          # 本地静态资源
│  ├─ components                      # 业务通用组件
│  ├─ config                          # 项目基础配置
│  │  ├─ defaultSettings.js           # 全局设置
│  │  └─ router.config.js             # 路由配置
│  ├─ core                            # 项目引导
│  │  ├─ bootstrap.js                 # 全局配置初始化
│  │  ├─ directives                   # 指令
│  │  ├─ icons.js                     # svg图标引入文件
│  │  └─ lazy_use.js                  # 依赖包引入
│  ├─ global.less                     # 全局样式
│  ├─ layouts                         # 布局文件
│  ├─ locales                         # 国际化资源
│  ├─ main.js                         # Vue 入口 JS
│  ├─ mixins                          # 混入文件
│  ├─ mock                            # mock接口
│  ├─ permission.js                   # 路由守卫(路由权限控制)
│  ├─ router                          # Vue-Router
│  │  ├─ generator-routers.js         # 生成路由
│  │  └─ index.js                     # 路由初始化
│  ├─ store                           # Vuex
│  ├─ utils                           # 工具库
│  └─ views                           # 业务页面入口和常用模板
│     ├─ account                      # 账户管理模块
│     ├─ appDevelop                   # APP开发模块
│     ├─ authority                    # 权限模块
│     ├─ dashboard                    # 主页
│     ├─ exception                    # 其他
│     ├─ marketing                    # 营销模块
│     ├─ product                      # 产品开发模块
│     └─ user                         # 用户模块
└─ vue.config.js                      # 环境配置文件

```