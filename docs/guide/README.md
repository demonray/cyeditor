---
sidebar: auto
---

# 指南

## 介绍

### 简介

可视化的流程图编辑器基于[cytoscape.js](https://github.com/cytoscape/cytoscape.js).

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

## 开始使用

### 安装

#### npm

使用 npm 的方式安装，与 webpack 打包工具配合使用。

```sh
npm install cyeditor
```

#### CDN

目前可以通过 [jsdelivr](https://cdn.jsdelivr.net/npm/cyeditor/) 获取到最新版本的资源，在页面上引入 js 和 css 文件即可开始使用。

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cyeditor@${version}/dist/cyeditor.css">
<!-- 引入组件库 -->
<script src="https://cdn.jsdelivr.net/npm/cyeditor@${version}/dist/cyeditor.umd.min.js"></script>
```

### Vue 组件

创建你的vue组件, cyeditor.js:

```javascript
import CyEditor from 'cyeditor'
export default {
  name: 'CyEditor',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    cyConfig: {
      type: Object,
      default: () => ({})
    },
    editorConfig: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    const container = this.$el
    let config = {
      cy: {
        ...this.cyConfig
      },
      editor: {
        container,
        ...this.editorConfig
      }
    }
    this.cyEditor = new CyEditor(config)
    this.cyEditor.json(this.value)
    this.cyEditor.on('change', (scope, editor) => {
      let json = this.cyEditor.json()
      console.log(json)
    })
  },
  render (h) {
    return h('div')
  }
}
```

然后像使用普通vue组件一样：

```html
<template>
  <cy-editor
    class="cy-editor"
    :value="value"
    :cy-config="cyConfig"
    :editor-config="editorConfig"
    @change="change"
  />
</template>

<script>
import cyEditor from './cyeditor.js'

export default {
  name: 'App',
  components: {
    cyEditor
  },
  data () {
    return {
      value: {
        zoom: 0.7,
        pan: { x: 100, y: 40 },
        elements: {
          nodes: [{
            'data': {
              'type': 'round-rectangle',
              'name': '开始',
              'resize': true,
              'bg': '#1890FF',
              'width': 76,
              'height': 56,
              'id': 'a79249d9-4d5b-43e1-b268-d389df7ed592'
            },
            'position': {
              'x': 192.5,
              'y': 52.5
            }
          }, {
            'data': {
              'type': 'round-rectangle',
              'name': '',
              'resize': true,
              'bg': '#1890FF',
              'width': 76,
              'height': 56,
              'id': '27e14443-0b39-446f-94e2-3e521a1706f9'
            },
            'position': {
              'x': 87.5,
              'y': 262.5
            }
          }, {
            'data': {
              'type': 'diamond',
              'name': '条件',
              'resize': true,
              'bg': '#5CDBD3',
              'width': 156,
              'height': 52,
              'id': '4072b83e-b702-4168-b548-56bcc52eebd9'
            },
            'position': {
              'x': 192.5,
              'y': 157.5
            }
          }, {
            'data': {
              'type': 'round-rectangle',
              'name': '',
              'resize': true,
              'bg': '#1890FF',
              'width': 76,
              'height': 56,
              'id': '6be4a6b0-49e2-4b2c-b3bd-135684da938a'
            },
            'position': {
              'x': 297.5,
              'y': 262.5
            }
          }, {
            'data': {
              'id': '129c6fa8-a876-4eb9-942c-ec25fc1bbe39'
            },
            'position': {
              'x': 297.5,
              'y': 262.5
            }
          }],
          edges: [{
            'data': {
              'source': 'a79249d9-4d5b-43e1-b268-d389df7ed592',
              'target': '4072b83e-b702-4168-b548-56bcc52eebd9',
              'lineType': 'taxi',
              'id': '3e6d9858-adbe-4b73-828d-d0732ac29279'
            },
            'position': {
              'x': 17.5,
              'y': 17.5
            }
          }, {
            'data': {
              'source': '4072b83e-b702-4168-b548-56bcc52eebd9',
              'target': '27e14443-0b39-446f-94e2-3e521a1706f9',
              'lineType': 'taxi',
              'id': 'b63708fe-3b53-469a-b908-4c9608112164'
            },
            'position': {
              'x': 17.5,
              'y': 17.5
            }
          }, {
            'data': {
              'source': '4072b83e-b702-4168-b548-56bcc52eebd9',
              'target': '6be4a6b0-49e2-4b2c-b3bd-135684da938a',
              'lineType': 'taxi',
              'id': '0c4d0dc9-a2ee-4ea5-b422-4730913a7ab1'
            },
            'position': {
              'x': 17.5,
              'y': 17.5
            }
          }]
        }
      },
      cyConfig: {},
      editorConfig: {
        lineType: 'taxi'
      }
    }
  },
  mounted () {
    //
  },
  computed: {},
  methods: {
    change () {
      //
    }
  }
}

</script>
<style scoped lang="stylus">
  .cy-editor {
    width: 100%;
    height: 600px;
    position: relative;
  }
</style>
```