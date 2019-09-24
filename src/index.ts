// import { FormItem, FormItemsData, FormOptions, TupleToUnion } from './type'
// import { itemValidate } from './utils'
//
// export default class Form<FormItems extends FormItem<any, any>[],
//   FormDataType extends FormItemsData<FormItems>,
//   ReturnTypeOfSubmit extends any> {
//   readonly items!: Array<FormItem<TupleToUnion<FormItems, 'value'>,
//     TupleToUnion<FormItems, 'field'>> & { id: string | number }>
//
//   readonly data!: FormDataType
//
//   private pristine: boolean = true
//
//   private valid: boolean = true
//
//   private errorText: string = ''
//
//   private options!: Required<Pick<FormOptions<FormDataType, ReturnTypeOfSubmit | FormDataType>, 'onSubmit' | 'validateAll'>>
//
//   constructor(
//     formItems: FormItems,
//     options?: FormOptions<FormDataType, ReturnTypeOfSubmit | FormDataType>,
//   ) {
//     this.items = formItems.map(item => ({ ...item, id: item.id || item.field }))
//     this.options = {
//       onSubmit: (data: FormDataType) => Promise.resolve(data),
//       validateAll: true,
//       ...options,
//     }
//   }
//
//   init = (initialValues: FormDataType) => {
//     this.pristine = true
//     this.valid = true
//     this.errorText = ''
//
//     return this.items.map(item => {
//       return { ...item, value: initialValues[item.field] }
//     })
//   }
//
//   submit = () => {
//     const { data, errorText } = this.formValidate()
//     if (data) {
//       return this.options.onSubmit(data)
//     } else {
//       return Promise.reject(new Error(errorText))
//     }
//   }
//
//   itemValidate = (field: TupleToUnion<FormItems, 'field'>) => {
//     const item = this.items.find($item => $item.field === field)
//     if (item) return itemValidate(item, this)
//     return 'The field isn\'t exist in this form'
//   }
//
//   formValidate = (validateAll = this.options.validateAll) => {
//     let errorTxt = ''
//     for (let i = 0; i < this.items.length; i += 1) {
//       if (!validateAll && errorTxt) break
//
//       const item = this.items[i]
//
//       errorTxt = itemValidate(item, this)
//
//       if (item.valid) this.data[item.field] = item.value
//     }
//
//     this.errorText = errorTxt
//     return this.valid ? { data: this.data, errorText: '' } : { data: null, errorText: this.errorText }
//   }
// }
//
// const formItems = [
//   { field: 'name' as 'name', value: '' },
//   { field: 1 as 1, value: '1' },
// ]
// const form = new Form(formItems, {
//   initialValues: { name: '', 1: 'a' },
//   onSubmit(data) {
//     return Promise.resolve({})
//   },
// })
//
// type F = {
//   [k in TupleToUnion<typeof formItems, 'field'>]: TupleToUnion<typeof formItems,
//     'value'>
// }
