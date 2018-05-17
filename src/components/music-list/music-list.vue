<template>
  <div class="music-list">
    <!-- back to Singer -->
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <!-- title -->
    <h1 class="title" v-html="title"></h1>
    <!-- bg-Image -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 遮罩层 -->
      <div class="filter"></div>
    </div>
    <!-- bg-layer -->
    <div class="bg-layer" ref="layer"></div>
    <!-- Scroll -->
    <scroll :data="songs" class="list" ref="list"
             :listenScroll="listenScroll"
             @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <!-- Song-list -->
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </scroll>
    <!-- loading -->
    <div class="loading-wrapper">
      <loading v-show="!songs.length"></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
//
const TOP_SPACE_HEIGHT = 40
export default {
  components: {
    Scroll,
    SongList,
    Loading
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  created () {
    this.listenScroll = true
  },
  // 动态计算list的top值
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.LimitTranslateY = -this.imageHeight + TOP_SPACE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      // 设定layer层[向上]跟随滚动距离
      this.translateY = Math.max(this.LimitTranslateY, newY)
      this.$refs.layer.style['transform'] = `translate3d(0, ${this.translateY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${this.translateY}px, 0)`
      // layer层到达距顶部40px,bg-Image层设定z-index遮罩list层
      let zIndex = 0
      if (newY > this.LimitTranslateY) {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      } else {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${TOP_SPACE_HEIGHT}px`
      }
      this.$refs.bgImage.style.zIndex = zIndex
      // 下拉，avatar放大
      if (newY > 0) {
        let scale = 1
        let zIndex = 10
        let percent = Math.abs(newY / this.imageHeight)
        scale += percent
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-dialog-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      /* background-size:cover 即：保持图像本身的宽高比例，将图片缩放到正好完全覆盖定义背景的区域 */
      background-size cover
      /* 遮罩层 */
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-dialog-background
    /* Scroll style */
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-dialog-background
      .song-list-wrapper
        padding: 20px 30px
    .loading-wrapper
      position: absolute
      top 50%
      translateY(-50%)
      left 0
      right 0
</style>
