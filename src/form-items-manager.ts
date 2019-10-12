import { FormItem } from './type'
import { formItemsDictionary } from './utils'

export class FormItemsManager<
  FormItems extends { [id: string]: FormItem<any, any, any> }
> {
  private readonly allItems: {
    [id in keyof FormItems]: FormItems[id] & { id: keyof FormItems }
  }

  constructor(formItems: FormItems) {
    this.allItems = formItemsDictionary(formItems)
  }

  getItem<Id extends keyof FormItems>(id: Id): FormItems[Id] & { id: Id } {
    const item = this.allItems[id] as FormItems[Id] & { id: Id }
    if (!item) {
      throw new Error(
        `FormItemsManagement: The form item you search for by id \`${id}\` is not exist, please make sure param id correct`,
      )
    }
    return item
  }

  getItems<Ids extends (keyof FormItems)[]>(ids: Ids) {
    return ids.map(this.getItem.bind(this))
  }
}
