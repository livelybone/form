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
 * @desc NodeType   label/prefix/suffix 的类型
 *                  React 框架中可能为 ReactNode
 *                  Vue 框架中可能为 string | number | VNode
 *
 * @desc NodeType   The type of label text or Element
 *                  It may be ReactNode in React
 *                  It may be string | number | VNode in Vue
 * */
export interface FormItem<
  ValueType extends DValueType,
  FieldType extends DFieldType
> {
  field: FieldType
  value: ValueType
  id?: FieldType
  /**
   * Default: ''
   * */
  required?: boolean
  /**
   * Default: true
   * */
  pristine?: boolean
  /**
   * Default: true
   * */
  valid?: boolean
  /**
   * Default: ''
   * */
  errorText?: string
  /**
   * Default: ValidateTiming.OnChange
   * */
  validateTiming?: ValidateTiming

  /**
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

export type FormItemsData<
  FormItems extends FormItem<DValueType, DFieldType>[]
> = {
  [k in TupleToUnion<FormItems, 'field'>]: TupleToUnion<FormItems, 'value'>
}
