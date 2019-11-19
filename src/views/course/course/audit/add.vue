<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="50%">
    <el-form ref="formData" :rules="rules" :model="formData" label-width="100px">
      <!--<el-form-item label="课程封面">
       <el-upload
         class="avatar-uploader"
         action=""
         :on-preview="handlePreview"
         :on-remove="handleRemove"
         :before-remove="beforeRemove"
          multiple
         :limit="1"
         :on-success="success">
&lt;!&ndash;          :file-list="fileList">&ndash;&gt;
         <el-button size="small" type="primary">点击上传</el-button>
         <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
       </el-upload>
     </el-form-item>-->
      <el-form-item label="课程封面:" prop="courseLogo">
        <div>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :http-request="handlePost">
            <img v-if="courseLogo" :src="courseLogo" class="avatar" alt="">
            <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="课程名称：" prop="courseName">
        <el-input v-model="formData.courseName"></el-input>
      </el-form-item>
      <el-form-item label="课程分类：" prop="category">
        <el-cascader :options="options" :props="{checkStrictly:true}" v-model="formData.categorys"></el-cascader>
      </el-form-item>
      <el-form-item label="课程讲师：" prop="lecturer">
        <el-select v-model="formData.lecturerUserNo" placeholder="请选择">
          <el-option v-for="item in lecturerOptions" :key="item.lecturerUserNo" :label="item.lecturerName" :value="item.lecturerUserNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否免费：">
        <el-radio-group v-model="formData.isFree">
          <el-radio :label="0">收费</el-radio>
          <el-radio :label="1">免费</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row  v-if="formData.isFree == 0" prop="courseOriginal">
        <el-col :span="12">
          <el-form-item label="原价：">
            <el-input type="text" style="width: 120px" placeholder="请输入价格" v-model="formData.courseOriginal"></el-input> 元
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="优惠价：">
            <el-input type="text" style="width: 120px" placeholder="请输入价格" v-model="formData.courseDiscount"></el-input> 元
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item label="排序：" prop="sort">
        <el-input-number style="width: 300px;" v-model="formData.sort" @change="handleChange" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="课程简介:">
        <div id="courseDesc" style="height:350px;max-height:500px;"></div>
      </el-form-item>
      <el-row style="margin-top:17px; ">
        <el-button style="float:right;margin-left:6px;" size="mini" type="danger" plain @click="handleClose">取 消</el-button>
        <el-button style="float:right" size="mini" type="primary" @click="submitForm('formData')">确定</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import * as api from '@/api/course'
import * as apia from '@/api/commonality'
export default {
  name: 'Add',
  data() {
    return {
        formData: {
            isFree: 0,
            sort: 1
        },
        courseLogo: '',
        rules: {
            courseLogo: [
                { required: true, message: '请添加课程分面', trigger: 'blur', autocomplete: 'on' }
            ],
            courseName: [
                { required: true, message: '请输入课程名称', trigger: 'blur' }
            ],
            category: [
                { required: true, message: '请选择课程分类', trigger: 'blur' }
            ],
            courseOriginal: [
                { required: true, message: '请输入课程售价', trigger: 'blur' }
            ],
            sort: [
                { required: true, message: '请输入课程排序', trigger: 'blur' }
            ],
            lecturer: [
                { required: true, message: '请选择课程讲师', trigger: 'blur' }
            ]
        }
    }
  },
  props: {
    // route object
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    options: {
        type: [Array, Object],
        default: () => {}
    },
    lecturerOptions: {
        type: [Array, Object],
        default: () => {}
    }
  },
  watch: {
    visible: function(val) {
      if (val) {
        setTimeout(() => {
            this.editor.create();
            this.editor.customConfig.customUploadImg = this.editorUpload
            if (this.formData.courseDesc !== undefined && this.formData.courseDesc !== '' && this.formData.courseDesc !== null) {
                this.editor.txt.html(this.formData.courseDesc)
            } else {
                this.editor.txt.html('')
            }
          }, 100)
      }
    }
  },
  mounted() {
    this.createEdit();
  },
  methods: {
    handleChange(value) {
        this.formData.sort = value
    },
    createEdit() {
        const E = require('wangeditor');
        this.editor = new E('#courseDesc');
    },
    submitForm(formData) {
        if (this.formData === undefined) {
            this.$message({
                showClose: true,
                message: '提交失败',
                type: 'error'
            });
            return false
        } else {
            if (!this.courseLogo) {
                this.$message({
                    type: 'error',
                    message: '请添加课程封面'
                });
                return false
            } else {
                this.formData.courseLogo = this.courseLogo
            }
            if (!this.formData.courseName) {
                this.$message({
                    type: 'error',
                    message: '请输入课程名称'
                });
                return false
            }
            if (!this.formData.categorys) {
                this.$message({
                    type: 'error',
                    message: '请输选择课程分类'
                });
                return false
            }
            if (parseInt(this.formData.isFree) !== 1) {
                if (!this.formData.courseOriginal) {
                    this.$alert('请输入课程售价')
                    return false;
                }
                if (this.formData.courseOriginal <= 0) {
                    this.$alert('请输入正确的课程售价')
                    return false;
                }
            } else {
                this.formData.courseOriginal = 0;
            }
            if (!this.formData.sort) {
                this.$message({
                    type: 'error',
                    message: '请输入课程排序'
                });
                return false
            }
            if (!this.formData.lecturerUserNo) {
                this.$message({
                    type: 'error',
                    message: '请选择课程讲师'
                });
                return false
            }
            this.formData.courseDesc = this.editor.txt.html()
            this.loading.show()
            console.log(this.formData)
            // 新增
            api.courseAuditSave(this.formData).then(res => {
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
        }
    },
    handleAvatarSuccess(res, file) {
        this.formData.courseLogo = URL.createObjectURL(file.raw);
    },
    handlePost(file) {
        const fd = new FormData();
        fd.append('picFile', file.file)
        fd.append('imgUrl', this.courseLogo)
        //配置post请求的参数。参数名file,后面跟要传的文件，参数名fileType，值为category（看后端的具体要求）
        apia.uploadPic(fd).then(response => {
            this.courseLogo = response.data
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
    // 编辑器上传图片
    editorUpload(files, insert) {
        const file = files[0];
        const param = new FormData();
        param.append('picFile', file, file.name);
        apia.uploadPic(param).then(res => {
            if (res.code === 200) {
                const imgUrl = res.data
                insert(imgUrl)
            }
        }).catch(() => {
            this.$message({
                type: 'error',
                message: '上传图片出错，请稍后重试'
            })
        })
    },
    handleClose(done) {
        this.editor.txt.clear()
        this.$emit('close-callback')
        this.formData = {}
    }
  }
}
</script>
<style>
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
</style>

