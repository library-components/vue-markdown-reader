<template>
  <div id="app">
    <markdown-reader :content="content" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      content: "## 拉取nginx镜像\n```\ndocker pull nginx\n```\n## 创建nginx容器\n```\ndocker run --name nginx -d \\\n-p 80:80 -p 443:443 \\\n-v /usr/local/docker/nginx/html:/usr/share/nginx/html:ro \\\n-v /usr/local/docker/nginx/logs:/var/log/nginx/:rw \\\n-v /usr/local/docker/nginx/config/conf.d:/etc/nginx/conf.d:rw \\\n-v /usr/local/docker/nginx/cert:/etc/nginx/ssl \\\n-d nginx\n```\n>注意点：\n>* 我并没有在/usr/local/docker/nginx目录下创建html、logs、和/config/conf.d目录,自动映射的\n\n## 进入nginx容器\n```\ndocker exec -it nginx bash\n```\n进入/etc/nginx，并查看nginx.conf配置文件，这个文件是nignx的根本配置文件\n```\ncd /etc/nginx\n\ncat nginx.conf\n```\nnginx.conf内容如下：\n```\nuser  nginx;\nworker_processes  auto;\n\nerror_log  /var/log/nginx/error.log notice;\npid        /var/run/nginx.pid;\n\n\nevents {\n    worker_connections  1024;\n}\n\n\nhttp {\n    include       /etc/nginx/mime.types;\n    default_type  application/octet-stream;\n\n    log_format  main  '$remote_addr - $remote_user [$time_local] \"$request\" '\n                      '$status $body_bytes_sent \"$http_referer\" '\n                      '\"$http_user_agent\" \"$http_x_forwarded_for\"';\n\n    access_log  /var/log/nginx/access.log  main;\n\n    sendfile        on;\n    #tcp_nopush     on;\n\n    keepalive_timeout  65;\n\n    #gzip  on;\n\n    include /etc/nginx/conf.d/*.conf; # 看这里，引入/etc/nginx/conf.d目录下所有的以conf为扩展名的配置文件\n}\n```\n退出nginx容器，在宿主机映射的配置文件目录下新建default.conf并编辑\n```\ncd /usr/local/docker/nginx/config/conf.d\n\nvi default.conf\n```\ndefault.conf的内容如下:\n```\nserver {\n    listen       80;\n    server_name  _; # _代表当前宿主机的地址\n\n    #charset koi8-r;\n    #access_log  /var/log/nginx/host.access.log  main;\n\n    location / {\n        root   /usr/share/nginx/html; # nginx代理的根目录,被我映射到了/usr/local/docker/nginx/html，所以可以在此目录下新建index.html当作默认网页\n        index  index.html index.htm;\n    }\n    \n    #代理配置\n    location /business {\n        proxy_pass  http://business.app.com;\n    }\n    \n    #代理配置\n    location /user {\n        proxy_pass  http://user.app.com;\n    }\n}\n```\n进入/usr/local/docker/nginx/html，新建index.html\n```\ncd /usr/local/docker/nginx/html\n\nvi index.html\n```\nindex.html的内容如下：\n```\nwelcome to nginx\n```\n检查nginx配置文件是否正确\n```\n// docker检查\ndocker exec nginx nginx -t\n```\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/092dd294deb24f48a567a91a7a32d0db~tplv-k3u1fbpfcp-watermark.image?)\n文件内容没有问题。\n\n重新加载nginx的配置文件，相当于重启nginx容器\n\n```\n docker exec nginx nginx -s reload\n```\n访问nginx,端口为80\n```\n192.168.57.128\n```\n\n![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a42c99236c145969555381556bd303c~tplv-k3u1fbpfcp-watermark.image?)"
    }
  }
}
</script>

<style scoped>
#app {
  width: 1200px;
  margin: 20px auto;
}
</style>
