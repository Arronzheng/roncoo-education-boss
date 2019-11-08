import request from '@/utils/request'
//公共接口

// 上传图片
export function uploadPic(data = {}) {
  return request({
    url: `/course/pc/api/upload/pic`,
    method: 'post',
    data: data
  })
}

// 下载图片
// export function downPic(params) {
//   return request({
//     url: `/course/pc/api/down/show`,
//     method: 'post',
//     data: params
//   })
// }

// 列出用户菜单
export function menuUserList(params) {
  return request({
    url: '/system/pc/menu/user/list',
    method: 'post',
    data: params
  })
}

export function enumList(enumName) {
  return request({
    url: `/system/pc/api/sys/enum/list`,
    method: 'post',
    data: { enumName: enumName }
  })
}

// 列出菜单
export function menuBtnList(data = {}) {
  return request({
    url: `/system/pc/menu/user/button/list`,
    method: 'post',
    data: data
  })
}
