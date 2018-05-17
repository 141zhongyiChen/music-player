import {playMode} from 'common/js/config'
// 状态树
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  // 当前播放歌曲
  currentIndex: -1
}

//
export default state
