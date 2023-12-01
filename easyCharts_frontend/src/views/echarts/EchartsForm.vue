<template>
    <el-dialog
      :title="title"
      center
      width="80%"
      :close-on-click-modal="false"
       v-if="visible"
       class="design-chart"
      v-model="visible">
      <el-form size="small" :model="inputForm"  ref="inputForm" @keyup.enter.native="doSubmit()"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               :v-loading="loading" @submit.native.prevent>
        <el-container>
          <el-container>
            <el-aside width="250px" style="padding-left: 15px">
              <p>请选择一个数据源：</p>
              <el-select style="width:215px; padding-top:5px" @change="resetMetas" v-model="inputForm.dataSet.id" filterable placeholder="请选择一个数据源">
                <el-option
                  v-for="(item, index) in dataSets"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <draggable class="jp-filed-panel" v-model="metas" group="charts" @change="log">
                <div
                  class="list-group-item"
                  v-for="(element, index) in metas"
                  :key="index"
                >
                  <i class=" fa fa-arrows "> {{ element.label }}</i>
                </div>
              </draggable>
            </el-aside>
            <el-main class="eMain">
              <el-header class="eHeader">
                <el-menu  class="el-menu-dm"   mode="horizontal" @select="handleSelect">
                  <el-sub-menu index="1">
                    <template #title>基本图表</template>
                    <el-menu-item index="line">折线图</el-menu-item>
                    <el-menu-item index="histogram">柱状图</el-menu-item>
                    <el-menu-item index="bar">条形图</el-menu-item>
                    <el-menu-item index="pie">饼图</el-menu-item>
                    <el-menu-item index="ring">环形图</el-menu-item>
                    <el-menu-item index="waterfall">瀑布图</el-menu-item>
                    <el-menu-item index="funnel">漏斗图</el-menu-item>
                    <el-menu-item index="radar">雷达图</el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="2">
                    <template #title>复杂图表</template>
                    <el-menu-item index="heatmap">热力图</el-menu-item>
                    <el-menu-item index="scatter">散点图</el-menu-item>
                    <el-menu-item index="candle">K线图</el-menu-item>
                    <el-menu-item index="gauge">仪表盘</el-menu-item>
                    <el-menu-item index="wordcloud">词云图</el-menu-item>
                    <el-menu-item index="liquidfill">水球图</el-menu-item>
                  
                  </el-sub-menu>
                  <el-sub-menu index="3">
                    <template #title>地图</template>
                   <el-menu-item index="map">中国地图</el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="4">
                    <template #title>其他</template>
                      <el-menu-item index="table">表格</el-menu-item>
                  </el-sub-menu>
                  <el-button link class="el-btn-dm" @click="handleGenerateCode">生成代码</el-button>
                </el-menu>
              </el-header>
              <el-row class="chartMain" :gutter="12">
                <el-col :span="12">
                  <el-card class="jp-box-card">
                    <div slot="header" class="clearfix">
                      <span style="font-weight:800" class="fa fa-list">X轴</span>
                    </div>
                    <draggable class="fieldpanel"  @add="onMove" v-model="xMetas" group="charts" @change="log">
                      <li
                        class="list-group-item"
                        v-for="(element, index) in xMetas"
                        :key="index"
                      >
                        <i class=" fa fa-arrows "> {{ element.label }}</i>
                        </li>
                    </draggable>
                  </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="jp-box-card">
                    <div slot="header" class="clearfix">
                      <span style="font-weight:800" class="fa fa-list"> Y轴</span>
                    </div>
                    <draggable class="fieldpanel" v-model="yMetas" group="charts" @change="log">
                      <li
                        class="list-group-item"
                        v-for="(element, index) in yMetas"
                        :key="index"
                      >
                        <i class=" fa fa-arrows "> {{ element.label }}</i>
                      </li>
                    </draggable>
                  </el-card>
                </el-col>
                <el-col :span="24">
                  <el-card class="chartMain">
                    <template v-if="inputForm.type === 'table'">
                      <el-table
                        :data="chartData.rows">
                          <el-table-column
                          v-for="(column, index) in chartData.columns" :key="index"
                            :prop="column"
                            :label="column">
                          </el-table-column>
                      </el-table>
                    </template>
                    <template v-else>
                      <component ref="chart" :is="'ve-'+inputForm.type" v-if="custom"
                        :legend="activeOption.legend"
                        :grid="activeOption.grid"
                        :extend="activeOption.extend"
                        :tooltip="activeOption.tooltip"
                        :data="chartData"
                        :colors="activeOption.colors"
                        :title="activeOption.title">
                      </component>
                      <component ref="chart" :is="'ve-'+inputForm.type" v-else
                        :data="chartData" >
                      </component>
                    </template>
                  </el-card>
                </el-col>
              </el-row>
            </el-main>
            <el-aside width="280px" style="padding-right:15px;padding-left:15px;border-left: 1px solid rgb(238, 238, 238);">
              <el-form label-width="100px"
                       label-position="left"
                       size="small">
                <!-- 组件配置 -->
                <template>
                  <p>
                    <el-checkbox v-model="custom">开启自定义配置</el-checkbox>
                  </p>
                  <!-- <common-option v-if="custom"/> -->
                  <div v-if="custom">zidinyi</div>
                  <el-alert v-else
                    title="不使用自定义配置，将按照默认风格展示echarts图表，生成的代码会比较简洁，不包含复杂的配置项。"
                    type="info"
                    :closable="false"
                    show-icon/>
                </template>
              </el-form>
            </el-aside>
          </el-container>
        </el-container>
      </el-form>
      <span slot="footer"  class="dialog-footer">
        <el-button size="small" v-if="method != 'view'" @click="doSubmit()" type="primary" icon="el-icon-circle-check">确定</el-button>
        <el-button size="small" @click="visible = false" icon="el-icon-circle-close">关闭</el-button>
      </span>
      <el-dialog
            v-model="codeVisible"
            :close-on-click-modal="false"
            width="800px"
            center
            append-to-body
            title="生成代码"
          >
  
            <el-tabs type="border-card" style="box-shadow: none;" v-model="codeActiveName">
              <el-tab-pane label="动态数据" name="dy">
                 <!-- <editor v-model="dyTemplate" @init="editorInit" lang="html" theme="twilight" width="100%" height="450px"></editor> -->
                 编辑器
              </el-tab-pane>
              <el-tab-pane label="静态数据" name="static">
                  <!-- <editor v-model="staticTemplate" @init="editorInit" lang="html" theme="twilight" width="100%" height="450px"></editor> -->
                编辑器
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
              <el-button
                  link
                  v-clipboard:copy="codeCopyValue"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
                拷贝代码
            </el-button>
            </span>
          </el-dialog>
    </el-dialog>
  </template>
  
  <script>
  // import draggable from 'vuedraggable'
  import { VueDraggableNext } from 'vue-draggable-next'
  import {VAceEditor} from 'vue3-ace-editor'
  import {ElMenu,ElMessage,ElOption,ElSelect,ElAside,ElMenuItem,ElSubMenu,ElButton,ElHeader,ElCard,ElCol,ElTableColumn,ElTable,ElRow,ElCheckbox,ElMain,ElForm,ElFormItem,ElAlert,ElDialog,ElContainer,ElTabPane,ElTabs} from 'element-plus'

  import 'ace-builds/src-noconflict/ext-language_tools'
  import 'ace-builds/src-noconflict/mode-html'
  import 'ace-builds/src-noconflict/mode-ftl'
  import 'ace-builds/src-noconflict/mode-javascript'
  import 'ace-builds/src-noconflict/mode-less'
  import 'ace-builds/src-noconflict/theme-twilight'
  import 'ace-builds/src-noconflict/snippets/javascript' 

  import commonOption from './option/common'
  import { dicOption } from './option/config'
  import generateCode from './generateCode.js'
  import echartsService from '@/api/echarts/echartsService'
  import dataMetaService from '@/api/database/dataMetaService'
  import dataSetService from '@/api/database/dataSetService'


  export default {
    components: {
      draggable:VueDraggableNext,
      commonOption,
      VAceEditor,
      ElMessage,
      ElMenu,ElOption,ElSelect,ElAside,ElMenuItem,ElSubMenu,ElButton,ElHeader,ElCard,ElCol,ElTableColumn,ElTable,ElRow,ElCheckbox,ElMain,ElForm,ElFormItem,ElAlert,ElDialog,ElContainer,ElTabPane,ElTabs
    },
    provide () {
      return {
        main: this,
        contain: this
      }
    },
    data () {
      return {
        visible: false,
        loading: false,
        custom: true,
        codeVisible: false,
        codeActiveName: 'dy',
        codeCopyValue: '',
        staticTemplate: '',
        dyTemplate: '',
        title: '',
        method: '',
        dataSets: [],
        metas: [],
        xMetas: [],
        yMetas: [],
        chartData: {
        },
        activeOption: {
          title: {
            show: true,
            text: '',
            left: 'auto',
            textStyle: {
              color: '#333',
              fontSize: 18
            },
            subtext: '',
            subtextStyle: {
              color: '#aaa',
              fontSize: 12
            }
          },
          tooltip: {
            textStyle: {
              color: '#fff',
              fontSize: 14
            }
          },
          grid: {
            left: 10,
            top: 60,
            right: 10,
            bottom: 60
          },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              fontSize: 12,
              color: '#333'
            }
          },
          extend: {
            series: {
              label: {
                normal: {
                  show: false,
                  position: 'top',
                  fontSize: 12,
                  color: '#333',
                  fontWeight: 'normal'
                }
              },
              type: 'line',
              barMaxWidth: 0,
              barMinHeight: 0
            }
          },
          colors: []
        },
        activeObj: {
          component: {
            prop: 'bar'
          }
        },
        dicOption: dicOption,
        inputForm: {
          id: '',
          name: '',
          option: '',
          xnames: '',
          ynames: '',
          dataSet: {
            id: ''
          },
          type: 'line'
        }
      }
    },
    watch: {
      'inputForm.dataSet.id' (val) {
        if (val) {
          dataMetaService.queryNeedByDataSetId(val).then(res => {
//             const data = [
//   {
//     "id": "1624751016375267329",
//     "createDate": "2021-06-14 17:46:45",
//     "createBy": "46bfed60109a4daa9f8b3679c2d6c7ac",
//     "updateDate": "2021-07-25 13:17:34",
//     "updateBy": "1",
//     "delFlag": 0,
//     "name": "name",
//     "label": "name",
//     "type": "VARCHAR",
//     "isNeed": true,
//     "dataSetId": "d1be33a50f4c4a9787de5e5c304f4819",
//     "sort": 0
//   },
//   {
//     "id": "1624751016463347713",
//     "createDate": "2023-02-12 20:43:23",
//     "createBy": "1",
//     "updateDate": "2023-02-12 20:43:23",
//     "updateBy": "1",
//     "delFlag": 0,
//     "name": "value",
//     "label": "value",
//     "type": "INT",
//     "isNeed": true,
//     "dataSetId": "d1be33a50f4c4a9787de5e5c304f4819",
//     "sort": 1
//   }
// ]        

            // 过滤掉inputform含有的值
            this.metas = res.data.filter((item) => {
              let excludeNames = ',' + this.inputForm.xnames + ',' + this.inputForm.ynames + ','
              if (excludeNames.indexOf(',' + item.name + ',') >= 0) {
                return false
              } else {
                return true
              }
            })
          })
        } else {
          this.metas = []
        }
      },
      xMetas (val) {
        this.inputForm.xnames = val.map((item) => {
          return item.name
        }).join(',')
        this.refreshChart('xmeta')

      },
      yMetas (val) {
        this.inputForm.ynames = val.map((item) => {
          return item.name
        }).join(',')
        this.refreshChart('ymeta')

      },
      codeActiveName (val) {
        this.codeCopyValue = val === 'dy' ? this.dyTemplate : this.staticTemplate
      }
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建图表组件`
        } else if (method === 'edit') {
          this.title = '修改图表组件'
        } else if (method === 'view') {
          this.title = '查看图表组件'
        }
        this.visible = true
        this.xMetas = []
        this.yMetas = []
        this.dataSets = []
  
        this.inputForm.dataSet.id = ''
        
        this.$nextTick(() => {
        console.log(this.inputForm)

          this.$refs.inputForm.resetFields()
            dataSetService.list({'current': 1, 'size': -1}).then(res => {
            this.dataSets = res.records
          })
          if (method === 'edit' || method === 'view') { // 修改或者查看
            echartsService.queryDesignById(this.inputForm.id).then(res => {
              const data = {
                
  "echarts": {
    "id": "1419566072641654786",
    "createDate": "2021-07-26 15:51:41",
    "createBy": {
      "id": "1",
      "admin": false,
      "roleIdList": [],
      "roleIds": "",
      "postIdList": [],
      "roleNames": ""
    },
    "updateDate": "2021-07-28 02:09:36",
    "updateBy": {
      "id": "1",
      "admin": false,
      "roleIdList": [],
      "roleIds": "",
      "postIdList": [],
      "roleNames": ""
    },
    "delFlag": 0,
    "name": "ddd",
    "dataSet": {
      "id": "d1be33a50f4c4a9787de5e5c304f4819",
      "columnList": [],
      "params": []
    },
    "option": "{\"title\":{\"show\":true,\"text\":\"\",\"left\":\"auto\",\"textStyle\":{\"color\":\"#333\",\"fontSize\":18},\"subtext\":\"\",\"subtextStyle\":{\"color\":\"#aaa\",\"fontSize\":12}},\"tooltip\":{\"textStyle\":{\"color\":\"#fff\",\"fontSize\":14}},\"grid\":{\"left\":10,\"top\":60,\"right\":10,\"bottom\":60},\"legend\":{\"show\":true,\"orient\":\"horizontal\",\"textStyle\":{\"fontSize\":12,\"color\":\"#333\"}},\"extend\":{\"series\":{\"label\":{\"normal\":{\"show\":false,\"position\":\"top\",\"fontSize\":12,\"color\":\"#333\",\"fontWeight\":\"normal\"}},\"barMaxWidth\":0,\"barMinHeight\":0}},\"colors\":[\"#6395f9\",\"#64daab\",\"#657698\",\"#f6c02d\",\"#e96d5b\"]}",
    "type": "line",
    "xnames": "name",
    "ynames": "num"
  },
  "yColumnList": [],
  "xColumnList": [
    {
      "id": "1624751016375267329",
      "createDate": "2021-06-14 17:46:45",
      "createBy": "46bfed60109a4daa9f8b3679c2d6c7ac",
      "updateDate": "2021-07-25 13:17:34",
      "updateBy": "1",
      "delFlag": 0,
      "name": "name",
      "label": "name",
      "type": "VARCHAR",
      "isNeed": true,
      "dataSetId": "d1be33a50f4c4a9787de5e5c304f4819",
      "sort": 0
    }
  ]
}
              this.inputForm = this.recover(this.inputForm, res.echarts)
              this.xMetas = res.xColumnList
              this.yMetas = res.yColumnList
              if (res.echarts.option_content === '') {
              this.custom = false
            } else {
              this.activeOption = JSON.parse(res.echarts.option_content)
            }
            })
          }
        })
      },
      editorInit: function () {
        
      },
      // 复制成功
      onCopy (e) {
        ElMessage({
            message:'复制成功!',
            type: 'success',
        })
      },
      // 复制失败
      onError (e) {
        ElMessage({
            message:'复制失败!',
            type: 'error',
        })
      },
      handleGenerateCode () {
        this.codeVisible = true
        let url = `/echarts/getChartData/${this.inputForm.id}`
        this.dyTemplate = generateCode(this.activeOption, url, 'dy', this.inputForm.type, this.custom)
        this.staticTemplate = generateCode(this.activeOption, this.chartData, 'static', this.inputForm.type, this.custom)
        this.codeCopyValue = this.codeActiveName === 'dy' ? this.dyTemplate : this.staticTemplate
      },
      refreshChart (s) {
      console.log(s+'触发的，这时候的inputForm.ynames是',this.inputForm.ynames)
        if (this.inputForm.dataSet.id && this.inputForm.xnames && this.inputForm.ynames) {
          echartsService.mergeChartData({
            dataSetId: this.inputForm.dataSet.id,
            xnames: this.inputForm.xnames,
            ynames: this.inputForm.ynames
          }).then(({data}) => {
            this.chartData = data
          })
        } else {
          this.chartData = []
        }
      },
      vaildProp (name) {
        return this.dicOption[name].includes(this.inputForm.type)
      },
      resize () {
        this.$refs.chart.echarts.resize()
      },
      onMove () {
        if (this.xMetas.length > 1) {
          ElMessage({
              message: `X轴只能设置一条数据，现在有${this.xMetas.length}条数据，请移除多余数据!`,
              type: 'error',
          })
        }
      },
      resetMetas () {
        this.xMetas = []
        this.yMetas = []
      },
      log (evt) {
        window.console.log(evt)
      },
      handleSelect (key, keyPath) {
        this.inputForm.type = key
      },
      activeComponent () {
        return this.activeObj.component || {}
      },
        // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$prompt('请输入图表的名字', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputValue: this.inputForm.name
            }).then(({ value }) => {
              this.loading = true
              this.inputForm.name = value
              this.inputForm.option = this.custom ? JSON.stringify(this.activeOption) : ''
              echartsService.save(this.inputForm).then(({data}) => {
                this.visible = false
                this.$message.success(data)
                this.$emit('refreshDataList')
                this.loading = false
              })
            })
          }
        })
      }
    }
  }
  </script>
  <style lang="scss">
  .eHeader {
      background-color: #f8f8f8;
      text-align: left;
      line-height: 50px!important;
      height: 50px!important;
      padding: 0px!important;
      .el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
        height: 44px;
        line-height: 44px;
        border-bottom: 2px solid transparent;
        color: #909399;
      }
      .el-menu-dm {
        height: 45px;
      }
      .el-btn-dm {
        float: right;
        margin-right: 10px;
      }
  }
  .eMain {
     padding: 0px !important;
  }
  .chartMain{
    margin-top:10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .list-group-item {
      padding: 5px;
      margin-bottom: 5px;
      width: 100%;
      background: #e3f2f8;
      display: inline-block;
  }
  .jp-box-card{
    height: 200px;
    border: 2px solid #a0d4e6;
    overflow: auto;
    .el-card__header {
      padding: 5px 20px;
      background: #e3f2f8;
      padding-left: 6px;
      font-weight: 600;
      border-bottom: 2px solid #a0d4e6;
      color: #3f8ce8;
    }
    .el-card__body {
      padding: 5px;
      .fieldpanel {
        height: 150px;
        overflow: auto;
      }
    }
  }
  .jp-filed-panel{
    padding-top: 10px;
    padding-right: 20px;
    height: 500px;
    overflow: auto;
  }
  .design-chart .el-dialog__body {
      padding: 0px!important;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
  }
  </style>
  