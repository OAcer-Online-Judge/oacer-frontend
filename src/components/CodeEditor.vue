<template>
  <div id="code-editor" ref="codeEditorRef" style="min-height: 300px"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, watch, withDefaults } from "vue";

const codeEditorRef = ref();
const codeEditor = ref();

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language?: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () =>
    "public class Main {\n" +
    "    public static void main(String[] args) {\n" +
    '        System.out.println("Hello World!");\n' +
    "    }\n" +
    "}",
  language: () => "java",
  handleChange: (v: string) => {
    console.log("当前值：", v);
  },
});

watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: false,
    },
    theme: "vs-light",
    fontFamily: "JetBrains Mono, monospace, sans-serif",
    fontSize: 13,
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });

  // 代码提示
  monaco.languages.registerCompletionItemProvider("java", {
    provideCompletionItems: function (model, position) {
      // 获取当前行数
      const line = position.lineNumber;
      // 获取当前列数
      const column = position.column;
      // 获取当前输入行的所有内容
      const content = model.getLineContent(line);
      // 通过下标来获取当前光标后一个内容，即为刚输入的内容
      const sym = content[column - 2];
      model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      //---------------------------------------------------
      //上面的代码仅仅是为了获取sym，即提示符
      //---------------------------------------------------
      const suggestions = [];
      if (sym == "$") {
        //...
        //拦截到用户输入$，开始设置提示内容，同else中代码一致，自行拓展
      } else {
        //直接提示，以下为java语句关键词提示
        const sqlStr = [
          "abstract",
          "assert",
          "boolean",
          "break",
          "byte",
          "case",
          "catch",
          "char",
          "class",
          "continue",
          "default",
          "do",
          "double",
          "else",
          "enum",
          "extends",
          "final",
          "finally",
          "float",
          "for",
          "if",
          "implements",
          "import",
          "int",
          "interface",
          "instanceof",
          "long",
          "native",
          "new",
          "package",
          "private",
          "protected",
          "public",
          "return",
          "short",
          "static",
          "strictfp",
          "super",
          "switch",
          "synchronized",
          "this",
          "throw",
          "throws",
          "transient",
          "try",
          "void",
          "volatile",
          "while",
          "true",
          "false",
          "null",
        ];
        for (const i in sqlStr) {
          suggestions.push({
            label: sqlStr[i], // 显示的提示内容
            kind: monaco.languages.CompletionItemKind["Function"], // 用来显示提示内容后的不同的图标
            insertText: sqlStr[i], // 选择后粘贴到编辑器中的文字
            detail: "", // 提示内容后的说明
            range: range,
          });
        }
      }
      return {
        suggestions: suggestions,
      };
    },
    triggerCharacters: ["$", ""],
  });

  // 代码提示 Python
  monaco.languages.registerCompletionItemProvider("python", {
    provideCompletionItems: function (model, position) {
      const line = position.lineNumber;
      const column = position.column;
      const content = model.getLineContent(line);
      const sym = content[column - 2];
      model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      const suggestions = [];
      if (sym == "$") {
        //...
      } else {
        const sqlStr = [
          "and",
          "as",
          "assert",
          "break",
          "class",
          "continue",
          "def",
          "del",
          "elif",
          "else",
          "except",
          "exec",
          "finally",
          "for",
          "from",
          "global",
          "if",
          "import",
          "in",
          "is",
          "lambda",
          "not",
          "or",
          "pass",
          "print",
          "raise",
          "return",
          "try",
          "while",
          "with",
          "yield",
          "True",
          "False",
          "None",
        ];
        for (const i in sqlStr) {
          suggestions.push({
            label: sqlStr[i],
            kind: monaco.languages.CompletionItemKind["Function"],
            insertText: sqlStr[i],
            detail: "",
            range: range,
          });
        }
      }
      return {
        suggestions: suggestions,
      };
    },
    triggerCharacters: ["$", ""],
  });
});
</script>

<style scoped></style>
