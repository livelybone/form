import { FormItem, FormItemsData, FullFormOptions } from './type'

export function itemValidate<
  Item extends FormItem<any, any, any>,
  Options extends FullFormOptions<any, any>
>(item: Item, formData: any, options: Options) {
  const $options = {
    ...formData,
    ...options.optionsForValidatorAndFormatter,
  }

  item.errorText =
    item.required && !item.value && item.value !== 0
      ? options.emptyErrorTemplate.replace('{label}', item.label || '')
      : item.validator
      ? item.validator(item.value, $options)
      : ''
  item.valid = !item.errorText

  return item.errorText
}

export function itemChange<
  Item extends FormItem<any, any, any>,
  Options extends FullFormOptions<any, any>
>(item: Item, value: Item['value'], formData: any, options: Options) {
  item.value = item.formatter
    ? item.formatter(value, {
        ...formData,
        ...options.optionsForValidatorAndFormatter,
      })
    : value

  // 更新 data
  formData[item.name] = item.value

  const { validateOnChange = options.validateOnChange } = item
  if (validateOnChange) itemValidate(item, formData, options)
  else item.errorText = ''
  item.pristine = false
}

export function init<
  Items extends FormItem<any, any, any>[],
  Options extends FullFormOptions<any, any>
>(items: Items, options: Options) {
  const values = { ...options.initialValues }

  const data = {} as FormItemsData<Items>
  const $items = items.map(item => {
    const $value =
      values[item.name] !== undefined ? values[item.name] : item.value

    const value = item.formatter
      ? item.formatter($value, {
          ...values,
          ...options.optionsForValidatorAndFormatter,
        })
      : $value

    values[item.name] = value
    data[item.name as keyof FormItemsData<Items>] = value

    return {
      ...item,
      id: item.id || item.name,
      required: item.required !== undefined ? item.required : true,
      value,
      pristine: true,
      valid: true,
      errorText: '',
      validateOnChange: item.validateOnChange || false,
    }
  })
  return { data, items: $items }
}

export function clearValidateRes<Item extends FormItem<any, any, any>>(
  item: Item,
) {
  item.valid = true
  item.errorText = ''
}

export function formItemsDictionary<
  FormItems extends { [id: string]: FormItem<any, any, any> }
>(formItems: FormItems) {
  const dictionary = {} as {
    [id in keyof FormItems]: FormItems[id] & { id: string }
  }
  Object.entries(formItems).forEach(([id, item]) => {
    dictionary[id as keyof FormItems] = {
      ...(item as FormItems[typeof id]),
      id,
    }
  })
  return dictionary
}
