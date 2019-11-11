import request from '@/utils/request'

// 审核课程分页列表接口
export function courseAuditList(params, pageCurrent = 1, pageSize = 20) {
  return request({
    url: '/course/pc/course/audit/list',
    method: 'post',
    data: { pageCurrent: pageCurrent, pageSize: pageSize, ...params }
  })
}

// 审核课程详情接口
export function courseAuditView(id) {
  return request({
    url: '/course/pc/course/audit/view',
    method: 'post',
    data: { id: id }
  })
}

// 审核课程更新接口
export function courseAuditUpdate(data = {}) {
  return request({
    url: '/course/pc/course/audit/update',
    method: 'post',
    data: data
  })
}

// 审核课程审核接口
export function courseAudit(data = {}) {
  return request({
    url: '/course/pc/course/audit/audit',
    method: 'post',
    data: data
  })
}

// 课程分页列表接口
export function courseList(params, pageCurrent = 1, pageSize = 20) {
  return request({
    url: '/course/pc/course/list',
    method: 'post',
    data: { pageCurrent: pageCurrent, pageSize: pageSize, ...params }
  })
}

// 课程保存接口
export function courseSave(data = {}) {
  return request({
    url: '/course/pc/course/save',
    method: 'post',
    data: data
  })
}

// 课程更新接口
export function courseUpdate(data = {}) {
  return request({
    url: '/course/pc/course/update',
    method: 'post',
    data: data
  })
}

// 课程详情接口
export function courseView(id) {
  return request({
    url: '/course/pc/course/view',
    method: 'post',
    data: { id: id }
  })
}

// 课程详情接口(用于修改)
export function courseViewForEdit(data = {}) {
  return request({
    url: '/course/pc/course/get',
    method: 'post',
    data: data
  })
}

// 课程分类分页列表接口
export function categoryList(params, pageCurrent = 1, pageSize = 20) {
  return request({
    url: '/course/pc/course/category/list',
    method: 'post',
    data: { pageCurrent: pageCurrent, pageSize: pageSize, ...params }
  })
}

// 课程分类信息树接口
export function listForTree(data = {}) {
  return request({
    url: '/course/api/course/category/listForTree',
    method: 'post',
    data: data
  })
}

// 课程分类保存接口
export function categorySave(data = {}) {
  return request({
    url: '/course/pc/course/category/save',
    method: 'post',
    data: data
  })
}

// 课程分类更新接口
export function categoryUpdate(data = {}) {
  return request({
    url: '/course/pc/course/category/update',
    method: 'post',
    data: data
  })
}

// 课程分类删除接口
export function categoryDelete(data = {}) {
  return request({
    url: '/course/pc/course/category/delete',
    method: 'post',
    data: data
  })
}

// 课程分类查看接口
export function categoryView(data = {}) {
  return request({
    url: '/course/pc/course/category/view',
    method: 'post',
    data: data
  })
}

// 课程章节分页列表接口
export function courseChapterList(params, pageCurrent = 1, pageSize = 20) {
  return request({
    url: '/course/pc/course/chapter/list',
    method: 'post',
    data: { pageCurrent: pageCurrent, pageSize: pageSize, ...params }
  })
}

// 更新课程章节信息
export function courseChapterUpdate(data = {}) {
  return request({
    url: '/course/pc/course/chapter/update',
    method: 'post',
    data: data
  })
}

// 删除课程章节信息
export function courseChapterDelete(data = {}) {
  return request({
    url: '/course/pc/course/chapter/delete',
    method: 'post',
    data: data
  })
}
// 保存课程章节信息
export function courseChapterSave(data = {}) {
  return request({
    url: '/course/pc/course/chapter/save',
    method: 'post',
    data: data
  })
}
//课时分页列表接口
export function chapterPeriodList(data = {}) {
  return request({
    url: '/course/pc/course/period/list',
    method: 'post',
    data: data
  })
}
//课时更新接口
export function chapterPeriodUpdate(data = {}) {
  return request({
    url: '/course/pc/course/period/update',
    method: 'post',
    data: data
  })
}
//课时删除接口
export function chapterPeriodDelete(data = {}) {
  return request({
    url: '/course/pc/course/period/delete',
    method: 'post',
    data: data
  })
}
//课时保存接口
export function chapterPeriodSave(data = {}) {
  return request({
    url: '/course/pc/course/period/save',
    method: 'post',
    data: data
  })
}
