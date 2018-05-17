<template>
  <scroll class="listview"
          ref="listview"
          :listen-scroll="listenScroll"
          @scroll="scroll"
  >
    <ul>
      <li v-for="(group, index) in singers"
          class="list-group"
          ref="listGroup"
          :key="index"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="select(item)" v-for="item in group.items" class="list-group-item" :key="item.name">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
        @touchstart.stop.prevent="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove"
        @touchend.stop
    >
      <ul>
        <li v-for="(title, index) in shortcutList"
            :key="title" :data-index="index"
            :class="{ 'current': currentIndex === index }"
            class="item"
        >
          {{ title }}
        </li>
      </ul>
    </div>
    <!-- 顶部固定 -->
    <div class="list-fixed" ref="fixed" v-show="currentPosition">
      <div class="fixed-title">{{ currentPosition }}</div>
    </div>
    <!-- 加载交互 -->
    <div v-show="!singers.length" class="loading-container">
      <loading></loading>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const TARGET_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    singers: {
      type: Array
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      isFlowScroll: -1
    }
  },
  // props 与 data 中的 属性，会有 getter 与 setter
  created () {
    this.touchRecorder = {}
    this.listenScroll = true
    this.listHeight = []
  },
  computed: {
    // 截取，计算获得 右侧 列表 表头信息
    shortcutList () {
      return this.singers.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 根据 data-currentpos 的 属性值，计算 当前滑动 所在的 title
    currentPosition () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.singers[this.currentIndex] ? this.singers[this.currentIndex].title : ''
    }
  },
  methods: {
    // 右侧点击,左侧 跳动
    onShortcutTouchStart (event) {
      // 获取 data-index的 属性值
      let clickIndex = getData(event.target, 'index')
      // console.log(typeof clickIndex) ==> string
      // console.log(event.touches)  ==> array,length=1,记录点击位置的 详情信息
      let touchDetail = event.touches[0]
      // console.log(touchDetail)  ==>  Object
      this.touchRecorder.YStart = touchDetail.pageY
      this.touchRecorder.clickIndex = clickIndex
      //
      //
      if (clickIndex) {
        this._scrollTo(clickIndex)
      }
    },
    //
    onShortcutTouchMove (event) {
      let touchDetail = event.touches[0]
      this.touchRecorder.YEnd = touchDetail.pageY
      // 计算 滑动后，当前的 index
      let targetDistance = Math.floor((this.touchRecorder.YEnd - this.touchRecorder.YStart) / TARGET_HEIGHT)
      let newIndex = targetDistance + parseInt(this.touchRecorder.clickIndex)
      console.log(`newIndex:${newIndex}`)
      /* console.log(this.listHeight.length) */
      //
      // newIndex的范围(无穷大)==> maximum call stack size exceeded
      if (newIndex < 0) {
        newIndex = 0
      } else if (newIndex >= this.listHeight.length - 2) {
        newIndex = this.listHeight.length - 2
      }
      this._scrollTo(newIndex)
    },
    // 实时派发 滚动监听事件,获取 垂直滚动距离
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 计算 左侧 各个 title 所在 位置的 高
    _calculateHeight () {
      const list = this.$refs.listGroup
      let defaultHeight = 0
      this.listHeight.push(defaultHeight)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        defaultHeight += item.clientHeight
        this.listHeight.push(defaultHeight)
      }
    },
    // 滑动到指定index，所在位置
    _scrollTo (index) {
      /* console.log(index) */
      // 点击，更新scrollY,进而高亮当前标题
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 点击，跳转至 具体 歌手页
    select (item) {
      this.$emit('select', item)
    }
  },
  watch: {
    singers () {
      /* console.log(this.singers) */
      // 确保DOM 渲染完毕后，再进行高度计算
      setTimeout(() => {
        this._calculateHeight()
        /* console.log(this.listHeight) */
      }, 20)
    },
    // 默认带有 newValue、oldValue
    scrollY (newY) {
      /* console.log(`新值${newY}`) */
      // 滑动到顶部
      let listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length; i++) {
        let preHeight = listHeight[i]
        let nextHeight = this.listHeight[i + 1]
        if (-newY >= preHeight && -newY < nextHeight) {
          this.currentIndex = i
          this.isFlowScroll = nextHeight + newY
          return
        }
      }
      // 滑动到 底部
      this.currentIndex = listHeight.length - 1
      /* console.log(this.currentIndex) */
    },
    isFlowScroll (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 8px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: red
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
