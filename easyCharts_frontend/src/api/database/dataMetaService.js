import request from '@/utils/httpRequest'

export default {
  queryNeedByDataSetId: function (id) {
    return request({
      url: '/data/dataMeta/queryNeedByDataSetId',
      method: 'get',
      params: { id: id }
    })
  }
}
