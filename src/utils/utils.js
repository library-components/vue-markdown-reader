/** 
* @desc 函数防抖 
* @param func 回调函数 
* @param delay 延迟执行毫秒数 
*/ 
export const debounce = (func, delay) => { 
    let timer;  // 定时器

    return function () { 
        let context = this;  // 记录 this 值,防止在回调函数中丢失
        let args = arguments;  // 函数参数
        
        // 标识是否立即执行
        let isImmediately = !timer;

        //如果定时器存在，则清除定时器(如果没有,也没必要进行处理)
        timer ? clearTimeout(timer) : null; 

        timer = setTimeout(() => { 
            timer = null;
        }, delay);
        
        // isImmediately 为 true 则 执行函数(即首次触发事件)
        isImmediately ? func.apply(context, args) : null;
    } 
} 

/** 
* @desc 函数节流
* @param func 回调函数 
* @param limit 时间限制
*/ 
export const throttle = (func, limit) => {
    let inThrottle;  // 是否处于节流限制时间内

    return function() {
        const context = this;
        const args = arguments;

        // 跳出时间限制
        if (!inThrottle) {
            func.apply(context, args);  // 执行回调
            inThrottle = true;  
            // 开启定时器计时
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
