export type ErrorText = string

/**
 * 表示表单/表单项是否被修改，true - 未被修改过，false - 已被修改过
 *
 * Indicates whether the form or the form item has been modified.
 * true - pristine
 * false - modified
 * */
export type Pristine = boolean
/**
 * 是否应该在表单项的值发生变化时调用校验函数
 *
 * Whether validator should be called at the time the value of form item changed
 *
 * Default: false
 * */
export type ValidateOnChange = boolean

/**
 * 表示当前表单/表单项是否合法
 *
 * Indicates whether the form or the form item is valid.
 * */
export type Valid = boolean

export interface FormItem<
  ValueType extends any,
  NameType extends string | number,
  IdType extends string | number
> {
  name: NameType
  value: ValueType
  /**
   * 如果 id 没有定义，它的值将会被置为 name 的值
   *
   * If !!id === false, the value of id will be reset to the value of name
   * */
  id?: IdType | NameType
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
   * Default: true
   * */
  required?: boolean
  /**
   * 用于动态计算表单项是否必填，优先级高于 required
   *
   * @params formDataAndOptions           form.options.optionsForValidatorAndFormatter 与 form.data 的结合
   *
   *
   * It is used to calculate the required property of the form item dynamically, with a priority higher than `required` key
   *
   * @options formDataAndOptions          The combination of `form.options.optionsForValidatorAndFormatter` and `form.data`
   *
   * Default: undefined
   * */
  calcRequired?(formDataAndOptions: any): boolean

  /**
   * 这个表单项的校验函数
   *
   * @params formDataAndOptions           form.options.optionsForValidatorAndFormatter 与 form.data 的结合
   *
   *
   * Validate function of the form item
   *
   * @options formDataAndOptions          The combination of `form.options.optionsForValidatorAndFormatter` and `form.data`
   *
   * Default: (val) => ''
   * */
  validator?(value: ValueType, formDataAndOptions: any): ErrorText

  /**
   * 格式化函数，每当值发生变化时触发
   *
   * @params formDataAndOptions           form.options.optionsForValidatorAndFormatter 与 form.data 的结合
   *
   * Format the value when the value changes
   *
   * @options formDataAndOptions          The combination of `form.options.optionsForValidatorAndFormatter` and `form.data`
   *
   * Default: val => val
   * */
  formatter?(value: ValueType, formDataAndOptions: any): ValueType

  /**
   * Other keys
   * */
  [key: string]: any
}

export interface FormOptions<DT extends {}, ST extends any> {
  initialValues?: Partial<DT>
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
   *     name: 'asset',
   *     value: 'CNY',
   *     type: 'select',
   *     options: [
   *       { name: 'CNY', value: 'CNY', precision: '2' },
   *       { name: 'USD', value: 'USD', precision: '4' },
   *     ]
   *   },
   *   amount: {
   *     label: 'amount',
   *     name: 'amount',
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
  optionsForValidatorAndFormatter?: { [key: string]: any; [key: number]: any }

  /**
   * Called in Form.prototype.submit
   * */
  onSubmit?(data: DT): Promise<ST>

  /**
   * 目标组件更新的方法，比如 React 组件的 forceUpdate 方法和 Vue 组件的 $forceUpdate 方法
   *
   * The update method of the component which used the library, e.g: forceUpdate of React, $forceUpdate of Vue
   * */
  componentUpdateFn?(): void
}

export type TupleToUnion<
  T,
  K extends string,
  FallbackType = any
> = T extends Array<{ [k in K]: infer E }>
  ? unknown extends E
    ? FallbackType
    : E
  : FallbackType

export type FormName<
  FormItems extends FormItem<any, any, any>[]
> = TupleToUnion<FormItems, 'name', string | number>
export type FormValue<
  FormItems extends FormItem<any, any, any>[]
> = TupleToUnion<FormItems, 'value', any>
export type FormId<FormItems extends FormItem<any, any, any>[]> = TupleToUnion<
  FormItems,
  'id',
  string | number
>

export type FormItemsData<
  FormItems extends FormItem<any, string | number, string | number>[]
> = {
  [k in FormName<FormItems>]: FormValue<FormItems>
}

export type TupleUnion<T> = T extends (infer E)[]
  ? unknown extends E
    ? never
    : E
  : never

/**
 * 是否要更新组件
 *
 * Whether should update the component
 *
 * Default: true
 * */
export type ShouldUpdateComponent = boolean
