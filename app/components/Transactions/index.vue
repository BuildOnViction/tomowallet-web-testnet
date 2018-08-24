<template>
  <div>
    <div v-if="logs && logs.length > 0">
      <Item v-for="e in (logs || [])" :key="e.hash" :data="e" :isIn="e.to === address"/>
    </div>
    <div v-else class="empty">
      No transactions
    </div>
  </div>
</template>


<script>
import Item from './Item';
export default {
  props: ['logs', 'address'],
  components: {
    Item
  }
}
</script>

<style lang="stylus" scoped>
  .empty
    text-align center
    margin-top 100px
    font-size 30px
    font-weight 300
</style>
