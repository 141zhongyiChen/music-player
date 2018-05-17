<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :singers="singers"></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
// 导入 封装好的，用于数据请求 的方法
import { getSingerList } from 'api/singer'
// 导入 常量
import { ERR_OK } from 'api/config'
// 导入 Singer 构造类
import Singer from 'common/js/singer'
// 导入 ListView
import ListView from 'base/listView/listView'
//
import { mapMutations } from 'vuex'

/* 字母 全部必须大写 */
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  components: {
    ListView
  },
  data () {
    return {
      singers: []
    }
  },
  created () {
    setTimeout(() => {
      this._getSingerList()
    }, 20)
  },
  methods: {
    // request source
    _getSingerList () {
      getSingerList()
        .then((res) => {
          if (res.code === ERR_OK) {
            /* this.singers = res.data.list */
            /* console.log(this.singers) */
            /* console.log(this._normalizeSinger(this.singers)) */
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
    },
    // normalize SingerList
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 规范化 歌手列表
      list.forEach((item, index) => {
        // 前十条 为 热门
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            /* {
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            } */
            // 代替注释字段
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              singerid: item.Fsinger_id
            })
          )
        }
        // 以字母 类聚 所有 歌手
        const key = item.Findex
        // 不存在'map.A '，则添加 'map.A' 属性
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 添加 到 'map.A'
        map[key].items.push(
          /* {
          id: item.Fsinger_mid,
          name: item.Fsinger_name,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
        } */
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        )
      })
      /* return map */
      // 为 得到 有序列表，需要 处理 map, 将 热门歌手列表内容 与 歌手列表 区分
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        // 如果是 歌手列表，则 ret.push(val); 否则 hot.push(val)
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 对 歌手列表项 按照 字母升序顺序 排序 , 更新 当前的 ret 的排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 热门歌手列表 与 歌手列表 拼接
      return hot.concat(ret)
    },
    // 点击跳转至 相应歌手页
    selectSinger (singer) {
      /* console.log(singer) */
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 使用映射后得到的 this.setSinger() 函数
      this.setSinger(singer)
    },
    ...mapMutations({
      // 映射 this.setSinger() 为 this.$store.commit('setSinger')
      // 使用 扩展函数 后，直接在调用的地方传入参数，会自动传递的
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
