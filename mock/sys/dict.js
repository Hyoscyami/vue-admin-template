const Mock = require('mockjs')

const data = Mock.mock({
  'records|20': [{
    id: '@id',
    parentId: 0,
    name: '状态@id',
    isLeaf: false,
    code: 'status',
    value: null,
    sort: 1,
    description: '系统通用状态',
    status: 1,
    createTime: '2021-05-10T10:17:14',
    modifyTime: null,
    creatorName: '超级管理员',
    modifierName: null,
    hasNext: false
  }]
})
module.exports = [
  {
    url: '/mock/dict/list',
    type: 'post',
    response: config => {
      const { parentId } = config.body
      data.records.forEach(item => {
        item.parentId = parentId
      })
      data.records[data.records.length - 1].hasNext = true
      console.log('mock:', data)
      data.total = 50000
      return {
        code: '00000',
        data: data
      }
    }
  }
]
