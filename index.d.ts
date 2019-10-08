declare type ErrorText = string
/**
 * 表示表单/表单项是否被修改，true - 未被修改过，false - 已被修改过
 *
 * Indicates whether the form or the form item has been modified.
 * true - pristine
 * false - modified
 * */
declare type Pristine = boolean
/**
 * 是否应该在表单项的值发生变化时调用校验函数
 *
 * Whether validator should be called at the time the value of form item changed
 *
 * Default: false
 * */
declare type ValidateOnChange = boolean
/**
 * 表示当前表单/表单项是否合法
 *
 * Indicates whether the form or the form item is valid.
 * */
declare type Valid = boolean

interface FormItem<
  ValueType extends string | number | boolean,
  FieldType extends string | number,
  IdType extends string | number
> {
  field: FieldType
  value: ValueType
  /**
   * 如果 id 没有定义，它的值将会被置为 field 的值
   *
   * If !!id === false, the value of id will be reset to the value of field
   * */
  id?: IdType | FieldType
  /**
   * 当检验值为空的表单项时，errorText 需根据 label 生成
   * 比如：`姓名不能为空`，`密码不能为空`
   *
   * When verifying a form item with an empty value, the errorText is generated based on the label
   * e.g. `姓名不能为空`，`密码不能为空`
   * */
  label?: string
  /**
   * Default: true
   * */
  required?: boolean
  /**
   * Default: true
   * */
  pristine?: Pristine
  /**
   * Default: true
   * */
  valid?: Valid
  /**
   * Default: ''
   * */
  errorText?: string
  validateOnChange?: ValidateOnChange

  /**
   * 这个表单项的校验函数
   *
   * Validate function of the form item
   *
   * Default: (val) => ''
   * */
  validator?(value: ValueType, options?: any): ErrorText

  /**
   * 格式化函数，每当值发生变化时触发
   *
   * Format the value when the value changes
   * */
  formatter?(value: ValueType, options?: any): ValueType
}

interface FormOptions<DT extends {}, ST extends any> {
  /**
   * Called in Form.prototype.submit
   * */
  onSubmit?(data: DT): Promise<ST>

  initialValues?: DT
  /**
   * formValidate 方法的 validateAll 参数的默认值
   *
   * The default value of param validateAll of method formValidate
   *
   * Default: false
   * */
  validateAll?: boolean
  validateOnChange?: ValidateOnChange
  /**
   * 当检验值为空的表单项时，errorText 的生成模板。`{label}` 为表单项 label 属性的占位符
   *
   * ErrorText's generated template when verifying a form item with an empty value. `{label}` is a placeholder of the label prop of the form item
   *
   * Default: `{label}不能为空`
   * */
  emptyErrorTemplate?: string
  /**
   * 提供一些参数，用于实现表单项的动态校验或者动态格式化
   * 比如：不同币种金额的校验，币种的小数位可能会不一样，这时候我们可以提供一个 precision 参数，validator 函数可以从 options 拿到这个参数，从而做对应校验
   *
   * Provides parameters for dynamic validation of form items
   * This is an application scenario:
   *  Where the number of decimal places in different currencies may be different with each other.
   *  In this case, we can provide a precision parameter, which the validator function can take from the options to do the validating
   *
   * Code Example:
   *
   * const formItems = {
   *   asset: {
   *     label: 'asset',
   *     field: 'asset',
   *     value: 'CNY',
   *     type: 'select',
   *     options: [
   *       { name: 'CNY', value: 'CNY', precision: '2' },
   *       { name: 'USD', value: 'USD', precision: '4' },
   *     ]
   *   },
   *   amount: {
   *     label: 'amount',
   *     field: 'amount',
   *     value: '',
   *     validator: (val, { precision }) => {
   *      if (precision <= 0) {
   *      return /^\d+$/.test(val) && +val % 10 ** -precision === 0
   *        ? ''
   *        : 'Please input the correct amount'
   *      }
   *      const reg = new RegExp(`^(0|[1-9]\\d*)(\\.\\d{1,${precision}})?$`)
   *      return reg.test(val) ? '' : 'Please input the correct amount'
   *     }
   *   }
   * }
   *
   * const form = new Form(
   *   [
   *    formItems.asset,
   *    formItems.amount,
   *   ],
   *   {
   *    optionsForValidatorAndFormatter: { precision: 2 }
   *   },
   * )
   *
   * // When the asset change to USD, you can update the options
   * form.itemChange('asset', 'USD')
   * form.updateOptions({ optionsForValidatorAndFormatter: { precision: 4 } })
   * */
  optionsForValidatorAndFormatter?: {
    [key: string]: any
    [key: number]: any
  }
}

declare type TupleToUnion<T, K extends string> = T extends Array<
  {
    [k in K]: infer E
  }
>
  ? E extends unknown
    ? never
    : E
  : never
declare type FormItemsData<
  FormItems extends FormItem<
    string | number | boolean,
    string | number,
    string | number
  >[]
> = {
  [k in TupleToUnion<FormItems, 'field'>]: TupleToUnion<FormItems, 'value'>
}

declare class Form<
  FormItems extends FormItem<any, any, any>[],
  FormDataType extends FormItemsData<FormItems>,
  ReturnTypeOfSubmit extends any
