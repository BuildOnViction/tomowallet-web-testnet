<template>
  <div id="app">
    <div class="main-content">
        <router-view/>
    </div>
  </div>
</template>

<script>
</script>

<style lang="stylus" scoped>
  #app
    display: flex;
    align-items: center;
    justify-content: center;
    @media(min-width: 768px) {
      height: 100vh;
      min-height: 640px;
    }

    .maincontent
      box-shadow 3px 3px 40px rgba(0,0,0,0.1);
      display flex;

      @media(max-width 767px) {
        display block;
      }
</style>
