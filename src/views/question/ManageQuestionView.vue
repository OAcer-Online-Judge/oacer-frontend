<template>
  <div id="manageQuestionView">
    <a-form :model="searchParams" layout="inline" class="search-options">
      <a-form-item field="title" label="题目：">
        <a-input v-model="searchParams.title" placeholder="请输入搜索题目" />
      </a-form-item>
      <!--      <a-form-item field="title" label="用户：">-->
      <!--        <a-input v-model="searchParams.userId" placeholder="请输入搜索用户" />-->
      <!--      </a-form-item>-->
      <a-form-item field="title" label="题目内容：">
        <a-input v-model="searchParams.content" placeholder="请输入题目内容" />
      </a-form-item>
      <a-form-item field="tags" label="题目标签：">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入题目标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="outline" status="normal" @click="doSubmit"
          >搜索
        </a-button>
      </a-form-item>
    </a-form>
    <a-table
      :column-resizable="true"
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
        showJumper: true,
        showPageSize: true,
      }"
      @page-change="onPageChange"
      @pageSizeChange="onPageSizeChange"
    >
      <!--      <template #id="{ record }">-->
      <!--        <a-link-->
      <!--          status="normal"-->
      <!--          style="color: blue"-->
      <!--          @click="toQuestionPage(record)"-->
      <!--          >{{ record.id }}-->
      <!--        </a-link>-->
      <!--      </template>-->
      <template #tags="{ record }">
        <a-space>
          <a-tag v-for="(tag, index) of JSON.parse(record.tags)" :key="index"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            Math.round(
              (record.submitNum > 0
                ? (record.acceptedNum / record.submitNum) * 100
                : "0" * 100) * 100
            ) / 100
          }% (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #judgeConfig="{ record }">
        <a-space>
          <a-tag v-if="JSON.parse(record.judgeConfig).timeLimit" color="blue">
            <template #icon>
              <icon-clock-circle />
            </template>
            {{ JSON.parse(record.judgeConfig).timeLimit }}ms
          </a-tag>
          <a-tag v-if="JSON.parse(record.judgeConfig).memoryLimit" color="blue">
            <template #icon>
              <icon-storage />
            </template>
            {{ JSON.parse(record.judgeConfig).memoryLimit }}MB
          </a-tag>
          <a-tag v-if="JSON.parse(record.judgeConfig).stackLimit" color="blue">
            <template #icon>
              <icon-layers />
            </template>
            {{ JSON.parse(record.judgeConfig).stackLimit }}MB
          </a-tag>
        </a-space>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("MM-DD-YYYY HH:MM") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="outline" @click="doUpdate(record)"
            ><template #icon> <icon-edit /> </template>Edit
          </a-button>
          <a-popconfirm
            content="确定要删除此题目吗?"
            type="error"
            okText="是"
            cancelText="否"
            @cancel="
              () => {
                console.log(`已取消`);
              }
            "
            @ok="doDelete(record)"
          >
            <a-button type="outline" status="danger"
              ><template #icon> <icon-delete /> </template>Delete
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  userId: undefined,
  tags: [],
  title: "",
  pageSize: 10,
  current: 1,
  content: "",
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    console.log("=======Tags=======", JSON.parse(res.data.records[0].tags));
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("Data Loading Failed" + res.message);
  }
};

/**
 * Listen to searchParams change
 */
watchEffect(() => {
  loadData();
});

/**
 * Load data when mounted
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Tags",
    slotName: "tags",
  },
  {
    title: "Acceptance",
    slotName: "acceptedRate",
  },
  {
    title: "Judge Config",
    slotName: "judgeConfig",
  },
  {
    title: "Create Time",
    slotName: "createTime",
  },
  {
    title: "Manage",
    slotName: "optional",
  },
];

const onPageChange = (current: number) => {
  searchParams.value = {
    ...searchParams.value,
    current,
  };
};

const onPageSizeChange = (pageSize: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("Delete Success");
    await loadData();
  } else {
    message.error("Delete Failed" + res.message);
  }
};

const router = useRouter();

/**
 * Navigate to question page
 * @param question
 */
// const toQuestionPage = (questionId: QuestionSubmitQueryRequest) => {
//   router.push({
//     path: `/question/view/${questionId.questionId}`,
//   });
// };

/**
 * Update question
 * @param question
 */
const doUpdate = (question: Question) => {
  router.push({
    path: "/question/update",
    query: {
      id: question.id,
    },
  });
};

/**
 * Submit search
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#manageQuestionView {
  width: 80%;
  margin: 0 auto;
}

.search-options {
  margin: 15px auto;
  justify-content: center;
}
</style>
