<template>
    <div class="header-wrapper">
      <div class="menu-list">
        <router-link class="menu-item" active-class="active" exact to="/">Home</router-link>
        <router-link class="menu-item" active-class="active" to="/category">Category</router-link>
        <a class="menu-item" href="https://jiar.github.io">github.io</a>
        <a class="menu-item" href="https://github.com/Jiar">Github</a>
        <a class="menu-item" href="https://twitter.com/JiarYoo">Twitter</a>
        <a class="menu-item" href="https://weibo.com/u/2268197591">Weibo</a>
      </div>
    </div>
</template>

<script>
</script>

<style lang="less">
.menu-list {
  list-style: none;
  float: right;
  margin-top: 10px;
}
.menu-item {
  cursor: pointer;
  display: inline-block;
  margin: 0 8px;
  height: 24px;
  line-height: 24px;
  text-decoration: none;
  color: #34495e;
  border-bottom: 3px solid transparent;
  &:hover {
    border-bottom: 3px solid #42b983;
  }
  &.active {
    border-bottom: 3px solid #42b983;
  }
}
</style>
