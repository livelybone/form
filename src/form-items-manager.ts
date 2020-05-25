import {
  IsTuple,
  TupleMap,
  TupleToUnion,
  UnionToTupleWithMap,
} from 'union-tuple'
import { FormItem } from './type'
import { formItemsDictionary } from './utils'

type InfiniteItems<
  FormItems extends { [id: string]: FormItem<any, any, any> },
  Ids extends any[]
> = {
  [id in TupleToUnion<Ids>]: FormItemsManager<FormItems>['allItems'][id]
}[TupleToUnion<Ids>][]

type GetFormItems<
  FormItems extends { [id: string]: FormItem<any, any, any> },
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

export class FormItemsManager<
  FormItems extends { [id: string]: FormItem<any, any, any> }
> {
  readonly allItems: {
    [id in Exclude<keyof FormItems, symbol>]: FormItems[id] &
      FormItem<FormItems[id]['value'], FormItems[id]['name'], id>
  }

  constructor(formItems: FormItems) {
    this.allItems = formItemsDictionary(formItems)
  }

  getItem<Id extends keyof FormItemsManager<FormItems>['allItems']>(
    id: Id,
  ): FormItemsManager<FormItems>['allItems'][Id] {
    const item = { ...this.allItems[id] }
    if (!item) {
      throw new Error(
        `The form item you search for by id \`${id}\` is not exist, please make sure param id correct`,
      )
    }
    return item
  }

  getItems<Ids extends (keyof FormItemsManager<FormItems>['allItems'])[]>(
    ids: Ids,
  ): GetFormItems<FormItems, Ids> {
    return ids.map(this.getItem.bind(this)) as any
  }
}
