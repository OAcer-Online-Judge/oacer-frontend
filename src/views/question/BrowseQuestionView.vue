<template>
  <div id="browseQuestionView" style="height: calc(100vh - 190px)">
    <a-row :gutter="[24, 24]" style="height: 100%">
      <a-col
        :md="12"
        :xs="24"
        style="height: 100%; display: flex; flex-direction: column"
      >
        <a-tabs default-active-key="question" style="overflow: auto">
          <a-tab-pane key="question" title="Description">
            <template #title>
              <icon-book />
              Description
            </template>
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="Judge Config"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="Time Limit">
                  {{ question.judgeConfig.timeLimit ?? 0 }} ms
                </a-descriptions-item>
                <a-descriptions-item label="Memory Limit">
                  {{ question.judgeConfig.memoryLimit ?? 0 }} KB
                </a-descriptions-item>
                <a-descriptions-item label="Stack Limit">
                  {{ question.judgeConfig.stackLimit ?? 0 }} KB
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="Discussion" disabled>
            <template #title>
              <icon-message />
              Discussion
            </template>
            评论区
          </a-tab-pane>
          <a-tab-pane key="answer" title="Answer">
            <template #title>
              <icon-experiment />
              Answer
            </template>
            暂时无法查看答案
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col
        :md="12"
        :xs="24"
        style="height: 100%; display: flex; flex-direction: column"
      >
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="Language"
            style="min-width: 250px"
          >
            <a-select v-model="form.language" placeholder="Select Language">
              <a-option>java</a-option>
              <a-option>python</a-option>
              <a-option>cpp</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
          style="flex-grow: 1"
        />
        <a-divider />
        <a-button
          type="primary"
          status="success"
          style="margin-left: auto"
          @click="doSubmit"
        >
          Submit
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

/**
 * 获取到动态路由 id
 */
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("Loading Failed, " + res.message);
  }
};

/**
 * 不同语言的默认程序
 */
const codeDefaultValue = ref(
  "public class Main {\n" +
    "    public static void main(String[] args) {\n" +
    "        int a = Integer.parseInt(args[0]);\n" +
    "        int b = Integer.parseInt(args[1]);\n" +
    "        System.out.println(a + b);\n" +
    "    }\n" +
    "}\n"
);

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: codeDefaultValue as unknown as string,
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("Question Submitted Successfully");
  } else {
    message.error("Question Submitted Failed, " + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style scoped>
#browseQuestionView {
  margin: auto 15px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 10px 10px 0 10px;
}
</style>
