const locale = 'en'

const data = {
  en: {
    'toolbar-undo': 'Undo',
    'toolbar-redo': 'Redo',
    'toolbar-zoomin': 'Zoom in',
    'toolbar-zoomout': 'Zoom out',
    'toolbar-boxselect': 'Select',
    'toolbar-copy': 'Copy',
    'toolbar-paste': 'Paste',
    'toolbar-delete': 'Delete',
    'toolbar-leveldown': 'Move Down',
    'toolbar-levelup': 'Move Up',
    'toolbar-line-straight': 'Line',
    'toolbar-line-taxi': 'Elbow connector',
    'toolbar-line-bezier': 'Curved connector',
    'toolbar-gridon': 'Show grid',
    'toolbar-fit': 'Snap to grid',
    'toolbar-save': 'Save',
    'element-text': 'Text',
    'elements-title': 'Element',
    'elements-label': 'Label',
    'elements-wrap': 'Size',
    'elements-background-color': 'Background',
    'elements-text-color': 'Text color',
    'elements-color': 'Color',
    'window-navigator': 'Navigator',
    'node-types-base-shape': 'Base Shape'
  },
  cn: {
    'toolbar-undo': '撤销',
    'toolbar-redo': '重做',
    'toolbar-zoomin': '放大',
    'toolbar-zoomout': '缩小',
    'toolbar-boxselect': '框选',
    'toolbar-copy': '复制',
    'toolbar-paste': '粘贴',
    'toolbar-delete': '删除',
    'toolbar-leveldown': '层级后置',
    'toolbar-levelup': '层级前置',
    'toolbar-line-straight': '直线',
    'toolbar-line-taxi': '折线',
    'toolbar-line-bezier': '曲线',
    'toolbar-gridon': '表格辅助',
    'toolbar-fit': '适应画布',
    'toolbar-save': '保存',
    'element-text': '文字',
    'elements-title': '元素',
    'elements-label': '名称',
    'elements-wrap': '尺寸',
    'elements-background-color': '背景',
    'elements-text-color': '文字',
    'elements-color': '颜色',
    'window-navigator': '导航器',
    'node-types-base-shape': '基础形状'
  }
}

function localize (key) {
  if (key in data[locale]) {
    return data[locale][key]
  } else {
    return ('Unknown: ' + key)
  }
}

export default localize
