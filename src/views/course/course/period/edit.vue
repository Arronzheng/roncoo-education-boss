<template>
  <el-dialog
    width="35%"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="课时名称：" prop="periodName">
        <el-input v-model="formData.periodName" ></el-input>
      </el-form-item>
      <el-form-item label="课时排序：">
        <el-input-number style="width: 300px;" v-model="formData.sort" @change="handleChange" :min="1" :max="10000"></el-input-number>
      </el-form-item>
      <el-form-item label="是否收费：">
        <el-radio-group v-model="formData.isFree">
          <el-radio :label="0">收费</el-radio>
          <el-radio :label="1">免费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row  v-if="formData.isFree == 0" prop="periodOriginal">
        <el-col :span="12">
          <el-form-item label="原价：" prop="periodOriginal">
            <el-input type="text" style="width: 120px" placeholder="请输入价格" v-model="formData.periodOriginal"></el-input> 元
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="优惠价：">
            <el-input type="text" style="width: 120px" placeholder="请输入价格" v-model="formData.courseDiscount"></el-input> 元
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item label="课件上传：">
      <el-upload
        class="upload-demo"
        action=""
        :file-list="fileList"
        :before-upload="handlePreview"
        :before-remove="beforeRemove"
        :http-request="handlePost">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      </el-form-item>
      <el-form-item label="视频上传：">
        <el-upload
          class="avatar-uploader"
          action=""
          :accept="videoType"
          :show-file-list="false"
          :on-success="handleVideoSuccess"
          :before-remove="beforeVideoRemove"
          :before-upload="beforeUploadVideo"
          :http-request="handleVideoPost">
          <div class="img" v-if="videoUpload.isUploadSuccess">
            <i class="el-icon-video-camera color-green" :title="111" style="font-size: 120px;"></i><br>
            <a href="javascript:" :title="111">{{videoUpload.videoName}}</a>
          </div>
          <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="课时描述：">
        <el-input v-model="formData.periodDesc" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <el-row style="margin-top:17px; ">
      <el-button style="float:right;margin-left:6px;" size="mini" type="danger" plain @click="handleClose">取 消</el-button>
      <el-button style="float:right" size="mini" type="primary" @click="submitForm('formData')">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  import * as apia from '@/api/commonality'
  import * as api from '@/api/course'
    export default {
        name: "Edit",
        data() {
            return {
                fileList: [],
                lastFileUrl: '',
                lastVideoUrl: '',
                //判断是否上传了视频，切换显视
                videoUpload: {
                  videoName: '',
                  isUploadSuccess: false
                },
                videoType: 'video/mp4,video/avi,video/mpg,video/mpeg,video/ram,video/flv,video/mov,video/asf,video/3gp,video/f4v,video/wmv,video/x-ms-wmv',
                rules: {
                    periodName: [
                        { required: true, message: '请输入课时名称', trigger: 'blur' }
                    ],
                    periodOriginal: [
                        { required: true, message: '请输入原价', trigger: 'blur' }
                    ]
                },
                videoFlag: false,
                //是否显示进度条
                videoUploadPercent: "",
                //进度条的进度，
                isShowUploadVideo: false,
                //显示上传按钮
                videoForm: {
                    showVideoPath: ''
                }
            }
        },
        props: {
            formData: {
                type: Object,
                default: () => {}
            },
            courseId: {
                type: String,
                default: ''
            },
            chapterId: {
                type: String,
                default: ''
            },
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    setTimeout(() => {
                        //回显视频和文档
                        console.log(this.formData.isVideo)
                        if (this.formData.isDoc === 1) {
                            this.fileList.splice(0, 1, { name: this.formData.docName })
                        }
                        if (this.formData.isVideo === '1') {
                          this.videoUpload.isUploadSuccess = this.formData.isVideo
                          this.videoUpload.videoName = this.formData.videoName
                        }
                    }, 100)
                }
            }
        },
        mounted() {

        },
        methods: {
            handleChange(value) {
                this.formData.sort = value
            },
            handleClose(done) {
                this.$refs['formData'].resetFields()
                this.fileList = []
                this.videoUpload.isUploadSuccess = false
                this.videoUpload.videoName = ''
                this.lastVideoUrl = ''
                this.$emit('close-callback')
            },
            submitForm(formName) {
                if (this.formData === undefined) {
                    this.$message({
                        showClose: true,
                        message: '提交失败',
                        type: 'error'
                    });
                    return false
                } else {
                    if (!this.formData.periodName) {
                        this.$message({
                            type: 'error',
                            message: '请输入课时名称'
                        });
                        return false
                    }
                    if (parseInt(this.formData.isFree) !== 1) {
                        if (!this.formData.periodOriginal) {
                            this.$alert('请输入课时售价')
                            return false;
                        }
                        if (this.formData.periodOriginal <= 0) {
                            this.$alert('请输入正确的课时售价')
                            return false;
                        }
                    } else {
                        this.formData.periodOriginal = 0;
                    }
                    if (!this.formData.sort) {
                        this.$message({
                            type: 'error',
                            message: '请输入课程排序'
                        });
                        return false
                    }
                    if (!this.formData.docUrl) {
                        this.formData.isDoc = 1
                    } else {
                        this.formData.isDoc = 0
                    }
                    if (!this.formData.videoNo) {
                        this.formData.isVideo = 1
                    } else {
                        this.formData.isVideo = 0
                    }
                }
                this.loading.show()
                console.log(this.formData)
                if (this.formData.id === undefined) {
                    this.formData.chapterId = this.chapterId
                    this.formData.courseId = this.courseId
                  // 新增
                  api.chapterPeriodAuditSave(this.formData).then(res => {
                      this.loading.hide()
                      if (res.code === 200 && res.data > 0) {
                          // 提交成功, 关闭窗口, 刷新列表
                          this.tips('添加成功', 'success')
                          this.handleClose('close-callback')
                          this.formData = {}
                      } else {
                          this.$message({
                              showClose: true,
                              message: '提交失败',
                              type: 'error'
                          });
                      }
                  }).catch(() => {
                      this.loading.hide()
                  })
                } else {
                    api.chapterPeriodAuditUpdate(this.formData).then(res => {
                        this.loading.hide()
                        if (res.code === 200 && res.data > 0) {
                            // 提交成功, 关闭窗口, 刷新列表
                            this.tips('修改成功', 'success')
                            this.handleClose('close-callback')
                            // this.formData = {}
                        } else {
                            this.$message({
                                showClose: true,
                                message: '提交失败',
                                type: 'error'
                            });
                        }
                    }).catch(() => {
                        this.loading.hide()
                    })
                }
            },
            handlePreview(file) {
                this.fileList.splice(0, 1, { name: file.name })
            },
            // handleExceed(files, fileList) {
            //     this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            // },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除${file.name}？`);
            },
            handlePost(file) {
                const fd = new FormData();
                fd.append('docFile', file.file)
                fd.append('url', this.lastFileUrl)
                //配置post请求的参数。参数名file,后面跟要传的文件，参数名fileType，值为category（看后端的具体要求）
                apia.uploadDoc(fd).then(response => {
                    this.lastFileUrl = response.data
                    this.formData.docName = file.file.name
                    this.formData.docUrl = response.data
                    this.$message({
                        showClose: true,
                        message: '上传成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '上传失败',
                        type: 'error'
                    });
                })
            },
            beforeUploadVideo() {

            },
            handleVideoSuccess(file) {
            },
            handleVideoPost(file) {
                const fd = new FormData();
                fd.append('videoFile', file.file)
                fd.append('url', this.lastVideoUrl)
                // 配置post请求的参数。参数名file,后面跟要传的文件，参数名fileType，值为category（看后端的具体要求）
                apia.uploadVideo(fd).then(response => {
                    this.videoUpload.videoName = file.file.name
                    this.videoUpload.isUploadSuccess = true
                    this.lastVideoUrl = response.data
                    this.formData.videoNo = response.data
                    this.formData.videoName = file.file.name
                    this.$message({
                        showClose: true,
                        message: '上传成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '上传失败',
                        type: 'error'
                    });
                })
            },
            beforeVideoRemove() {

            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  #image_panel_importance {
    width: 720px;
    margin-left: -360px;
  }
  .image_panel{
    width: 720px;
    margin-left: -360px;
  .modal_body{
    overflow: hidden;
  }
  .upload_box{
    line-height: 36px;
    padding: 10px 20px;
    border-bottom: 1px solid #e7e7eb;
  span{
    margin-right: 12px;
    color: #666;
  }
  }
  .modal_foot{
    border-top: 1px solid #e7e7eb;
    padding: 20px;
    text-align: center;
  }
  .image_list{
    overflow: hidden;
    height: 403px;
  .title{
    line-height: 30px;
    padding: 0 20px;
    font-size: 14px;
    background-color: #eee;
  }
  .left_list{
    float: left;
    width: 187px;
    border-right: 2px solid #ddd;
  }
  .right_list{
    float: right;
    width: 531px;
  }
  ul{
    height: 373px;
    overflow: auto;
  }
  .icon{
    text-align: center;
    line-height: 80px;
    font-size: 50px;
    color: #999;
  }
  .img{
    position: relative;
    float: left;
    margin-left: 16px;
    margin-top: 16px;
    width: 153px;
    border: 1px solid #e7e7eb;
  .oper{
    display: none;
  }
  .gb{
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 18px;
    cursor: pointer;
    color: #666;
  }
  img{
    display: block;
    height: 80px;
  }
  a{
    display: block;
    text-align: center;
    line-height: 30px;
    border-top: 1px solid #e7e7eb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sel{
    color: #eee;
    margin: 0 3px;
  }
  &:hover{
     border-color: #ed7d03;
  .oper{
    display: block;
  }
  .icon {
    color: #ed7d03;
  }
  }
  }
  .tip{
    text-align: center;
    font-size: 16px;
    line-height: 60px;
  }
  .progress,.tip,.oper{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9;
    height: 80px;
  .entity{
    height: 100%;
    background-color: rgba(0, 204, 0, 0.59);
  }
  }
  }
  }
  .max_img_panel{
    position: relative;
    z-index: 1000;
  .img_panel{
    display: table;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .img_box{
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }
  .img{
    display: inline-block;
    position: relative;
    max-width: 80%;
  i{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
    font-size: 30px;
    cursor: pointer;
  &:hover{
     color: #e00;
   }
  }
  }
  }
</style>
