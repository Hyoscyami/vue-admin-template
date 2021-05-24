import {createStore} from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from '@/store/modules/tagsView'
import permission from '@/store/modules/permission'

const store = createStore({
  modules: {
    app,
    settings,
    user,
    tagsView,
    permission
  },
  getters
})

export default store
