<template>
  <a-row id="globalHeader" align="center">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '24px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <span class="title">Meow OJ</span>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in routes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        {{ store.state.user?.loginUser?.userName ?? "Not Login" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";

const router = useRouter();

// Default selected menu item
const selectedKeys = ref(["/"]);

// Update selected menu item when route changes
router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

const store = useStore();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "Mingkai",
    role: "admin",
  });
  console.log(store.state.user.loginUser);
}, 3000);

console.log(store.state.user.loginUser);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  font-weight: 600;
  font-size: larger;
  margin-left: 16px;
  cursor: default;
}

.logo {
  height: 32px;
}
</style>
