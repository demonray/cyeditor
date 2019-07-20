module.exports = {
  title: 'CyEditor',
  description: 'A visual flow chart editor based on cytoscape.js.',
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }],
  ],
  base: '/',
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    nav:[
      {text: 'Demo', link: '/'},
      {text: '指南', link: '/guide/'},
      {text: '配置', link: '/config/'},
      {text: 'Github', link: 'https://github.com/demonray/cyeditor'}
    ],
    sidebar: ['/guide/', '/config/'],
    sidebarDepth: 2, // 侧边栏显示2级
  }
}
