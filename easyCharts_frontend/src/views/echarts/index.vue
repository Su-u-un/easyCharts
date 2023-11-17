<template>
  <div class="page">
    <el-form
      size="small"
      :inline="true"
      class="query-form"
      ref="searchForm"
      :model="searchForm"
      @keyup.enter.native="refreshList()"
      @submit.native.prevent
    >
      <el-form-item prop="name">
        <el-input
          size="small"
          v-model="searchForm.name"
          placeholder="组件名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="refreshList()"
          size="small"
          icon="el-icon-search"
          >查询</el-button
        >
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <vxe-toolbar :refresh="{ query: refreshList }" export print custom>
        <template #buttons>
          <el-button
            v-if="hasPermission('echarts:add')"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="add()"
            >新建</el-button
          >
          <el-button
            v-if="hasPermission('database:datamodel:dataSet:add')"
            type="primary"
            size="small"
            icon="el-icon-coin"
            @click="toDataSet()"
            >数据模型管理</el-button
          >
          <el-button
            v-if="hasPermission('echarts:edit')"
            type="warning"
            size="small"
            icon="el-icon-edit-outline"
            @click="edit()"
            :disabled="
              $refs.echartsTable && $refs.echartsTable.getCheckboxRecords().length !== 1
            "
            >修改</el-button
          >
          <el-button
            v-if="hasPermission('echarts:del')"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="del()"
            :disabled="
              $refs.echartsTable && $refs.echartsTable.getCheckboxRecords().length === 0
            "
            >删除</el-button
          >
          <el-button
            type="default"
            size="small"
            icon="el-icon-edit-outline"
            @click="createMenu()"
            :disabled="
              $refs.echartsTable && $refs.echartsTable.getCheckboxRecords().length !== 1
            "
            >发布</el-button
          >
        </template>
      </vxe-toolbar>
      <div style="height: calc(100% - 80px)">
        <vxe-table
          border="inner"
          auto-resize
          resizable
          height="auto"
          :loading="loading"
          size="small"
          ref="echartsTable"
          show-header-overflow
          show-overflow
          highlight-hover-row
          :menu-config="{}"
          :print-config="{}"
          :import-config="{}"
          :export-config="{}"
          @sort-change="sortChangeHandle"
          :sort-config="{ remote: true }"
          :data="dataList"
          :checkbox-config="{}"
        >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column title="组件名称" field="name" sortable>
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                v-if="hasPermission('echarts:edit')"
                @click="edit(scope.row.id)"
                >{{ scope.row.name }}</el-link
              >
              <el-link
                type="primary"
                :underline="false"
                v-else-if="hasPermission('echarts:view')"
                @click="view(scope.row.id)"
                >{{ scope.row.name }}</el-link
              >
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </vxe-column>
          <vxe-column title="数据模型" field="dataSet.name" sortable> </vxe-column>
          <vxe-column title="备注信息" field="remarks" sortable></vxe-column>
          <vxe-column title="操作" width="250px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="hasPermission('echarts:view')"
                type="text"
                icon="el-icon-view"
                size="small"
                @click="view(scope.row.id)"
                >查看</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                v-if="hasPermission('echarts:edit')"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="edit(scope.row.id)"
                >修改</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                v-if="hasPermission('echarts:del')"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="del(scope.row.id)"
                >删除</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                v-if="hasPermission('echarts:view')"
                type="text"
                icon="el-icon-view"
                size="small"
                @click="generate(scope.row)"
                >预览</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager
          background
          size="small"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.total"
          :page-sizes="[10, 20, 100, 1000, { label: '全量数据', value: 1000000 }]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle"
        >
        </vxe-pager>
      </div>
    </div>
    <EchartsForm @refreshDataList="refreshList" ref="echartsForm" />
    <!-- <gen-menu-form ref="genMenuForm"></gen-menu-form> -->
  </div>
</template>

<script setup>
import EchartsForm from "./EchartsForm";
// import GenMenuForm from "@/components/menu/GenMenuForm";
import echartsService from "@/api/echarts/echartsService";

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const echartsForm = ref();
const echartsTable = ref();
const genMenuForm = ref();
const searchForm = ref();

let dataList = ref([]);
let tablePage = ref({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  orders: [],
});
let loading = ref(false);

// 获取数据列表
const refreshList = () => {
  loading.value = true;
  echartsService
    .list({
      current: tablePage.value.currentPage,
      size: tablePage.value.pageSize,
      orders: tablePage.value.orders,
      ...searchForm.value,
    })
    .then(({ data }) => {
      dataList.value = data.records;
      tablePage.value.total = data.total;
      loading.value = false;
    });
};
// 当前页
const currentChangeHandle = ({ currentPage, pageSize }) => {
  tablePage.value.currentPage = currentPage;
  tablePage.value.pageSize = pageSize;
  refreshList();
};
// 排序
const sortChangeHandle = (column) => {
  tablePage.value.orders = [];
  if (column.order != null) {
    tablePage.value.orders.push({
      column: column.property.toLowerCase(),
      asc: column.order === "asc",
    });
  }
  refreshList();
};
// 新增
const add = () => {
  echartsForm.value.init("add", "");
};
// 新增数据源
const toDataSet = () => {
  router.push("/database/datamodel/DataSetList");
};
// 修改
const edit = (id) => {
  id =
    id ||
    echartsTable.getCheckboxRecords().map((item) => {
      return item.id;
    })[0];
  echartsForm.value.init("edit", id);
};
// 查看
const view = (id) => {
  echartsForm.value.init("view", id);
};
// 预览
const generate = (row) => {
  router.push(`/echarts/GenerateChart?id=${row.id}&title=${row.name}`);
};
// 创建菜单
const createMenu = () => {
  let row = echartsTable.value.getCheckboxRecords().map((item) => {
    return item;
  })[0];
  genMenuForm.init(`/echarts/GenerateChart?id=${row.id}`, row.name);
};
// 删除
const del = (id) => {
  let ids =id ||echartsTable.value.getCheckboxRecords().map((item) => {
        return item.id;
      }).join(",");
  this.$confirm(`确定删除所选项吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      loading.value = true;
      echartsService.delete(ids).then(({ data }) => {
        loading.value = false;
        this.$message.success({ dangerouslyUseHTMLString: true, message: data });
        refreshList();
      });
    })
    .catch(() => {
      loading.value = false;
    });
};
const resetSearch = () => {
  searchForm.value.resetFields();
  refreshList();
};
</script>
