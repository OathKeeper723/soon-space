module.exports = {
    base: '/Docs/SoonSpace/',
    title: 'SoonSpace-docs',
    description: '智慧城市可视化管理平台-迅维智能科技主要研究建筑信息化和智能化，有智慧建筑、智慧园区、智慧安防、智慧消防、特色小镇、物联网、资产可视化管理平台等。',
    configureWebpack: {
        resolve: {
            alias: {
                '@alias': 'path/to/some/dir'
            }
        }
    },
    markdown: {
        lineNumbers: false,
    },
    themeConfig: {
        nav: [
            { text: '教程', link: '/Course/' },
            { text: 'API', link: '/api/' },
            { text: '样例', link: 'http://soon.xwbuilders.com:8787/SDK/SoonSpace/' },
            { text: 'GitHub', link: 'https://github.com/xuekai-china/soonspace' },
        ],
        displayAllHeaders: true,
        sidebar: {
            '/Course/': [
                ''
            ],
            '/api/': [
                ''
            ]
        },
        lastUpdated: '最后更新',
    }
}