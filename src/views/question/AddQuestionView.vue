<template>
  <div id="addQuestionView">
    <h1>Create Question</h1>
    <a-form :model="form" auto-label-width label-align="left">
      <a-form-item field="title" label="Title">
        <a-input v-model="form.title" placeholder="Please enter title" />
      </a-form-item>
      <a-form-item field="tags" label="tags">
        <a-input-tag
          v-model="form.tags"
          allow-clear
          placeholder="Please enter tags"
        />
      </a-form-item>
      <a-form-item field="content" label="Question Content">
        <MdEditor
          :handle-change="onContentChange"
          :value="form.content"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item field="answer" label="Answer">
        <MdEditor
          :handle-change="onAnswerChange"
          :value="form.answer"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :content-flex="false"
        :merge-props="false"
        label="Judge Config"
      >
        <a-space direction="vertical" fill>
          <a-form-item field="judgeConfig.timeLimit" label="Time Limit">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              min="0"
              mode="button"
              placeholder="Please enter time limit"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="Memory Limit">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              min="0"
              mode="button"
              placeholder="Please enter memory limit"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="Stack Limit">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              min="0"
              mode="button"
              placeholder="Please enter stack limit"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item :content-flex="false" label="Judge Case">
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" fill>
            <a-form-item
              :key="index"
              :field="`form.judgeCase[${index}].input`"
              :label="`Input-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="Please enter input case"
              />
            </a-form-item>
            <a-form-item
              :key="index"
              :field="`form.judgeCase[${index}].output`"
              :label="`Output-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="Please enter output case"
                style="margin-bottom: 8px"
              />
              <a-button
                :style="{ marginLeft: '10px' }"
                status="danger"
                style="margin-bottom: 8px"
                @click="handleDelete(index)"
                >Delete
              </a-button>
            </a-form-item>
          </a-space>
        </a-form-item>

        <a-button style="margin-left: 129px" @click="handleAdd"
          >Add Judge Case
        </a-button>
      </a-form-item>
      <a-divider />
      <a-form-item class="submit-button" style="margin-top: 8px">
        <a-button style="min-width: 200px" type="primary" @click="doSubmit"
          >Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("Update Success");
    } else {
      message.error("Update Failed" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("Create Success");
    } else {
      message.error("Create Failed" + res.message);
    }
  }
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addQuestionView {
  width: 80%;
  margin: 0 auto;
}
</style>
