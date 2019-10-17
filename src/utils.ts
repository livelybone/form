import { FormItem, FormOptions } from './type'

export function itemValidate<
  Item extends FormItem<any, any, any>,
  Options extends Required<FormOptions<any, any>>
>(item: Item, options: Options) {
  item.errorText =
    item.required !== false && !item.value
      ? options.emptyErrorTemplate.replace('{label}', item.label || '')
      : item.validator
      ? item.validator(item.value, options.optionsForValidatorAndFormatter)
      : ''
  item.valid = !item.errorText

  return item.errorText
}

export function init<
  Items extends FormItem<any, any, any>[],
  Options extends Required<FormOptions<any, any>>
>(items: Items, options: Options) {
  const values = options.initialValues || {}

  return items.map(item => {
    const $value =
      values[item.name] !== undefined ? values[item.name] : item.value
    const value = item.formatter
      ? item.formatter($value, options.optionsForValidatorAndFormatter)
      : $value

    return {
      ...item,
      id: item.id || item.name,
      value,
      required: item.required !== undefined ? item.required : true,
      pristine: true,
      valid: true,
      errorText: '',
    }
  })
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
