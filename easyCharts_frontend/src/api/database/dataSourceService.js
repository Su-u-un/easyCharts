import request from '@/utils/httpRequest'

export default {
  save: function (inputForm) {
    return request({
      url: '/data/dataSource/save',
      method: 'post',
      data: inputForm
    })
  },

  test: function (inputForm) {
    return request({
      url: '/data/dataSource/test',
      method: 'post',
      data: inputForm
    })
  },

  delete: function (ids) {
    return request({
      url: '/data/dataSource/delete',
      method: 'delete',
      params: { id: ids }
    })
  },

  queryById: function (id) {
    return request({
      url: '/data/dataSource/queryById',
      method: 'get',
      params: { id: id }
    })
  },

  list: function (params) {
    return request({
      url: '/data/dataSource/list',
      method: 'get',
      params: params
    })
  },

  treeData: function () {
    return request({
      url: '/database/datalink/dataSource/treeData',
      method: 'get'
    })
  }
}
