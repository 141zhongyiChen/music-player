<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{'active': currentIndex == index }" v-for="(item, index) in dots" :key="item"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      console.log('1 in slider at line 40')
      /* 初始化 圆点 */
      this._initDos()
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth()
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth () {
      /* 获取 滑动图片张数 */
      this.childrenArray = this.$refs.sliderGroup.children
      /* console.log(this.childrenArray) */
      let totalWidth = 0
      /* 获取 当前屏幕 可视区宽度 */
      let sliderWidth = this.$refs.slider.clientWidth
      /* console.log(sliderWidth) */
      for (let i = 0; i < this.childrenArray.length; i++) {
        /* child is a DOM node */
        let child = this.childrenArray[i]
        addClass(child, 'slider-item')
        /* 将图片宽度 设为 可视区宽度 */
        child.style.width = sliderWidth + 'px'
        totalWidth += sliderWidth
      }
      /* console.log(totalWidth) */
      // 使用snapLoop,DOM 渲染时，首尾会多克隆两个节点，进而做到真正无缝
      totalWidth += 2 * sliderWidth
      this.$refs.sliderGroup.style.width = totalWidth + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        /* snap: true,
        snapLoop: this.loop,
        /!* 用手指滑动页面可切换的 阈值，大于这个阈值可自动切换到下一页 *!/
        snapThreshold: 0.3,
        snapSpeed: 400 */
        /* 新版本写法 */
        snap: {
          loop: this.loop, // 循环 -->使用时,
          threshold: 0.3,
          speed: 400 // 轮播间隔
        }
      })
      /* 页面切换，都会触发 该事件 */
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentIndex = pageIndex
      })
    },
    _initDos () {
      if (this.loop === true) {
        this.dots = new Array(this.childrenArray.length - 2)
      } else {
        this.dots = new Array(this.childrenArray.length)
      }
    },
    _isAutoPlay () {
      let self = this
      this.timer = setTimeout(() => {
        let pageIndex = self.currentIndex + 1
        self.slider.goToPage(pageIndex, 0, 400)
      }, self.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        ox-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-d
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
