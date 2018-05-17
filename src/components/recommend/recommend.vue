<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!-- 拿到数据后，渲染 -->
        <div v-if="recommendArray.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommendArray" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" class="item" :key="index">
              <div class="icon">
                <!-- <img width="60" height="60" :src="item.imgurl"> -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!this.discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
export default {
  data () {
    return {
      recommendArray: [],
      discList: []
    }
  },
  created () {
    /* setTimeout(() => {
      this._getRecommend()
    }, 2000) */
    this._getRecommend()
    setTimeout(() => {
      this._getDiscList()
    }, 1000)
  },
  methods: {
    // 请求 无缝滚动 图片数据
    _getRecommend () {
      getRecommend()
        .then((res) => {
          if (res.code === ERR_OK) {
            /* console.log(res.data) */
            this.recommendArray = res.data.slider
            /* console.log(this.recommendArray) */
          }
        })
    },
    // 代理请求 歌单列表 数据
    _getDiscList() {
      getDiscList()
        .then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
          /* console.log(this.discList) */
        })
    },
    // loadImage
    loadImage () {
      if (!this.hasLoaded) {
        this.hasLoaded = true
        this.$refs.scroll.refresh()
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    top: 84px
    bottom: 0
    width: 100%
    /*border 1px solid red
    height: 60px
    background white*/
    .recommend-content
      position relative
      height: 100%
      overflow: hidden
      /*background red*/
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
          font-weight 400
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              $color-sub-theme
            .desc
              color: $color-text-ll
      .loading-container
        position absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
