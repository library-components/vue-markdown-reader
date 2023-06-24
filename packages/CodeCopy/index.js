import CodeCopy from './src/component.vue'

CodeCopy.install = function (Vue) {
    Vue.component(CodeCopy.name, CodeCopy)
}

export default CodeCopy