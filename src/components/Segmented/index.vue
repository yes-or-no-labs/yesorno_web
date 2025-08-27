<template>
  <div class="segmented-container overflow-x-auto" :class="customClass" :style="`padding-left: ${offset}px;padding-right: ${offset}px;`">
    <div class="segmented-wrap">
      <div
        class="segmented-thumb"
        :style="{
          width: w + 'px',
          transform: 'translateX(' + x + 'px)',
          display: isInit ? 'block' : 'none',
        }"
      ></div>
      <label
        ref="labelRef"
        :class="['segmented-item', { 'segmented-item-disabled': item.disabled }]"
        v-for="(item, index) in options"
        :key="index"
        @click.self="$emit('change', item.value)"
      >
        <input type="radio" name="segmented" />
        <div class="select-none sm:text-[16px] sm:!leading-[16px] text-[14px] sm:!py-[10px]" v-if="item.label">{{ item.label }}</div>
        <div class="!py-[5px]" v-if="item.icon">
          <img :src="curIndex==index?item.selectIcon:item.icon" alt="" :draggable="false" class="select-none w-[16px] h-[16px]"></img>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Segmented',
  data() {
    return {
      w: 0,
      x: 0,
      isInit: false,
      curIndex:0
    }
  },
  emits: ['change'],
  props: {
    options: {
      required: true,
      type: Array,
    },
    offset: {
      type: Number,
      default: 20,
    },
    value:{
      type: String||Number,
    },
    customClass:{
      type: String,
    }
  },
  mounted() {
    this.init()
  },
  watch:{
    value(newVal){
      const index = this.options.findIndex(item=>item.value === this.value)
      this.changeHandler(this.options[index],this.$refs.labelRef[index])
      this.curIndex = index
      // console.log('props.value',this.$refs.labelRef[index]);
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        const firstEl = this.$refs.labelRef[0]
        this.w = firstEl.clientWidth + this.offset * 2
        this.x = firstEl.offsetLeft - this.offset
        this.isInit = true
      })
    },

    changeHandler(item, ev) {
      if (item?.disabled) return
      // this.w = ev.target.clientWidth + this.offset * 2
      // this.x = ev.target.offsetLeft - this.offset
      this.w = ev.clientWidth + this.offset * 2
      this.x = ev.offsetLeft - this.offset
    },
    
    handleClickNext(){
      if(this.curIndex === this.options.length - 1){
        const item = this.options[0]
        this.$emit('change', item.value)
      }else{
        const item = this.options[this.curIndex + 1]
        this.$emit('change', item.value)
      }
    },

    handleClickPre(){
      if(this.curIndex === 0){
        const item = this.options[this.options.length - 1]
        this.$emit('change', item.value)
      }else{
        const item = this.options[this.curIndex - 1]
        this.$emit('change', item.value)
      }
    }
  },
}
</script>

<style scoped lang="scss">
.segmented-container {
  display: inline-block;
  color: #fff;
  background-color: transparent;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 2px;
  box-sizing: border-box;
}

.segmented-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-items: flex-start;
  gap: 40px;
  width: 100%;
  .segmented-item {
    position: relative;
    text-align: center;
    cursor: pointer;
    &.segmented-item-disabled {
      color: #00000040;
      cursor: not-allowed;
    }
    & > div {
      //min-height: 35px;
      line-height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;
      pointer-events: none;
    }
    & > input {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      opacity: 0;
      pointer-events: none;
    }
  }

  .segmented-thumb {
    display: none;
    // background-color: #fff;
    background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%);
    border-radius: 35px;
    box-shadow:
      0 2px 8px -2px rgba(0, 0, 0, 0.05),
      0 1px 4px -1px rgba(0, 0, 0, 0.07),
      0 0 1px rgba(0, 0, 0, 0.07);
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    padding: 4px 0;
    box-sizing: border-box;
    transition:
      transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1),
      width 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    will-change: transform, width;
  }
}
</style>
