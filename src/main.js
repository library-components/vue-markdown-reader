// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MarkdownReader from '../packages/index'
import '../packages/theme-chalk/src/index.scss'

Vue.config.productionTip = false

Vue.use(MarkdownReader)

new Vue({
    el:"#app",
    render:(h)=>h(App)
})