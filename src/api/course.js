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
export function courseAuditAudit(data = {}) {
  return request({
    url: '/course/pc/course/audit/audit',
    method: 'post',
    data: data
  })
}

// 课程审核保存接口
export function courseAuditSave(data = {}) {
  return request({
    url: '/course/pc/course/audit/save',
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

// 课程删除接口
export function courseDelete(data = {}) {
  return request({
    url: '/course/pc/course/delete',
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
export function courseChapterAuditList(params, pageCurrent = 1, pageSize = 20) {
  return request({
    url: '/course/pc/course/chapter/audit/list',
    method: 'post',
    data: { pageCurrent: pageCurrent, pageSize: pageSize, ...params }
  })
}

// 更新课程章节信息
export function courseChapterAuditUpdate(data = {}) {
  return request({
    url: '/course/pc/course/chapter/audit/update',
    method: 'post',
    data: data
  })
}

// 删除课程章节信息
export function courseChapterAuditDelete(data = {}) {
  return request({
    url: '/course/pc/course/chapter/audit/delete',
    method: 'post',
    data: data
  })
}
// 保存课程章节信息
export function courseChapterAuditSave(data = {}) {
  return request({
    url: '/course/pc/course/chapter/audit/save',
    method: 'post',
    data: data
  })
}
//课时分页列表接口
export function chapterPeriodAuditList(data = {}) {
  return request({
    url: '/course/pc/course/period/audit/list',
    method: 'post',
    data: data
  })
}
//课时更新接口
export function chapterPeriodAuditUpdate(data = {}) {
  return request({
    url: '/course/pc/course/period/audit/update',
    method: 'post',
    data: data
  })
}
//课时删除接口
export function chapterPeriodAuditDelete(data = {}) {
  return request({
    url: '/course/pc/course/period/audit/delete',
    method: 'post',
    data: data
  })
}
//课时保存接口
export function chapterPeriodAuditSave(data = {}) {
  return request({
    url: '/course/pc/course/period/audit/save',
    method: 'post',
    data: data
  })
}
