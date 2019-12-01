import {
  ErrorText,
  FormId,
  FormItem,
  FormItemsData,
  FormName,
  FormOptions,
  FormValue,
  Pristine,
  ShouldUpdateComponent,
  Valid,
} from './type'
import { clearValidateRes, init, itemChange, itemValidate } from './utils'

type Item<FormItems extends any[]> = {
  [index in Extract<keyof FormItems, number>]: FormItems[index] & {
    id: FormId<FormItems> | FormName<FormItems>
    required: boolean
    pristine: Pristine
    valid: Valid
    errorText: string
    [key: string]: any
    [key: number]: any
  }
}[Extract<keyof FormItems, number>]

export class Form<
  FormItems extends FormItem<any, any, any>[],
  ReturnTypeOfSubmit extends any
> {
  /**
   * @desc 表单项数组
   *
   * @desc Array of form items
   * */
  items!: Array<Item<FormItems>>

  $errorText: ErrorText = ''

  private readonly options: Required<
    FormOptions<
      FormItemsData<FormItems>,
      ReturnTypeOfSubmit | FormItemsData<FormItems>
    > & { initialValues: FormItemsData<FormItems> }
  > = {} as any

  constructor(
    formItems: FormItems,
    options: FormOptions<
      FormItemsData<FormItems>,
      ReturnTypeOfSubmit | FormItemsData<FormItems>
    > = {},
  ) {
    this.updateOptions(options)
    const itemsAndData = init(formItems, this.options)
    this.items = itemsAndData.items
    this.data = itemsAndData.data
    this.updateOptions({ initialValues: this.data })
  }

  /**
   * @desc 当前表单数据，由表单项数组生成
   *
   * @desc Data of the form, generated by form items
   * */
  data!: FormItemsData<FormItems>

  get pristine(): Pristine {
    return this.items.every(item => item.pristine)
  }

  get valid(): Valid {
    return this.items.every(item => item.valid)
  }

  /**
   * @desc 当前表单应该显示的错误信息
   *
   * @desc The current errorText of the form
   * */
  get errorText(): ErrorText {
    if (this.$errorText) return this.$errorText
    const item = this.items.find($item => $item.errorText)
    return item ? item.errorText : ''
  }

  set errorText(errorText) {
    this.$errorText = errorText
  }

  getItemByName(name: FormName<FormItems>): Item<FormItems> | undefined {
    return this.items.find(item => item.name === name)
  }

  getItemById(
    id: FormId<FormItems> | FormName<FormItems>,
  ): Item<FormItems> | undefined {
    return this.items.find(item => item.id === id)
  }

  /**
   * @desc 更新与参数 name 对应的表单项的值
   *
   * @desc Update the value of the form item that matched the param `name`
   * */
  itemChange(
    name: FormName<FormItems>,
    value: FormValue<FormItems>,
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): void {
    const item = this.getItemByName(name)
    if (item) {
      itemChange(item, value, this.data, this.options)
      this.data[item.name as keyof FormItemsData<FormItems>] = item.value

      this.errorText = ''
      if (shouldUpdateComp && this.options.componentUpdateFn)
        this.options.componentUpdateFn()
    } else console.error("Form: The name isn't exist in this form")
  }

  /**
   * @desc 批量更新与表单项的值
   *
   * @desc Batch updates with the values of form items
   * */
  itemsChange(
    values: {
      [k in FormName<FormItems>]: FormValue<FormItems>
    },
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): void {
    this.items.forEach(item => {
      const name = item.name as FormName<FormItems>
      if (name in values)
        itemChange(item, values[name], this.data, this.options)
      this.data[item.name as keyof FormItemsData<FormItems>] = item.value
    })
    this.errorText = ''
    if (shouldUpdateComp && this.options.componentUpdateFn)
      this.options.componentUpdateFn()
  }

  /**
   * @desc 校验与参数 name 对应的表单项
   *
   * @desc Validate the value of the form item that matched the param `name`
   * */
  itemValidate(
    name: FormName<FormItems>,
    updatePristine?: boolean,
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): ErrorText {
    const item = this.getItemByName(name)
    if (item) {
      if (updatePristine) item.pristine = false
      const err = itemValidate(item, this.data, this.options)
      if (shouldUpdateComp && this.options.componentUpdateFn)
        this.options.componentUpdateFn()
      return err
    }
    return 'The name isn\'t exist in this form'
  }

  /**
   * @desc 从外部更新表单项的校验结果，这个可以用于异步校验
   *
   * @desc Update the validate result outside, it is useful for async validate
   * */
  updateValidateResult(
    results: { [key in FormName<FormItems>]: ErrorText },
    shouldUpdateComp: ShouldUpdateComponent = true,
  ) {
    this.items.forEach(item => {
      if (item.name in results) {
        const errorText = results[item.name as FormName<FormItems>]
        if (errorText) {
          item.valid = false
          item.errorText = errorText
        } else {
          item.valid = true
          item.errorText = ''
        }
      }
    })

    if (shouldUpdateComp && this.options.componentUpdateFn)
      this.options.componentUpdateFn()
  }

  /**
   * @desc 校验整个表单
   * @params validateAll  是否校验所有表单项
   *                      true - 校验所有表单项
   *                      false - 当遇到第一个校验错误的表单项时，停止对其他表单项的校验
   *
   *                      默认值: this.options.validateAll
   *
   * @desc Form validate
   * @params validateAll  Whether validate all the form item in the form
   *                      true - validate all
   *                      false - stop validate other form items when the first form item with a validation error is encountered
   *
   *                      Default: this.options.validateAll
   *
   * @return ErrorText
   * */
  formValidate(
    validateAll = this.options.validateAll,
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): ErrorText {
    let errorTxt = ''

    for (let i = 0; i < this.items.length; i += 1) {
      if (!validateAll && errorTxt) break
      const err = itemValidate(this.items[i], this.data, this.options)
      if (!errorTxt) errorTxt = err
    }

    if (shouldUpdateComp && this.options.componentUpdateFn)
      this.options.componentUpdateFn()

    return errorTxt
  }

  /**
   * @desc 在提交之前会先做一次表单校验（运行 formValidate）
   *
   * @desc Method formValidate will be called before run the onSubmit function in this method
   * */
  submit(
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): Promise<ReturnTypeOfSubmit | FormItemsData<FormItems>> {
    // reset the $errorText prop
    this.errorText = ''

    const errorText = this.formValidate(this.options.validateAll, false)
    return (!errorText
      ? this.options.onSubmit(this.data)
      : Promise.reject(new Error(errorText))
    ).finally(() => {
      if (shouldUpdateComp && this.options.componentUpdateFn)
        this.options.componentUpdateFn()
    })
  }

  /**
   * @desc 重置表单。会更新表单的初始值，如果不想更新初始值，请使用 itemsChange
   *
   * @desc Reset form. The initialValues of the form will be update. If you do not want to update the initialValues, use itemsChange
   *
   * @params values             Default: this.options.initialValues
   * */
  reset(
    values: Partial<FormItemsData<FormItems>> = this.options.initialValues,
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): void {
    this.updateOptions({ initialValues: values })
    const itemsAndData = init(this.items as FormItems, this.options)
    this.items = itemsAndData.items
    this.data = itemsAndData.data

    if (shouldUpdateComp && this.options.componentUpdateFn)
      this.options.componentUpdateFn()
  }

  /**
   * @desc 用参数 value 的值重置与参数 name 对应的表单项。会更新表单项的初始值
   *
   * @desc Reset form item that matched the param name with the param value. The initial value of the form item will be update
   *
   * @params name
   * @params value              Default: this.options.initialValues[name]
   * */
  resetItem(
    name: FormName<FormItems>,
    value: FormValue<FormItems> = this.options.initialValues[name],
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): void {
    const item = this.getItemByName(name)
    if (item) {
      item.pristine = true
      item.value = item.formatter
        ? item.formatter(value, {
            ...this.data,
            ...this.options.optionsForValidatorAndFormatter,
          })
        : value
      this.data[item.name as keyof FormItemsData<FormItems>] = item.value
      this.options.initialValues[
        item.name as keyof Partial<FormItemsData<FormItems>>
      ] = value

      clearValidateRes(item)

      if (shouldUpdateComp && this.options.componentUpdateFn)
        this.options.componentUpdateFn()
    } else console.error("Form: The name isn't exist in this form")
  }

  /**
   * @desc 清除表单/表单项的校验结果
   *
   * @desc Clear the validate result of the form or the form item that matched the param name
   *
   * @params [name]            If `!!name === true`, it will clear the validate result of the form item that matched the param name
   *                           else, if will clear the validate result of the form
   * */
  clearValidateResult(
    name?: FormName<FormItems>,
    shouldUpdateComp: ShouldUpdateComponent = true,
  ): void {
    if (name) {
      const item = this.getItemByName(name)
      if (item) {
        clearValidateRes(item)
      } else console.error("Form: The name isn't exist in this form")
    } else {
      this.items.forEach(clearValidateRes)
    }

    if (shouldUpdateComp && this.options.componentUpdateFn)
      this.options.componentUpdateFn()
  }

  updateOptions(
    options: FormOptions<
      FormItemsData<FormItems>,
      ReturnTypeOfSubmit | FormItemsData<FormItems>
    >,
  ) {
    this.options.onSubmit =
      options.onSubmit ||
      this.options.onSubmit ||
      ((data: FormItemsData<FormItems>) => Promise.resolve(data))
    this.options.validateAll =
      options.validateAll || this.options.validateAll || false
    this.options.initialValues = {
      ...this.options.initialValues,
      ...options.initialValues,
    }
    this.options.validateOnChange =
      options.validateOnChange || this.options.validateOnChange || false
    this.options.emptyErrorTemplate =
      options.emptyErrorTemplate ||
      this.options.emptyErrorTemplate ||
      '{label}不能为空'
    this.options.optionsForValidatorAndFormatter = {
      ...this.options.optionsForValidatorAndFormatter,
      ...options.optionsForValidatorAndFormatter,
    }
    this.options.componentUpdateFn =
      options.componentUpdateFn || this.options.componentUpdateFn
  }
}
