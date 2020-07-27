import {
  IsTuple,
  TupleMap,
  TupleToUnion,
  UnionPop,
  UnionToTupleWithMap,
} from 'union-tuple'

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

interface FullFormItem<
  ValueType extends any,
  NameType extends string | number,
  IdType extends string | number
> extends FormItem<ValueType, NameType, IdType> {
  readonly name: NameType
  readonly id: NonNullable<IdType | NameType>
  value: ValueType
  pristine: Pristine
  valid: Valid
  errorText: ErrorText
  validateOnChange: ValidateOnChange
  required: boolean
}

interface FormOptions<DT extends {}, ST extends any> {
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
  optionsForValidatorAndFormatter?: {
    [key: string]: any
    [key: number]: any
  }

  /**
   * Called in Form.prototype.submit
   * */
  onSubmit?(data: DT): PromiseLike<ST>

  /**
   * 目标组件更新的方法，比如 React 组件的 forceUpdate 方法和 Vue 组件的 $forceUpdate 方法
   *
   * The update method of the component which used the library, e.g: forceUpdate of React, $forceUpdate of Vue
   * */
  componentUpdateFn?(): void
}

interface FullFormOptions<DT extends {}, ST extends any>
  extends FormOptions<DT, ST> {
  initialValues: DT
  validateAll: boolean
  validateOnChange: ValidateOnChange
  emptyErrorTemplate: string
}

declare type FormProp<T, K extends string, FallbackType = any> = T extends {
  [k in K]: infer E
}[]
  ? unknown extends E
    ? FallbackType
    : E
  : FallbackType
declare type FormName<FormItems extends FormItem<any, any, any>[]> = FormProp<
  FormItems,
  'name',
  string | number
>
declare type FormValue<FormItems extends FormItem<any, any, any>[]> = FormProp<
  FormItems,
  'value',
  any
>
declare type FormId<FormItems extends FormItem<any, any, any>[]> = FormProp<
  FormItems,
  'id',
  string | number
>
declare type R<FormItemUnion, Result extends {} = {}> = {
  1: Result
  0: R<
    Exclude<FormItemUnion, UnionPop<FormItemUnion>>,
    Result &
      (UnionPop<FormItemUnion> extends {
        name: infer Name
        value: infer Value
      }
        ? Name extends string | number
          ? {
              [k in Name]: Value
            }
          : any
        : any)
  > extends infer R
    ? R
    : {}
}[[FormItemUnion] extends [never] ? 1 : 0]
declare type FormItemsData<
  FormItems extends FormItem<any, string | number, string | number>[]
> = (IsTuple<FormItems> extends true
  ? R<TupleToUnion<FormItems>>
  : R<FormItems[0]>) extends infer E
  ? unknown extends E
    ? any
    : E
  : any
/**
 * 是否要更新组件
 *
 * Whether should update the component
 *
 * Default: true
 * */
declare type ShouldUpdateComponent = boolean

declare type Item<FormItems extends any[]> = {
  [index in Extract<keyof FormItems, number>]: FormItems[index] &
    FullFormItem<
      FormItems[index]['value'],
      FormItems[index]['name'],
      FormItems[index]['id'] | FormItems[index]['name']
    >
}[Extract<keyof FormItems, number>]

declare class Form<
  FormItems extends FormItem<any, any, any>[],
  ReturnTypeOfSubmit extends any = FormItemsData<FormItems>
