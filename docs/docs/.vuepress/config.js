module.exports = {
    base: '/xunwei-web/SDK/SoonSpace/Docs/',
    title: 'SoonSpace 1.x',
    description: '简洁易学的webGL插件',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
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
            { text: '样例', link: 'http://111.231.137.202:9018/xunwei-web/SDK/SoonSpace/' },
            { text: 'GitHub', link: 'https://github.com/xuekai-china/soon-space' },
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