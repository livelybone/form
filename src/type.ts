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
  validator?(value: ValueType): ErrorText

  /**
   * 格式化函数，每当值发生变化时触发
   *
   * Format the value when the value changes
   * */
  formatter?(value: ValueType): ValueType
}

export interface FormOptions<DT extends {}, ST extends any> {
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
}

export type TupleToUnion<T, K extends string> = T extends Array<
  { [k in K]: infer E }
>
  ? E extends unknown
    ? never
    : E
  : never

export type FormItemsData<
  FormItems extends FormItem<
    string | number | boolean,
    string | number,
    string | number
  >[]
> = {
  [k in TupleToUnion<FormItems, 'field'>]: TupleToUnion<FormItems, 'value'>
}
