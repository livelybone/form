# @livelybone/form
[![NPM Version](http://img.shields.io/npm/v/@livelybone/form.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/form)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/form.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/form)
![gzip with dependencies: 2.1kb](https://img.shields.io/badge/gzip--with--dependencies-2.1kb-brightgreen.svg "gzip with dependencies: 2.1kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

[中文文档](./README-CN.md)

A cross-framework form management library, realized validate, format, reset, submit

Can be used in React, Vue, Angular, React Native...

## repository
https://github.com/livelybone/form.git

## Demo
https://github.com/livelybone/form#readme

## Run Example
Your can see the usage by run the example of the module, here is the step:

1. Clone the library `git clone https://github.com/livelybone/form.git`
2. Go to the directory `cd your-module-directory`
3. Install npm dependencies `npm i`(use taobao registry: `npm i --registry=http://registry.npm.taobao.org`)
4. Open service `npm run dev`
5. See the example(usually is `http://127.0.0.1:3000/examples/test.html`) in your browser

## Installation
```bash
npm i -S @livelybone/form
```

## Global name
`Form`

## Interface
See what method or params you can use in [index.d.ts](./index.d.ts)

## Usage

#### 
```js
import { Form, FormItemsManager } from '@livelybone/form'

/** Manage all the form items in your project or page */
const formItems = new FormItemsManager({
  name: { name: 'name', value: '' },
  phone: {
    name: 'phone',
    value: '',
    validator: (val) => {
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

/** Choose the items you need to generate a form */
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

/** Change the value of form item */
form.itemChange('name', 'livelybone')

/** Batch update value of form items */
form.itemsChange({ phone: '120', amount: 'a-b/1' })

/** Get the validate result */
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

/** The value of amount has been formatted */
console.log('The value of amount is: ', form.getItemByName('amount').value)
// -> The value of amount is: '1'

/** Get the form data */
console.log('The data of the form is: ', form.data)
// -> The data of the form is: { name: 'livelybone', phone: '120', amount: '1' }

/** Submit the form */
form.submit()

/** Reset the form */
form.reset()

/** Reset one form item */
form.resetItem('amount')
```

Use in html, see what your can use in [CDN: unpkg](https://unpkg.com/@livelybone/form/lib/umd/)
```html
<-- use what you want -->
<script src="https://unpkg.com/@livelybone/form/lib/umd/<--module-->.js"></script>
```
