export type ErrorText = string

/**
 * 校验函数触发的时机
 *
 * Timing of calling validator
 * */
export enum ValidateTiming {
  OnChange = 0,
  OnBlur = 1,
}

export type DValueType = string | number | boolean
export type DFieldType = string | number

/**
 * 表示表单/表单项是否被修改，true - 未被修改过，false - 已被修改过
 *
 * Indicates whether the form or the form item has been modified.
 * true - pristine
 * false - modified
 * */
export type Pristine = boolean

/**
 * 表示当前表单/表单项是否合法
 *
 * Indicates whether the form or the form item is valid.
 * */
export type Valid = boolean

export interface FormItem<
  ValueType extends DValueType,
  FieldType extends DFieldType
> {
  field: FieldType
  value: ValueType
  /**
   * 如果 id 没有定义，它的值将会被置为 field 的值
   *
   * If !!id === false, the value of id will be reset to the value of field
   * */
  id?: string | number
  /**
   * Default: ''
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
  /**
   * Default: ValidateTiming.OnChange
   * */
  validateTiming?: ValidateTiming

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
   * Default: true
   * */
  validateAll?: boolean
}

export type TupleToUnion<T, K extends string> = T extends Array<
  { [k in K]: infer E }
>
  ? E
  : never

export type GetFieldType<FormItems extends FormItem<any, any>[]> = TupleToUnion<
  FormItems,
  'field'
>
export type GetValueType<FormItems extends FormItem<any, any>[]> = TupleToUnion<
  FormItems,
  'value'
>

export type NonUnknown<T> = T extends unknown ? never : T

export type GetIdType<FormItems extends FormItem<any, any>[]> =
  | NonUnknown<TupleToUnion<FormItems, 'id'>>
  | GetFieldType<FormItems>

export type FormItemsData<
  FormItems extends FormItem<DValueType, DFieldType>[]
> = {
  [k in GetFieldType<FormItems>]: GetValueType<FormItems>
}
