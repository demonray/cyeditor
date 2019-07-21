---
sidebar: auto
---

# 配置

```javascript
let config = {
  cy: {}, // options for cytoscape
  editor: {}
}
let cyEditor = new CyEditor(config)
```

## editor基本配置

### container

- 类型: `string`
- 默认值: `''`

Dom 元素或者选择器，编辑器渲染容器

### zoomRate

- 类型: `number`
- 默认值: `0.2`

缩放速率，每次放大或者缩小比例

### lineType

- 类型: `string`
- 默认值: `'bezier'`

边类型，'bezier'，'straight'，'taxi'

### noderesize

- 类型: `Boolean`
- 默认值: `true`

通过拖拽改变大小

### dragAddNodes

- Type: `Boolean`
- Default: `true`



### elementsInfo

- 类型: `Boolean`
- 默认值: `true`

节点信息面板

### toolbar

- 类型: `toolbar`
- 默认值: `true`

工具栏配置

### snapGrid

- 类型: `Boolean`
- 默认值: `true`

表格辅助


### contextMenu

- 类型: `boolean`
- 默认值: `true`

右键菜单配置


### navigator

- 类型: `Boolean`
- 默认值: `true`

导航器，提供缩略图预览

### useDefaultNodeTypes

- 类型: `Boolean`
- 默认值: `true`

是否使用内置的节点类型

### nodeTypes

- 类型: `Array`
- 默认值: `[]`

节点类型定义


## cy基本配置

详见 cytoscape.js [basic options](http://js.cytoscape.org/#getting-started/specifying-basic-options)

### 注意
::: tip 提示
container 配置项会被忽略
:::

::: danger 提示
配置 style 会覆盖编辑器定义的内置样式，可能造成节点形状丢失，颜色控制失效等问题
:::