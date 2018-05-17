<template>
  <transition name="slide">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
export default {
  components: {
    musicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    // 通过计算属性获取 state中的 singer
    ...mapGetters([
      'singer'
    ]),
    // 获取 title
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    }
  },
  created () {
    this._getSingerDetail()
    /* console.log(this.singer) */
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
        return
      }
      getSingerDetail(this.singer.id)
        .then((res) => {
          if (res.code === ERR_OK) {
            /* console.log(res.data.list) */
            this.songs = this._normalizeSongs(res.data.list)
            console.log(`console in singer-detail at line 52`)
            console.log(this.songs)
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
