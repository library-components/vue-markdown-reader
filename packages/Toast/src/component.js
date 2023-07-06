import getComponentRootDom from "./getComponentRootDom";
import Icon from "./icon.vue";

const messageList = []
let messageIndex = 0

/**
 * 消息提示
 * @param {String} content 消息内容
 * @param {String} type 消息类型  info  error  success  warn
 * @param {Number} duration 多久后消失
 * @param {HTMLElement} container 容器，消息会显示到该容器的正中间；如果不传，则显示到整个页面的正中间
 * @param {Function} callback 回调函数，该函数会在弹出消息消失后执行，如果不传，则不执行
 */
export default function (options = {}) {
  // 设置参数的默认值
  const content = options.content || "";
  const type = options.type || "info";
  const duration = options.duration || 2000;
  const container = options.container || document.body;
  const callback = options.callback || undefined;

  // JS代码生成message元素
  const message = document.createElement("div");
  // 得到Icon组件的根元素DOM节点
  const iconDom = getComponentRootDom(Icon, { type })

  // message容器中增加相应的子元素
  message.innerHTML = `${iconDom.outerHTML}<span class="tip">${content}</span>`;

  //添加样式
  message.classList.add('message');
  message.classList.add(`message-${type}`); //添加message类名

  // 由于需要满足 子绝父相 这一条件来进行居中定位
  // 所以需要判断容器的position值
  if (options.container) {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
  }

  container.appendChild(message); // 将message容器加入到父容器中

  //渐入效果：初始状态 --> 正常位置状态
  message.clientHeight; // 造成reflow导致浏览器强行渲染

  // 正常位置状态的样式
  message.style.opacity = 1;
  message.style.top += (messageList.length+1) * (message.clientHeight + 20) + 'px'
  message.style.transform = `translate(-50%, -50%)`;

  // 淡出效果：正常位置状态 --> 消失状态
  // message容器动画的过渡时间
  const transitionDuration = parseFloat(getComputedStyle(message).transitionDuration) * 1000;

  const param = {
    id: `message_${++messageIndex}`,
    content: content,
    type: type,
    clientHeight: message.clientHeight,
    style: message.style,
    duration: duration,
    transitionDuration: transitionDuration,
    container: container,
    callback: callback,
    $el: message,
    onClose: close(`message_${messageIndex}`, duration, transitionDuration)
  }

  messageList.push(param)
}

function close (id, duration, transitionDuration) {
  setTimeout(() => {
    const { message, index } = findMessageInfoById(id)
    const len = messageList.length
    let removedHeight = message.clientHeight
    messageList.splice(index, 1)

    message.style.opacity = 0;
    message.style.transform = `translate(-50%, -${message.clientHeight*(len+1)}px)`

    // 监听transitionend事件
    message.$el.addEventListener(
      "transitionend",
      function () {
        message.$el.remove(); // 删除message容器
        message.callback && message.callback(); // 有回调函数就直接执行


        for (let i = index; i < len - 1 ; i++) {
          let dom = messageList[i]

          if (dom) {
            dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
          }
        }
      },
      { once: true }
    );
  }, duration + transitionDuration);
}

function findMessageInfoById(id) {
  let message = null
  let index = -1
  for (let i=0; i<messageList.length; i++) {
    if (messageList[i].id === id) {
      message = messageList[i]
      index = i

      break
    }
  }

  return { message, index }
}