> {
  private readonly options

  /**
   * @desc 表单项数组
   *
   * @desc Array of form items
   * */
  items: Array<
    FormItem<
      TupleToUnion<FormItems, 'value'>,
      TupleToUnion<FormItems, 'field'>,
      TupleToUnion<FormItems, 'id'> | TupleToUnion<FormItems, 'field'>
    > & {
      id: TupleToUnion<FormItems, 'id'> | TupleToUnion<FormItems, 'field'>
      required: boolean
      pristine: Pristine
      valid: Valid
      errorText: string
    }
  >

  /**
   * @desc 当前表单数据，由表单项数组生成
   *
   * @desc Data of the form, generated by form items
   * */
  readonly data: FormDataType

  readonly pristine: Pristine

  readonly valid: Valid

  /**
   * @desc 当前表单应该显示的错误信息
   *
   * @desc The current errorText of the form
   * */
  readonly errorText: ErrorText

  constructor(
    formItems: FormItems,
    options?: FormOptions<FormDataType, ReturnTypeOfSubmit | FormDataType>,
  )

  getItemByField(
    field: TupleToUnion<FormItems, 'field'>,
  ):
    | (FormItem<
        TupleToUnion<FormItems, 'value'>,
        TupleToUnion<FormItems, 'field'>,
        TupleToUnion<FormItems, 'field'> | TupleToUnion<FormItems, 'id'>
      > & {
        id: TupleToUnion<FormItems, 'field'> | TupleToUnion<FormItems, 'id'>
        required: boolean
        pristine: boolean
        valid: boolean
        errorText: string
      })
    | undefined

  getItemById(
    id: TupleToUnion<FormItems, 'id'> | TupleToUnion<FormItems, 'field'>,
  ):
    | (FormItem<
        TupleToUnion<FormItems, 'value'>,
        TupleToUnion<FormItems, 'field'>,
        TupleToUnion<FormItems, 'field'> | TupleToUnion<FormItems, 'id'>
      > & {
        id: TupleToUnion<FormItems, 'field'> | TupleToUnion<FormItems, 'id'>
        required: boolean
        pristine: boolean
        valid: boolean
        errorText: string
      })
    | undefined

  /**
   * @desc 更新与参数 field 对应的表单项的值
   *
   * @desc Update the value of the form item that matched the param `field`
   * */
  itemChange(
    field: TupleToUnion<FormItems, 'field'>,
    value: TupleToUnion<FormItems, 'value'>,
  ): void

  /**
   * @desc 校验与参数 field 对应的表单项
   *
   * @desc Validate the value of the form item that matched the param `field`
   * */
  itemValidate(field: TupleToUnion<FormItems, 'field'>): ErrorText

  /**
   * @desc 校验整个表单，更新表单实例属性：valid, pristine, errorText, data, items
   * @param validateAll   是否校验所有表单项
   *                      true - 校验所有表单项
   *                      false - 当遇到第一个校验错误的表单项时，停止对其他表单项的校验
   *
   *                      默认值: this.options.validateAll
   *
   * @desc Form validate, update the value of properties: valid, pristine, errorText, data, items
   * @param validateAll   Whether validate all the form item in the form
   *                      true - validate all
   *                      false - stop validate other form items when the first form item with a validation error is encountered
   *
   *                      Default: this.options.validateAll
   *
   * @return ErrorText
   * */
  formValidate(validateAll?: boolean): ErrorText

  /**
   * @desc 在提交之前会先做一次表单校验（运行 formValidate）
   *
   * @desc Method formValidate will be called before run the onSubmit function in this method
   * */
  submit(): Promise<ReturnTypeOfSubmit | FormDataType>

  /**
   * @desc 重置表单
   *
   * @desc Reset form
   *
   * @param values             Default: this.options.initialValues
   * */
  reset(values?: FormDataType): void

  /**
   * @desc 用参数 value 的值重置与参数 field 对应的表单项
   *
   * @desc Reset form item that matched the param field with the param value
   *
   * @param field
   * @param value              Default: this.options.initialValues[field]
   * */
  resetItem(
    field: TupleToUnion<FormItems, 'field'>,
    value?: TupleToUnion<FormItems, 'value'>,
  ): void

  /**
   * @desc 清除表单/表单项的校验结果
   *
   * @desc Clear the validate result of the form or the form item that matched the param field
   *
   * @param [field]            If `!!field === true`, it will clear the validate result of the form item that matched the param field
   *                           else, if will clear the validate result of the form
   * */
  clearValidateResult(field?: TupleToUnion<FormItems, 'field'>): void

  updateOptions(
    options: FormOptions<FormDataType, ReturnTypeOfSubmit | FormDataType>,
  ): void
}

declare class FormItemsManager<
  FormItems extends {
    [id: string]: FormItem<any, any, any>
  }
> {
  private readonly allItems

  constructor(formItems: FormItems)

  getItem<Id extends keyof FormItems>(
    id: Id,
  ):
    | (FormItems[Id] & {
        id: Id
      })
    | undefined

  getItems<Ids extends (keyof FormItems)[]>(
    ids: Ids,
  ): (
    | (FormItems[keyof FormItems] & {
        id: keyof FormItems
      })
    | undefined)[]
}

export {
  ErrorText,
  Form,
  FormItem,
  FormItemsData,
  FormItemsManager,
  FormOptions,
  Pristine,
  TupleToUnion,
  Valid,
  ValidateOnChange,
}
