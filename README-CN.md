# @livelybone/form
[![NPM Version](http://img.shields.io/npm/v/@livelybone/form.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/form)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/form.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/form)
![gzip with dependencies: 2.1kb](https://img.shields.io/badge/gzip--with--dependencies-2.1kb-brightgreen.svg "gzip with dependencies: 2.1kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, 天然支持 tree-shaking, 使用 es module 引用即可

[English Document](./README.md)

一个跨平台的表单管理工具，可以应用于 React, Vue, React Native, Angular... 实现表单验证, 值的格式化, 表单重置, 表单提交

## repository
https://github.com/livelybone/form.git

## Demo
https://github.com/livelybone/form#readme

## Run Example
你可以通过运行项目的 example 来了解这个组件的使用，以下是启动步骤：

1. 克隆项目到本地 `git clone https://github.com/livelybone/form.git`
2. 进入本地克隆目录 `cd your-module-directory`
3. 安装项目依赖 `npm i`(使用 taobao 源: `npm i --registry=http://registry.npm.taobao.org`)
4. 启动服务 `npm run dev`
5. 在你的浏览器看 example (地址通常是 `http://127.0.0.1:3000/examples/test.html`)

## Installation
```bash
npm i -S @livelybone/form
```

## Global name
`Form`

## Interface
去 [index.d.ts](./index.d.ts) 查看可用方法和参数

## Usage

#### 
```js
import { Form, FormItemsManager } from '@livelybone/form'

/** 管理你项目中的所有表单项 */
const formItems = new FormItemsManager({
  name: { name: 'name', value: '' },
  phone: {
    name: 'phone',
    value: '',
    validator: val => {
      return /^1\d{10}$/.test(val) ? '' : 'Chinese phone number was wrong'
    },
  },
  amount: {
    name: 'amount', 
    value: '', 
    formatter: val => {
      return val.replace(/[^\d]+/g, '')
    }
  },
  address: { name: 'address', value: '' },
})

/** 选择你当前要用到的表单项生成表单 */
const form = new Form(
  formItems.getItems(['name', 'phone', 'amount']),
  {
    onSubmit: (data) => {
      console.log(data)
      // ...submit data to server, or do other action
    },
    validateAll: true,
    initialValues: {},
    validateOnChange: true
  },
)

/** 更新表单的值 */
form.itemChange('name', 'livelybone')
form.itemChange('phone', '120')
form.itemChange('amount', 'a-b/1')

/** 你可以看到表单的校验情况 */
console.log('Is name valid: ', form.getItemByName('name').valid)
// -> Is name valid: true
console.log('Is phone valid: ', form.getItemByName('phone').valid) 
// -> Is phone valid: false
console.log('The phone error text is: ', form.getItemByName('phone').errorText) 
// -> The form error text is: Chinese phone number was wrong
console.log('Is form valid: ', form.valid) 
// -> Is form valid: false
console.log('The form error text is: ', form.errorText) 
// -> The form error text is: Chinese phone number was wrong

/** 你可以看到 amount 的值被格式化了 */
console.log('The value of amount is: ', form.getItemByName('amount').value)
// -> The value of amount is: '1'

/** 你可以获取表单的数据 */
console.log('The data of the form is: ', form.data)
// -> The data of the form is: { name: 'livelybone', phone: '120', amount: '1' }

/** 提交表单 */
form.submit()

/** 重置表单 */
form.reset()

/** 重置单个表单项 */
form.resetItem('amount')
```

在 HTML 文件中直接引用，你可以在 [CDN: unpkg](https://unpkg.com/@livelybone/form/lib/umd/) 看到你能用到的所有 js 脚本
```html
<-- 然后使用你需要的 -->
<script src="https://unpkg.com/@livelybone/form/lib/umd/<--module-->.js"></script>
```
