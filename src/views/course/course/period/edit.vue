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
          <el-form-item label="原价：">
            <el-input type="text" style="width: 120px" placeholder="请输入价格" v-model="formData.periodOriginal"></el-input> 元
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="优惠价：">
            <el-input type="text" style="width: 120px" placeholder="请输入价格" v-model="formData.courseDiscount"></el-input> 元
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item label="文档上传：">
        <el-upload
          class="upload-demo"
          action=""
          :file-list="fileList"
          :limit="1"
          :before-upload="handlePreview"
          :on-change="handleChange">
          <el-button size="small" type="primary">点击上传</el-button>
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
    export default {
        name: "Edit",
        data() {
            return {
                fileList: [],
                rules: {
                    periodName: [
                        { required: true, message: '请输入课时名称', trigger: 'blur' }
                    ],
                    periodOriginal: [
                        { required: true, message: '请输入原价', trigger: 'blur' }
                    ]
                }
            }
        },
        props: {
            formData: {},
            chapterId: '',
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
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
                this.$emit('close-callback')
            },
            submitForm(formName) {

            },
            handlePreview(file) {
                console.log(file)
                this.fileList.push({ name: file.name() })
            }
        }
    }
</script>

<style scoped>

</style>
