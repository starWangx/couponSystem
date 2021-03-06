/**
 * 所有定义的参数，全写再index.js太长了，单独写一个文件
 * 主要涵盖：面包屑，搜索，分页
 */
export default {
    /*面包屑导航*/
    breadMenu: [{
        path: '',
        title: '商城'
    }, {
        path: '',
        title: '会场管理'
    }],
    // 搜索数据，默认一行显示3条
    searchMenu: {
        // 常在的选项
        open: [{
            id: 'blackMobile',
            label: '手机号',
            type: 'input', // input输入框
            placeholder: '请输入手机号',
        },],
    },
}