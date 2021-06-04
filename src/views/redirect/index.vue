<template>
  <el-row />
</template>
<script>
import {useRoute, useRouter} from 'vue-router'

export default {
  created() {
    const router = useRouter()
    const route = useRoute()
    const { params, query } = route
    const { path } = params
    console.log('route,params', route, params)
    router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
