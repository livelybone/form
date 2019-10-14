import { FormItem, TupleUnion } from './type'
import { formItemsDictionary } from './utils'

export class FormItemsManager<
  FormItems extends { [id: string]: FormItem<any, any, any> }
> {
  private readonly allItems: {
    [id in keyof FormItems]: FormItems[id] & { id: id }
  }

  constructor(formItems: FormItems) {
    this.allItems = formItemsDictionary(formItems)
  }

  getItem<Id extends keyof FormItems>(id: Id) {
    const item = this.allItems[id]
    if (!item) {
      throw new Error(
        `FormItemsManagement: The form item you search for by id \`${id}\` is not exist, please make sure param id correct`,
      )
    }
    return item
  }

  getItems<Ids extends (keyof FormItems)[]>(ids: Ids) {
    return ids.map(this.getItem.bind(this)) as {
      [id in TupleUnion<Ids>]: FormItems[id] & {
        id: id
      }
    }[TupleUnion<Ids>][]
  }
}
