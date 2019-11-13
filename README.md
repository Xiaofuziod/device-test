# device-test

## 简介

   基于vue的一个插件。

### 安装
```
   npm install device-test -S
```

### 使用
```
  import Vue from 'vue'
  import Test from 'device-test'
  import 'device-test/lib/device-test.css'
  Vue.use(Test)
  
  <template>
    <device-test :visible.sync="visible" :config="config"/>
  </template>
```

### 方法和属性
```
   visible: true || false。
   config: {
      type: ''http',
      path: 'http:// ....'  
   }

   更多功能开发中。。
```
