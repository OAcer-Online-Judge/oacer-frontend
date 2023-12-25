<template>
  <div class="userLoginView">
    <h2>Sign In to OAcer</h2>
    <a-form
      :model="form"
      @submit="handleSubmit"
      style="max-width: 320px; margin: 0 auto"
      layout="vertical"
    >
      <a-form-item field="userAccount" label="Username" required>
        <a-input
          v-model="form.userAccount"
          placeholder="please enter your username"
        />
      </a-form-item>
      <a-form-item field="userPassword" label="Password" required>
        <a-input-password
          v-model="form.userPassword"
          placeholder="please enter your password"
        />
      </a-form-item>
      <a-form-item>
        <a-button style="width: 320px" type="primary" html-type="submit"
          >Sign In</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * Form data
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * Handle submit
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    alert("Login success" + JSON.stringify(res.data));
    // Get login user
    await store.dispatch("user/getLoginUser");
    // Redirect to home page
    await router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error(res.message);
  }
};
</script>
