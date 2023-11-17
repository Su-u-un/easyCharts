import request from '@/utils/httpRequest'

export default {
  save: function (inputForm) {
    return request({
      url: '/sys/user/save',
      method: 'post',
      headers: { arrayFormat: 'repeat' },
      data: inputForm
    })
  },

  saveInfo: function (inputForm) {
    return request({
      url: '/sys/user/saveInfo',
      method: 'post',
      headers: { arrayFormat: 'repeat' },
      data: inputForm
    })
  },

  savePwd: function (inputForm) {
    return request({
      url: '/sys/user/savePwd',
      method: 'put',
      params: inputForm
    })
  },

  delete: function (ids) {
    return request({
      url: '/sys/user/delete',
      method: 'delete',
      params: { ids: ids }
    })
  },

  queryById: function (id) {
    return request({
      url: '/sys/user/queryById',
      method: 'get',
      params: { id: id }
    })
  },

  getMenus: function () {
    return request({
      url: '/sys/user/getMenus',
      method: 'get'
    })
  },

  info: function () {
    return request({
      url: '/sys/user/info',
      method: 'get'
    })
  },

  list: function (params) {
    return request({
      url: '/sys/user/list',
      method: 'get',
      params: params
    })
  },
  exportTemplate: function () {
    return request({
      url: '/sys/user/import/template',
      method: 'get',
      responseType: 'blob'
    })
  },

  exportExcel: function (params) {
    return request({
      url: '/sys/user/export',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },

  importExcel: function (data) {
    return request({
      url: '/sys/user/import',
      method: 'post',
      data: data
    })
  }
}
