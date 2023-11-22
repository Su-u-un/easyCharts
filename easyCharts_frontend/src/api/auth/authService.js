import request from '@/utils/httpRequest'

export default {
  login: function (data) {
    return request({
      url: '/users/login',
      method: 'post',
      data: data
    })
  },
  register: function (data) {
    const { username, password } = data
    return request({
      url: '/users/register',
      method: 'post',
      data: { 
        'username':username,
        'password':password 
      }
    })
  },
  updatePWD: function (data) {
    const { username, password } = data
    return request({
      url: '/users/updatePWD',
      method: 'post',
      data: { 
        'username':username,
        'password':password 
      }
    })
  },
  info: function () {
    return request({
      url: '/users/info',
      method: 'get'
    })
  },
  getCode: function () {
    return request({
      url: '/sys/getCode',
      method: 'get'
    })
  },
}
