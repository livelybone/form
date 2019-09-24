/* eslint-disable no-param-reassign */
import { FormItem } from './type'

export function itemValidate<Item extends FormItem<any, any>>(
  context: any,
  item: Item,
) {
  item.pristine = false
  item.errorText = item.validator ? item.validator(item.value) : ''
  item.valid = !item.errorText

  context.data[item.field] = item.value
  context.valid = !item.valid ? false : context.valid
  context.pristine = false

  return item.errorText
}

export function init<Items extends FormItem<any, any>[]>(
  context: any,
  items: Items,
  initialValues: any,
) {
  context.pristine = true
  context.valid = true
  context.errorText = ''

  const values = initialValues || {}
  context.items = items.map(item => {
    const value =
      values[item.field] !== undefined
        ? item.formatter
          ? item.formatter(initialValues[item.field])
          : initialValues[item.field]
        : item.value
    context.data[item.field] = value
    return {
      ...item,
      id: item.id || item.field,
      value,
      pristine: true,
      valid: true,
      errorText: '',
    }
  })
}

export function clearValidateRes<Item extends FormItem<any, any>>(item: Item) {
  item.valid = true
  item.errorText = ''
}

export function formItemsDictionary<
  FormItems extends { [id: string]: FormItem<any, any> }
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
