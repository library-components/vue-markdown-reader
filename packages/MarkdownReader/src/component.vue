<template>
    <div class="markdown-body" ref="container">
      <div v-html="html"></div>
    </div>
  </template>
  
  <script>
  import { marked } from 'marked'
  import CodeCopy from '~/packages/CodeCopy'
  import Vue from 'vue'
  
  export default {
    name: 'MarkdownReader',
    props: {
      content: String
    },
    data () {
      return {
        html: ''
      }
    },
    watch: {
      // 解决服务端渲染，数据已经获取到，但对应的dom没渲染的问题
      content: {
        handler (newVal) {
          this.getMardownFileContent(newVal)
  
          this.update()
        },
        immediate: true
      }
    },
    mounted () {
      this.getMardownFileContent(this.content)
    },
    updated () {
      this.update()
    },
    methods: {
      //处理markdown数据，data为markdown文件读出的字符串
      getMardownFileContent (data) {
        this.html = marked(data || '', {
          /* 默认为false，为true时显示代码标签 */
          sanitize: false
        })
      },
      //获取对应markdown代码块标签
      update () {
        this.$nextTick(() => {
          document.querySelectorAll('pre').forEach(el => {
            if (el.classList.contains('code-copy-added')) return
            //   https://cn.vuejs.org/v2/api/index.html#Vue-extend
            /* 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象 */
            let ComponentClass = Vue.extend(CodeCopy)
            let instance = new ComponentClass()
            instance.code = el.innerText
            instance.parent = el
            /* 手动挂载 */
            instance.$mount()
            el.classList.add('code-copy-added')
            el.appendChild(instance.$el)
          })
        })
      }
    }
  }
</script>
  