> {
  /**
   * @desc 表单项数组
   *
   * @desc Array of form items
   * */
  items: Item<FormItems>[]

  $errorText: ErrorText

  readonly options: Required<
    FullFormOptions<FormItemsData<FormItems>, ReturnTypeOfSubmit>
  >

  constructor(
    formItems: FormItems,
    options?: FormOptions<FormItemsData<FormItems>, ReturnTypeOfSubmit>,
  )

  /**
   * @desc 当前表单数据，由表单项数组生成
   *
   * @desc Data of the form, generated by form items
   * */
  data: FormItemsData<FormItems>

  get pristine(): Pristine

  get valid(): Valid

  /**
   * @desc 当前表单应该显示的错误信息
   *
   * @desc The current errorText of the form
   * */
  get errorText(): ErrorText

  set errorText(errorText: ErrorText)

  getItemByName(name: FormName<FormItems>): Item<FormItems> | undefined

  getItemById(
    id: FormId<FormItems> | FormName<FormItems>,
  ): Item<FormItems> | undefined

  /**
   * @desc 更新与参数 name 对应的表单项的值
   *
   * @desc Update the value of the form item that matched the param `name`
   * */
  itemChange(
    name: FormName<FormItems>,
    value: FormValue<FormItems>,
    shouldUpdateComp?: ShouldUpdateComponent,
  ): void

  /**
   * @desc 批量更新与表单项的值
   *
   * @desc Batch updates with the values of form items
   * */
  itemsChange(
    values: Partial<FormItemsData<FormItems>>,
    shouldUpdateComp?: ShouldUpdateComponent,
  ): void

  /**
   * @desc 校验与参数 name 对应的表单项
   *
   * @desc Validate the value of the form item that matched the param `name`
   * */
  itemValidate(
    name: FormName<FormItems>,
    updatePristine?: boolean,
    shouldUpdateComp?: ShouldUpdateComponent,
  ): ErrorText

  /**
   * @desc 从外部更新表单项的校验结果，这个可以用于异步校验
   *
   * @desc Update the validate result outside, it is useful for async validate
   * */
  updateValidateResult(
    results: {
      [key in FormName<FormItems>]: ErrorText
    },
    shouldUpdateComp?: ShouldUpdateComponent,
  ): void

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
    validateAll?: boolean,
    shouldUpdateComp?: ShouldUpdateComponent,
  ): ErrorText

  /**
   * @desc 在提交之前会先做一次表单校验（运行 formValidate）
   *
   * @desc Method formValidate will be called before run the onSubmit function in this method
   * */
  submit(shouldUpdateComp?: ShouldUpdateComponent): Promise<ReturnTypeOfSubmit>

  /**
   * @desc 重置表单。会更新表单的初始值，如果不想更新初始值，请使用 itemsChange
   *
   * @desc Reset form. The initialValues of the form will be update. If you do not want to update the initialValues, use itemsChange
   *
   * @params values             Default: this.options.initialValues
   * */
  reset(
    values?: Partial<FormItemsData<FormItems>>,
    shouldUpdateComp?: ShouldUpdateComponent,
  ): void

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
    value?: FormValue<FormItems>,
    shouldUpdateComp?: ShouldUpdateComponent,
  ): void

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
    shouldUpdateComp?: ShouldUpdateComponent,
  ): void

  private $updateOptions

  /**
   * 应在 this.options.optionsForValidatorAndFormatter 或者 this.data 发生变化时更新 required 值
   *
   * The required value of form item should be updated after the `this.options.optionsForValidatorAndFormatter` and `this.data` changed
   * */
  updateItemsRequired(): void

  updateOptions(
    options: FormOptions<FormItemsData<FormItems>, ReturnTypeOfSubmit>,
  ): void
}

declare type InfiniteItems<
  FormItems extends {
    [id: string]: FormItem<any, any, any>
  },
  Ids extends any[]
> = {
  [id in TupleToUnion<Ids>]: FormItemsManager<FormItems>['allItems'][id]
}[TupleToUnion<Ids>][]
declare type GetFormItems<
  FormItems extends {
    [id: string]: FormItem<any, any, any>
  },
  Ids extends any[]
> = (IsTuple<Ids> extends true
  ? TupleMap<Ids, FormItemsManager<FormItems>['allItems']>
  : UnionToTupleWithMap<
      Ids[0],
      FormItemsManager<FormItems>['allItems']
    >) extends infer E
  ? unknown extends E
    ? InfiniteItems<FormItems, Ids>
    : E
  : InfiniteItems<FormItems, Ids>

declare class FormItemsManager<
  FormItems extends {
    [id: string]: FormItem<any, any, any>
  }
> {
  readonly allItems: {
    [id in Exclude<keyof FormItems, symbol>]: FormItems[id] &
      FormItem<FormItems[id]['value'], FormItems[id]['name'], id>
  }

  constructor(formItems: FormItems)

  getItem<Id extends keyof FormItemsManager<FormItems>['allItems']>(
    id: Id,
  ): FormItemsManager<FormItems>['allItems'][Id]

  getItems<Ids extends (keyof FormItemsManager<FormItems>['allItems'])[]>(
    ids: Ids,
  ): GetFormItems<FormItems, Ids>
}

export {
  ErrorText,
  Form,
  FormId,
  FormItem,
  FormItemsData,
  FormItemsManager,
  FormName,
  FormOptions,
  FormProp,
  FormValue,
  FullFormItem,
  FullFormOptions,
  Pristine,
  ShouldUpdateComponent,
  Valid,
  ValidateOnChange,
}
