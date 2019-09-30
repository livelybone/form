/* eslint-disable no-param-reassign */
import { FormItem } from './type'

export function itemValidate<Item extends FormItem<any, any, any>>(item: Item) {
  item.pristine = false
  item.errorText =
    (item.required !== false || item.value) && item.validator
      ? item.validator(item.value)
      : ''
  item.valid = !item.errorText

  return item.errorText
}

export function init<Items extends FormItem<any, any, any>[]>(
  items: Items,
  initialValues: any,
) {
  const values = initialValues || {}
  return items.map(item => {
    const value =
      values[item.field] !== undefined
        ? item.formatter
          ? item.formatter(initialValues[item.field])
          : initialValues[item.field]
        : item.value
    return {
      ...item,
      id: item.id || item.field,
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
