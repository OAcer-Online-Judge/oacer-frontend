<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <span> ⓒ 2024 OAcer Online Judge | All rights reserved</span>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#basicLayout .header {
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  margin: 15px 0;
  background: linear-gradient(to right, #fefefe, #fff);
}

#basicLayout .footer {
  background: #f7f8fa;
  backdrop-filter: saturate(200%) blur(1ex);
  padding: 36px;
  text-align: center;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
