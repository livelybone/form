import { FormItem, FormItemsData, TupleToUnion } from './type'

export default class Form<
  FormItems extends FormItem<any, any>[],
  FormDataType extends FormItemsData<FormItems>,
  ReturnTypeOfSubmit extends any
> {
  readonly items!: Array<
    FormItem<
      TupleToUnion<FormItems, 'value'>,
      TupleToUnion<FormItems, 'field'>
    > & { id: string | number }
  >

  readonly data!: FormDataType

  readonly submit!: () => Promise<ReturnTypeOfSubmit>

  private pristine: boolean = true

  private valid: boolean = true

  private errorText: string = ''

  constructor(
    formItems: FormItems,
    // options?: FormOptions<FormDataType, ReturnTypeOfSubmit>,
  ) {
    this.items = formItems.map(item => ({ ...item, id: item.id || item.field }))
    // this.submit = () => {}
  }

  init = (initialValues: FormDataType) => {
    this.pristine = true
    this.valid = true
    this.errorText = ''

    return this.items.map(item => {
      return { ...item, value: initialValues[item.field] }
    })
  }

  formValidate(validateAll: boolean) {
    const errorText = ''
    for (let i = 0; i < this.items.length; i += 1) {
      if (!validateAll && errorText) break
    }
  }
}

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
//   [k in TupleToUnion<typeof formItems, 'field'>]: TupleToUnion<
//     typeof formItems,
//     'value'
//   >
// }
