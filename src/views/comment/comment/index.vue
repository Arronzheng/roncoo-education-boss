<template >
  <div class="pad20">
    <div class="filter-container">
      <el-form :inline="true" size="mini">
        <el-form-item label="评论内容:">
          <el-input v-model.trim="map.content"></el-input>
        </el-form-item>
        <el-form-item label="评论时间：" >
          <div>
            <dateTimePicker style="width: 357px" v-model="createTime" ref="dataRange" type="datetimerange"></dateTimePicker>
          </div>
        </el-form-item>
        <el-form-item label="状态:" >
          <el-select v-model="map.status" class="auto-width" clearable filterable placeholder="状态" style="width: 85px">
            <el-option
              v-for="item in opts.statusIdList"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon='el-icon-search' type="primary" @click="handleCheck">查询</el-button>
          <el-button icon='el-icon-refresh' class="filter-item" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="ctrl.load"
      size="medium"
      :data="list"
      stripe
      border
      row-key="id"
      :default-expand-all="false">
      <el-table-column type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="content" label="评论内容" width="300">
      </el-table-column>
      <el-table-column prop="courseName" label="课程名称" width="200">
      </el-table-column>>
      <el-table-column prop="userExtName" label="评论人" width="180">
      </el-table-column>
<!--      <el-table-column v-if="parentUserExtName === ''" prop="parentUserExtName" label="被回复人" width="180">-->
<!--      </el-table-column>-->
      <el-table-column label="被回复人" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.parentUserExtName === '' || scope.row.parentUserExtName === null">-</span>
          <span v-else>{{scope.row.parentUserExtName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="评论时间" width="180">
      </el-table-column>
      <el-table-column
        width="160"
        prop="status"
        label="是否置顶"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.parentNo === 0"
            v-model="scope.row.topping"
            @change="handleChangeTopping(scope.row, $event)"
            :active-value="2"
            :inactive-value="1"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="否"
            inactive-text="是">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        prop="status"
        label="状态"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleChangeStatus(scope.row, $event)"
            :active-value="0"
            :inactive-value="1"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="禁用"
            inactive-text="正常">
          </el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-has="'/course/pc/courseComment/delete'" type="danger" @click="handleDelRow(scope.row.id)" size="mini">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
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
  </div>
</template>
<script>
import * as api from '@/api/comment'
import dateTimePicker from '@/components/DateRange/dateTimePicker';
export default {
  components: { dateTimePicker },
  data() {
    return {
        ctrl: {
          load: false
        },
        map: {},
        createTime: '',
        list: [],
        opts: {
            statusIdList: []
        },
        page: {
            beginPageIndex: 1,
            currentPage: 1,
            endPageIndex: 8,
            pageSize: 20,
            totalCount: 0,
            totalPage: 0
        }
    }
  },
  mounted() {
      this.getList()
      //this.vb = this.visible
      this.$store.dispatch('GetOpts', { enumName: "StatusIdEnum", type: 'arr' }).then(res => {
          this.opts.statusIdList = res
      })
  },
  watch: {
      // 注册时间段查询条件
      'createTime': function(createTime) {
          if (this.createTime !== null && this.createTime.length) {
              this.map.beginCreateTime = this.createTime[0]
              this.map.endCreateTime = this.createTime[1]
          } else {
              this.map.beginCreateTime = ''
              this.map.endCreateTime = ''
          }
          console.log(this.map)
      }
  },
  methods: {
      getList() {
          this.ctrl.load = true
          api.commentList(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
              this.ctrl.load = false
              this.list = res.data.list
              this.page.pageSize = res.data.pageSize
              this.page.totalCount = res.data.totalCount
          }).catch(() => {
              this.ctrl.load = false
          })
      },
      handleCheck() {
          this.page.pageCurrent = 1
          this.getList()
      },
      handleReset() {
          this.reload()
      },
      handleChangeTopping(row, command) {
          const title = { 2: '撤销置顶', 1: '置顶' }
          this.$confirm(`确定要${title[command]}吗?`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.changeTopping(row, command)
              this.reload()
          }).catch(() => {
              this.reload()
          })
      },
      // 请求更新状态方法
      changeTopping(row, command) {
          this.ctrl.load = true
          api.commentUpdate({ id: row.id, topping: command }).then(res => {
              this.ctrl.load = false
              const msg = { 2: '撤销置顶成功', 1: '置顶成功' }
              this.$message({
                  type: 'success',
                  message: msg[command]
              });
              this.reload()
          }).catch(() => {
              this.ctrl.load = false
          })
      },
      handleChangeStatus(row, command) {
          const title = { 0: '禁用', 1: '启用' }
          this.$confirm(`确定要${title[command]}吗?`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.changeStatus(row, command)
              this.reload()
          }).catch(() => {
              this.reload()
          })
      },
      // 请求更新状态方法
      changeStatus(row, command) {
          this.ctrl.load = true
          api.commentUpdate({ id: row.id, status: command }).then(res => {
              this.ctrl.load = false
              const msg = { 0: '禁用成功', 1: '启用成功' }
              this.$message({
                  type: 'success',
                  message: msg[command]
              });
              this.reload()
          }).catch(() => {
              this.ctrl.load = false
          })
      },
      handleSizeChange(val) {
          // console.log(`每页 ${val} 条`)
          this.page.pageSize = val
          this.getList()
      },
      handleCurrentChange(val) {
          // console.log(`当前页: ${val}`)
          this.page.pageCurrent = val
          this.getList()
      },
      // 刷新当前页面
      reload() {
          this.map = {}
          this.getList()
      }
  }
}
</script>
