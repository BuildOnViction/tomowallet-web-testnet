<template>
  <div>
    <Item :isIn="true" />
    <Item />
    <Item />
    <Item :isIn="true" />
    <Item />
    <Item />
    <Item :isIn="true" />
    <Item :isIn="true" />
    <Item />
    <Item />
    <Item />
    <Item :isIn="true" />
    <Item :isIn="true" />
    <Item />
    <Item />
    <Item :isIn="true" />
    <Item />
    <Item />
  </div>
</template>


<script>
import Item from './Item';
export default {
  components: {
    Item
  }
}
</script>
