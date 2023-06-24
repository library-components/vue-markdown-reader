import MarkdownReader from "./MarkdownReader/index";
import CodeCopy from "./CodeCopy/index";
import Message from "./Message/index";

const components = [
    MarkdownReader,
    CodeCopy
]

const install = function(Vue) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });

    Vue.prototype.$message = Message;
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    MarkdownReader,
    CodeCopy,
    Message
};