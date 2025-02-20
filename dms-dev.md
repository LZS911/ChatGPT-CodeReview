## 前言

公司现有的产品 [sqle](https://github.com/actiontech/sqle) 与 [provision](http://10.186.18.21/provision)，以及即将推出的 SQL 编辑器、数据库巡检与诊断等新产品，均与数据管理紧密相关。为了确保这些产品既能够独立销售，也能够组合成套件进行整合销售，我们进行了此次项目平台的规划。

DMS 项目采用的是 [monorepo](https://zh.wikipedia.org/wiki/Monorepo) 工程策略，这是一种将多个相关项目集中存储于单个仓库中的软件开发方式。这种方式在  `React`，`Vscode` 和 `Babel` 等知名项目中均有应用。

对于 DMS 项目而言，我们选择了 [pnpm](https://pnpm.io/)  作为包管理工具。因此，所有依赖项都必须通过 `pnpm` 进行安装，并且我们对 `pnpm` 的版本有特定要求（具体版本信息请参阅项目根目录下的 `package.json` 文件中的 `packageManager` 字段）。

目前，DMS 项目的代码库托管在 GitHub 上，分为两个版本：

- 开源仓库：<https://github.com/actiontech/dms-ui> ，该版本与 sqle v3 版本一同于 2023 年 10 月 24 日开源。
- 私有仓库：<https://github.com/actiontech/dms-ui-ee>

## 项目介绍

### 产品UI设计规范

[文档](https://github.com/actiontech/dms-ui-ee/blob/main-ee/README-UI/README.md)

### 代码仓库相关

#### 代码仓库
  
1. 线上github
   - [开源版](https://github.com/actiontech/dms-ui)

   - [企业版](https://github.com/actiontech/dms-ui-ee)

2. [gitlab 仓库](<http://10.186.18.21/dms/dms-ui>)

#### 主要分支信息

1. 开源版

   - 主分支为 main. 开发过程中基于 main 分支开发然后创建 PR.

2. 企业版

   - 主分支为 main-ee, 开发过程中基于 main-ee 分支开发然后创建 PR.
   - main 分支：与开源版主分支完全相同的一个分支, 作为两个版本之前同步代码的 ”桥梁“.
   - dms-ui-archived：用于保留 dms-ui 前期在 gitlab 上开发的 commit 记录.

#### 技术栈

1. 包管理工具：`pnpm`

   >注意
   >1. 需要使用指定版本的 pnpm，不同的 pnpm 版本可能会引发项目无法正常运行的问题。
   >2. 项目根目录存在 .npmrc 配置文件，该文件指定了项目安装依赖所使用的镜像源，因此无需额外设置 pnpm 的依赖安装源。

   一些常用的 `pnpm` 命令

    - `pnpm install`                     # 安装依赖
    - `pnpm remove [package-name]`       # 移除依赖
    - `pnpm [*]`                         # 执行 scripts 脚本命令, 其中 run 可以省略
    - `pnpm config get registry`         # 查看 pnpm 依赖安装源
    - `pnpm --filter [package-name] [*]` # 执行对应子包的脚本命令

2. 前端构建工具：[vite](https://cn.vitejs.dev/guide/)

3. vscode 插件
   - [React I18n Prompt Tool](https://github.com/actiontech/react-i18n-vscode-extension)：国际化开发插件，相关配置可参考插件文档
   - Prettier - Code formatter：格式化插件
   - ESLint：代码检查工具
   - Code Spell Checker：拼写错误单词检测，推荐安装

4. 主要技术栈

   - `typescript@^5`
   - `react@^18` 以及 react 全家桶 (`react-dom`, `react-redux`, `react-router-dom`, `react-i18next`)
   - `antd@^5`
   - css
     - `less`：因迭代原因，之后仅会存在 `reset.less`, `tool.less`类型文件
     - `style.ts`：styled 的样式模板混合模式
   - 单元测试：`jest`、`enzyme`

#### 支持的浏览器版本

因支持浏览器的最低版本为 Chrome 80，所以在使用一些特性时，需要确认这些特性是否被支持（可以通过 [can i use](https://caniuse.com/) 自行查阅）。

目前已知不兼容 Chrome 80 的特性如下：

- `flex-gap`
- `text-decoration`

#### 项目结构

项目工作区由项目根目录中的 `pnpm-workspace.yaml` 文件决定。目前，项目的主要组件存放在 `packages` 文件夹中。

1. 主结构
   - base：整个项目的基础和入口，包含项目的公共页面模块（包括登录页面、项目首页、全局用户中心和数据源管理等页面）。项目首页的用户引导页面可以跳转至 sqle 和 provision。
   - shared：子项目使用的公共组件、方法、主题等资源。
   - provision：原 provision-ui，目前该项目在 dms-ui-ee 企业版本内。
   - sqle：原 sqle v2 代码。

2. 包结构介绍
     >前置知识说明：若某一个包引入 shared 包后能够正常启动的情况，称其为一个能够单独运行的包
   - base：需要额外引入 sqle 以及 provision 的路由结构运行，因此该包不能单独运行。
   - sqle：该项目自身有着完整的 React 项目结构，仅需引入 shared 后便能单独运行。
   - provision：该项目自身有着完整的 React 项目结构，仅需引入 shared 后便能单独运行。
   - shared：提供公共方法、全局方法、API 定义给上层使用，无法单独运行。

3. 引用注意事项
   - base：作为项目基座，能够引用其他所有的包。
   - shared：通常来说，shared 只能被其他项目所引用，但在 sqle 和 provision 中需要获取 base 中的用户信息等全局状态。为了不在 sqle 和 provision 中直接引用 base，我们在 shared 中提供了引用 base 中 store 以及 api service 的权限。具体示例见 `/shared/lib/global` 目录。
   - sqle：仅能通过 `@actiontech/shared/**` 的方式来引用 shared 里的公共方法或组件。
   - provision：仅能通过 `@actiontech/shared/**` 的方式来引用 shared 里的公共方法或组件。

## 开发相关

### 条件编译

为了区分 sqle 企业版本与社区版本, 在 base 的 vite.config.ts 中添加了条件编译插件, 具体可参考 [文档](https://github.com/LZS911/vite-plugin-conditional-compile/blob/master/README.zh-CN.md)。
<!-- 项目中存在着 ce(社区版本) 和 ee(企业版本), 所以在项目中一般会使用 `shared/lib/components/EnterpriseFeatureDisplay` 组件来处理. 例如: `base/src/page/SyncDataSource/index.tsx`
在实际的代码内部，使用注释条件编译方式如下： -->

条件编译一般处理以下两种情况：

1. 页面整体功能为企业版

   直接使用项目中 `shared/lib/components/EnterpriseFeatureDisplay` 组件处理

2. 页面整体功能为社区版，但某个按钮功能为企业版，需使用以下方式处理

```tsx
   {/* #if [ee] */}
   <Button>text</Button>
   {/* #endif */}
```

其他形式的条件编译示例

```tsx
//== 企业版渲染
    // #if [ee]
    ... some code ...
    // #endif
  
//== 社区版渲染
    // #if [ce]http://10.186.18.11/confluence/pages/viewpage.action?pageId=33822706
    ... some code ...
    // #endif
  
//== sqle 项目渲染
    // #if [sqle]
    ... some code ...
    // #endif
  
//== 开发环境渲染
    // #if [DEV]
    ... some code ...
    // #endif
```

### 开发流程

#### issue 相关

   dms 相关的 issue 需记录在后端仓库 issue 中，由于后端的 dms、dms-ee、sqle、sqle-ee 皆为独立仓库，所以新建 issue 需遵循以下规则：

- sqle 社区版功能变更以及 issue 修复需在 [sqle](https://github.com/actiontech/sqle)仓库新建issue
- sqle 企业版功能变更以及 issue 修复需在 [sqle-ee](https://github.com/actiontech/sqle-ee)仓库新建issue
- dms 社区版功能变更以及 issue 修复需在 [dms](https://github.com/actiontech/dms)仓库新建issue
- dms 企业版功能变更以及 issue 修复需在 [dms-ee](https://github.com/actiontech/dms-ee)仓库新建issue
- provision 功能变更以及 issue 修复需在 Jira 上新建 issue

   > 注意
   >
   > 1. 新增 issue 后需要在 SQLE 飞书讨论群中发消息通知后端负责人。
   > 2. 后端仓库权限需要找后端负责人授权。

#### dms-ui 和 dms-ui-ee 差异介绍

    - 差异：dms-ui-ee 相较于 dms-ui 仅多包含了 provision-ui 相关代码。主要原因为 sqle 为开源项目，但 provision 并未开源。
    - 开发流程
      1. 修复 sqle 社区版、企业版缺陷或新增需求:
         - 基于 dms-ui 的 main 分支开发。开发完成后创建 PR 即可。复审流程经由[复审机器人](http://10.186.18.11/confluence/pages/viewpage.action?pageId=33822706)托管。在 dms-ui 仓库代码合并至 main 分支后，GitHub Action 会自动将改动同步至企业版的 main 分支，并自动创建 dms-ui-ee 仓库中 main -> main-ee 的 PR（若存在代码冲突的情况仍需要手动解决冲突）。
      2. 修复 PROVISION 缺陷或者新增需求:
         - 直接基于企业版 main-ee 分支开发即可.
      3. shared 包调整:
         - 同 1.
      4. DMS 上涉及到 PROVISION 的改动:
         - 例如菜单栏或者首页部分: 同 2. 与 PROVISION 无关的改动: 同 1

#### 如何快速构建 dms 完整的后端服务

  参考 [dms-quick-deploy](http://10.186.18.21/dms/dms-quick-deploy) 文档操作。当然在此之前，你需要一台虚拟机。

  相关拓展：[DMS 添加数据库插件](http://10.186.18.11/confluence/pages/viewpage.action?pageId=127173132)

#### 如何 proxy 至指定的接口地址

   开发环境修改proxy的位置：`packages/base/vite.config.mts`
  
   在 配置 文件内，proxy 存在以下配置,分别为：

- '^(/v|/sqle/v)'：sqle 以及 dms 相关接口的代理服务地址
- ^/provision/v：provision 相关接口的代理服务地址
- '^/logo'：获取 logo 相关数据的代理服务地址

   当需要 proxy 到对应的服务时，使用不同的请求；也可根据 vite 的 [config.proxy](https://cn.vite.dev/config/server-options#server-proxy) 配置自定义 proxy.

#### 如何启动/构建指定版本项目

  参考 [DMS-UI 项目中各脚本指令具体解释](http://10.186.18.11/confluence/pages/viewpage.action?pageId=126878179) 中服务启动以及构建相关命令

#### 新增自定义 Icon

  参考 [icons使用指南](http://10.186.18.11/confluence/pages/viewpage.action?pageId=186778149)

#### 关于 API 定义

   1. 生成 API 定义

      使用 `@actiontech/cli` 包中提供命令生成。关于 cli 包更多信息可参考：[cli文档](http://10.186.18.11/confluence/pages/viewpage.action?pageId=13569279)。

      dms-ui添加了 `pnpm api:g` 脚本用于快捷执行该包的生成命令，可无需在本地安装 cli 包。

   2. 详细信息

      目前，dms-ui 中 API 存放与 `packages/shared/lib/api` 目录下，其中

        - api/base: dms  github 项目
        - api/sqle: sqle-ui github 项目
        - api/provision: provision 项目

   3. API 生成步骤

       - 确认当前需要生成哪个项目的 api
       - 项目根目录执行 `pnpm api:g -p [前端项目名] -b [后端 swagger.json 文件所在的分支]`, 更多 option 可执行 `pnpm api:g --help` 查看

       建议为 API 的更新单独创建 PR

      以下使用生成 sqle 的 api文档举例：

      - 项目根目录执行 `pnpm api:g -p sqle-ui`

      - 生成后的文件，合并入：`packages/shared/lib/api/sqle/service` 文件夹下

#### 开始一个新页面的开发

  参考 [DMS-UI: cli/create-dms-page](http://10.186.18.11/confluence/pages/viewpage.action?pageId=181174319)

#### 单元测试
  
  参考 [关于单元测试](http://10.186.18.11/confluence/pages/viewpage.action?pageId=123241049)

#### 提交 PR 之前的自测流程

    - 满足需求，缺陷的预期
    - 通过项目的 `checker`, `lint`, `cspell`, `jest` 的检测
      - `pnpm checker`
      - `pnpm test:c` 单元测试的行覆盖率不能低于 95%

#### 提交 PR 的 commit message 规范
  
    通常, 每个 Commit message 都由三个部分组成，格式为 `[<type>](<scope>): <subject>`。

     - Type（类型）：指定提交的类型，常见的类型包括：
       - `feature`：新功能
       - `fix`：修复 Bug
       - `docs`：文档变更
       - `style`：代码格式、样式调整
       - `refactor`：重构代码
       - `test`：添加或修改测试代码
       - `chore`：代码库进行维护、优化或其他一般性的改动
       - `ci`: 自动化构建流程修改
       - `build`: 构建过程或依赖项管理相关的变更
     - Scope（范围）（可选）：指定提交影响的范围，例如模块、组件名称等。如果提交影响多个范围，可以使用逗号分隔。
     - Subject（主题）：简明扼要地描述提交的内容。

#### 创建 PR 规范

    - 需要按照 issue 版本要求处理对应分支的代码，若存在 cherry-pick 情况，请通过 git cherry pick 命令同步 commit 记录，而不是手动复制代码。
    - 创建 PR 无需设置复审人，代码复审流程由复审机器人托管处理。
    - 填写合理的 PR 描述 —— 本次变更涉及的改动的简单描述以及对应的 issue。

### 开发规范

**!!!各位开发者在开发过程中，必须要遵守的。复审代码更需熟知!!!**

#### 命名文件夹、文件位置及名称

- 创建文件夹，文件，遵循当前功能归属分类，创建在对应的位置

     如：当前需求为 sqle 项目下单独添加一个功能，那么，该文件夹应该创建在 /packages/sqle/src/page 下，文件夹内容为 当前功能的简称。

- 创建功能模块，遵循归属分类，功能模块下标配文件结构如下：

  - `index.ts`
  - `index.data.ts`
  - `index.type.ts`
  - `__tests__`
    - `index.test.tsx`
  - `components`
    - `Modal`
    - `List`
    - `....Other Com`
  - `hooks`
    - `use[简述当前功能的名称].tsx/.ts`

#### 语言包

   目前每个项目都拥有着自己的语言包, 并同时使用着 shared 里面提供的 common 语言包。

   在开发模式下，会校验每个项目下的语言包是否存在相同的 key 值，如果有相同的，会抛出 Error。

   为了在代码中，可以即时显示语言包对应的中文，方便我们开发模式进行开发。我们开发了 [React I18n Prompt Tool](https://github.com/actiontech/react-i18n-vscode-extension) 插件。

#### 主题

   目前选择配置主题的方案缘由 [关于主题](http://10.186.18.11/confluence/pages/viewpage.action?pageId=119832866)

- 创建 theme 需要遵循 packages 下一级文件夹 (base, shared, sqle 等) 归属分类

- 如何使用主题变量

  - style.ts 样式文件内使用
        如：使用 sqleTheme 下功能模块定义的变量
        background-color: ${({ theme }) => theme.sqleTheme.auditPlan.detail.tag.default.background}

#### 公共组件、hooks、css

    所有公共的东西，遵循使用的地方，超过 1 处的规则。
    而创建所在的位置，与它所使用的模块有关。例如：当前使用的位置是在项目 sqle, provision 下面，那公共的文件应创建在 shared 下；当前使用的位置是在 sqle 下多个模块下，那公共的文件应创建的位置在 sqle/ 下对应的文件夹(hooks, components)下。以此类推。

#### 路由

- 如何注册路由

      遵守当前功能模块的归属（所谓归属，即功能属于哪个基础分类，如：全局，sqle, provision 等），在对应的归属下，按照是否需要权限，在对应父级路由的下面，创建子路由。若当前为新的一个父级分类，则在对应归属下，追加新的路由数据。
      新的菜单路由，注意
  - 需要新的菜单 icon
  - 是否位于项目内

- 路由跳转

      可参考 [DMS-UI 路由跳转优化](http://10.186.18.11/confluence/pages/viewpage.action?pageId=174489722)

#### 关于antd

- 引用 antd es 下的组件

     由于项目使用 Vite，并且 Vite 默认使用 ES 模块化导入方式，当引入类似 `antd/lib/form/Form` 的路径时，会导致打包产物出现错误。为了解决这个问题，需要统一使用 `antd/es/form/Form` 的引用方式。

- 使用 Message 等组件

     引用方式
     当直接使用 Message、Modal、Notification 的静态方法时, context、redux 的内容和 ConfigProvider 的 locale/prefixCls/theme 等配置, 导致项目中为兼容 chrome 80 引入的 `@ant-design/cssinjs` 对上述组件无效, 建议 Message、Notification 优先使用 hooks 的方式来创建, Modal 可以使用 Modal 组件以及 Modal.useModal.

     文档链接：[antd 文档](https://ant.design/components/message-cn#faq)、[issue 地址](https://github.com/ant-design/ant-design/issues/36911)

- 防止 Modal 组件可能出现的性能问题, 创建 Modal 时优先使用 Modal 组件和 Modal.useModal, 禁止使用 `const { modal } = App.useApp();` 的方式来创建 Modal.

     文档链接：[issue 地址](https://github.com/ant-design/ant-design/issues/36911)

- 贴合项目功能与主题的基础组件

     为了贴合项目的主题，或贴合项目的业务逻辑，我们对 antd 内的组件进行了一些二次封装。

     所以，在使用 antd 的 Button、Select、DatePicker.RangePicker、Input、Segmented 组件时, 需要使用 shared 对应进行样式二次封装的组件. 例 `shared/lib/components/BasicSegmented`。
