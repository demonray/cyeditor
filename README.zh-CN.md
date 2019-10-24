简体中文 | [English](README.md)

# CyEditor

一个可视化等流程图编辑器基于 [cytoscape.js](https://github.com/cytoscape/cytoscape.js).

## Demo

[示例](https://demonray.github.io/cyeditor/)

![demo image](https://github.com/demonray/cyeditor/blob/master/examples/example.png)

## 安装

### npm

```sh
npm install cyeditor
```

### umd

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cyeditor@${version}/dist/cyeditor.css">
<!-- 引入组件库 -->
<script src="https://cdn.jsdelivr.net/npm/cyeditor@${version}/dist/cyeditor.umd.min.js"></script>
```

### 启动示例

```sh
$ git clone https://github.com/demonray/cyeditor.git
$ cd cyeditor
$ npm install
$ npm run serve
```

## 文档

* 详细文档见 [Github Pages](https://demonray.github.io/guide/)

### 特性 

- [x] 导航器提供预览图，方便查看
- [x] 表格辅助
- [x] 内置形状，并支持自定义形状
- [x] 可配置的工具栏，提供常用操作
- [x] 节点大小控制及节点信息编辑
- [x] 支持自定义的右键菜单
- [x] 支持流程图导出为图片，导出json数据
- [ ] 更多边类型支持，虚线
- [ ] 元素信息提示浮层