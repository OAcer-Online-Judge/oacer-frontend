<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img
            src="../assets/logo.png"
            alt="logo"
            style="height: 50px; margin: 8px"
          />
        </a-space>
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
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0 0 / 100% 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#userLayout .header {
  margin-top: 16px;
}

#userLayout .content {
  margin: 15px 0;
  padding: 20px;
}

#userLayout .footer {
  padding: 36px;
  text-align: center;
}
</style>
<script></script>
