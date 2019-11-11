<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" size="mini">
        <el-form-item>
        </el-form-item>
        <el-form-item label="章节名称：">
          <el-input v-model.trim="map.chapterName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon='el-icon-search' type="primary" @click="handleCheck">查询</el-button>
          <el-button icon='el-icon-refresh' class="filter-item" @click="handleReset">重置</el-button>
          <el-button v-has="'/course/pc/course/list'" type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAddRow()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="ctrl.loading" size="medium" :data="list" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="chapterName" label="章节名称" width="250">
        </el-table-column>
        <el-table-column label="章节描述" width="200" prop="chapterDesc">
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.categoryName1}}/{{scope.row.categoryName2}}/{{scope.row.categoryName3}}-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="是否免费" width="100" prop="isFree" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isFree === 1" type="success">免费</el-tag>
            <el-tag v-if="scope.row.isFree === 0" type="danger">收费</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="170"
          prop="statusId"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.statusId"
              @change="handleChangeStatus(scope.row.id, scope.row.statusId)"
              :active-value="0"
              :inactive-value="1"
              active-color="#ff4949"
              inactive-color="#13ce66"
              active-text="禁用"
              inactive-text="正常">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
<!--            <ul class="list-item-actions">-->
<!--              <li>-->
                <el-button type="danger" @click="handleDelRow(scope.row)" size="mini">删除</el-button>
                <el-button v-has="'/course/pc/course/list'" type="primary" @click="handleChapterPeriod(scope.row.id,scope.row.chapterName)" size="mini">课时管理</el-button>
                <el-button v-has="'/course/pc/zone/course/edit'" type="success" @click="handleUpdateRow(scope.row)" size="mini">修改</el-button>
<!--              </li>-->
<!--            </ul>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="mgt20">
        <el-pagination
          background
          style="float: right;margin-top: 20px; margin-bottom: 22px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="page.pageSize"
          :page-sizes="[20, 50, 100, 200, 500, 1000]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.totalCount">
        </el-pagination>
        <add :visible="ctrl.dialogVisible" :formData="formData" :courseId="courseId" :title="ctrl.dialogTitle" @close-callback="closeCallback"></add>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/course'
  import Add from './add'
  import Edit from './edit'
    export default {
        name: "Chapter",
        components: { Add, Edit },
        data() {
          return {
            ctrl: {
                loading: false,
                dialogVisible: false
            },
            map: {}, //查询条件
            courseId: '',
            courseName: '',
            list: [],
            formData: {
                sort: 1
            },
            page: {
              beginPageIndex: 1,
              pageCurrent: 1,
              endPageIndex: 8,
              pageSize: 20,
              totalCount: 0,
              totalPage: 0
            }
          }
        },
        mounted() {
            this.map.courseId = this.$route.query.courseId
            this.courseId = this.$route.query.courseId
            this.courseName = this.$route.query.courseName
            this.getList(this.map)
        },
        methods: {
            //修改
            handleUpdateRow(data) {
                console.log(data);
                this.formData = data
                this.ctrl.dialogTitle = this.courseName + '——编辑'
                this.ctrl.dialogVisible = true
            },
            //新增
            handleAddRow(zoneId) {
                // this.zoneId = this.$route.query.zoneId
                this.formData = { sort: 1 }
                this.ctrl.dialogTitle = this.courseName + '——新增'
                this.ctrl.dialogVisible = true
            },
            //删除
            handleDelRow(data) {
                this.$confirm(`确定删除这条数据?`, '我要删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.map = {
                        id: data.id
                    }
                    this.ctrl.loading = true
                    api.courseChapterDelete(this.map).then(res => {
                        this.ctrl.loading = false
                        if (res.code === 200 && res.data > 0) {
                            this.$message({
                                type: 'success',
                                message: "删除成功"
                            });
                            this.reload()
                        } else {
                            this.$message({
                                type: 'error',
                                message: "删除失败"
                            });
                        }
                    }).catch(() => {
                        this.ctrl.loading = false
                    })
                })
            },
            //启用禁用
            handleChangeStatus(id, statusId) {
                const title = { 0: '禁用', 1: '启用' }
                this.$confirm(`确定要${title[statusId]}吗?`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.ctrl.loading = true
                    this.changeStatus(id, statusId)
                }).catch(() => {
                    this.reload()
                })
            },
            //改变状态
            changeStatus(id, statusId) {
                api.courseChapterUpdate({ id, statusId }).then(res => {
                    this.ctrl.loading = false
                    if (res.code === 200 && res.data > 0) {
                        const msg = { 0: '禁用成功', 1: '启用成功' }
                        this.$message({
                            type: 'success',
                            message: msg[statusId]
                        });
                        this.reload()
                    } else {
                        const msg = { 0: '禁用失败', 1: '启用失败' }
                        this.$message({
                            type: 'error',
                            message: msg[statusId]
                        });
                    }
                    this.reload()
                }).catch(() => {
                    this.ctrl.loading = false
                    this.reload()
                })
            },
            // 查询
            handleCheck() {
                this.map.pageNum = 1
                this.getList()
            },
            // 重置查询条件
            handleReset() {
                this.reload()
            },
            reload() {
                this.formData = {}
                this.map = {}
                this.map.courseId = this.$route.query.courseId
                this.getList()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`)
                this.map.pageSize = val
                this.getList()
            },
            handleCurrentChange(val) {
                this.map.pageCurrent = val
                this.getList()
                // console.log(`当前页: ${val}`)
            },
            // 关闭编辑弹窗回调
            closeCallback() {
                this.ctrl.dialogVisible = false
                this.reload()
            },
            getList() {
                this.ctrl.loading = true
                this.map.courseId = this.$route.query.courseId
                if (typeof this.map.courseId === 'undefined') {
                  this.$message.error('错了哦，获取不到章节信息~');
                  this.ctrl.loading = false
                  return;
                }
                api.courseChapterList(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
                    this.page = res.data
                    this.page.numPerPage = res.data.pageSize
                    this.list = res.data.list
                    this.ctrl.loading = false
                }).catch(() => {
                    this.ctrl.loading = false
                })
            },
            handleChapterPeriod(id, name) {
                this.$router.push({ path: '/course/course/period', query: { chapterId: id, chapterName: name }});
            }
        }
    }
</script>

<style scoped>

</style>
