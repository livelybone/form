/* eslint-disable no-param-reassign */
import { FormItem } from './type'

export function itemValidate<Item extends FormItem<any, any>>(
  item: Item,
  context: any,
) {
  item.pristine = false
  item.errorText = item.validator ? item.validator(item.value) : ''
  item.valid = !item.errorText

  context.valid = !item.valid ? false : context.valid
  context.pristine = false
  if (item.valid) context.data[item.field] = item.value

  return item.errorText
}
