import MarkdownReader from './src/component.vue'

MarkdownReader.install = function (Vue) {
    Vue.component(MarkdownReader.name, MarkdownReader)
}

export default MarkdownReader