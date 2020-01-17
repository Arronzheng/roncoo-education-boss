import request from '@/utils/request'

// 评论分页列表接口
export function commentList(params, pageCurrent = 1, pageSize = 20) {
  return request({
    url: '/course/pc/courseComment/list',
    method: 'post',
    data: { pageCurrent: pageCurrent, pageSize: pageSize, ...params }
  })
}
// 评论修改接口
export function commentUpdate(data = {}) {
  return request({
    url: '/course/pc/courseComment/update',
    method: 'post',
    data: data
  })
}
