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
  }
}
