const expect = require('chai').expect
const Form = require('../test-lib/index')

describe('FormItemsManagement', () => {
  const items = {
    name: { name: 'nameField', value: '' },
    phone: { name: 'phoneField', value: '' },
  }
  const manager = new Form.FormItemsManager(items)

  it('Create success', () => {
    expect(manager.allItems.name.name).to.equal('nameField')
  })

  it('Set id', () => {
    expect(manager.allItems.name.id).to.equal('name')
  })

  it('Can get item', () => {
    expect(manager.getItem('name').name).to.equal('nameField')
  })

  it('Can get items', () => {
    expect(manager.getItems(['name', 'phone'])[1].name).to.equal('phoneField')
  })
})

describe('Form', () => {
  const items = {
    name: { name: 'nameField', value: '' },
    phone: {
      name: 'phoneField',
      value: '',
      validator: (val) => {
        return /^1\d{10}$/.test(val) ? '' : '格式错误'
      },
    },
    address: { name: 'addressName', value: '' },
  }
  const manager = new Form.FormItemsManager(items)

  console.log(manager)

  const formItems = manager.getItems(['name', 'phone', 'address'])

  const form = new Form.Form(formItems, {
    componentUpdateFn() {
      console.log('component update')
    },
  })

  it('Create success', () => {
    expect(form.pristine).to.equal(true)
    expect(form.valid).to.equal(true)
    expect(form.data.nameField).to.equal('')
    expect(form.data.phoneField).to.equal('')
    expect(form.items[1].name).to.equal('phoneField')
  })

  it('Item change', () => {
    form.itemChange('phoneField', '180')
    expect(form.pristine).to.equal(false)
    expect(form.data.phoneField).to.equal('180')
    expect(form.items[1].pristine).to.equal(false)
    expect(form.items[0].pristine).to.equal(true)
    form.reset()
  })

  it('Items change', () => {
    form.itemsChange({ 'phoneField': '180' })
    expect(form.pristine).to.equal(false)
    expect(form.data.phoneField).to.equal('180')
    expect(form.items[1].pristine).to.equal(false)
    expect(form.items[0].pristine).to.equal(true)
  })

  it('Item validate', () => {
    console.log('phone name validate', form.itemValidate('phoneField'))
    expect(form.getItemByName('phoneField').valid).to.equal(false)
    expect(form.getItemByName('phoneField').errorText).to.equal('格式错误')
  })

  it('Form validate', () => {
    form.itemChange('nameField', 'sdf')
    expect(form.formValidate()).to.equal('格式错误')
    expect(form.valid).to.equal(false)
    expect(form.errorText).to.equal('格式错误')
  })

  it('Form reset', () => {
    form.reset()
    expect(form.valid).to.equal(true)
    expect(form.pristine).to.equal(true)
    expect(form.errorText).to.equal('')
    expect(form.data.phoneField).to.equal('')
    expect(form.getItemByName('phoneField').valid).to.equal(true)
    expect(form.getItemByName('phoneField').pristine).to.equal(true)
    expect(form.getItemByName('phoneField').errorText).to.equal('')
  })

  it('Item reset', () => {
    form.itemChange('phoneField', '180')
    form.resetItem('phoneField')
    expect(form.data.phoneField).to.equal('')
    expect(form.getItemByName('phoneField').valid).to.equal(true)
    expect(form.getItemByName('phoneField').pristine).to.equal(true)
    expect(form.getItemByName('phoneField').errorText).to.equal('')
  })

  it('Item clear validate result', () => {
    form.itemChange('phoneField', '180')
    form.clearValidateResult('phoneField')
    expect(form.getItemByName('phoneField').errorText).to.equal('')
    expect(form.getItemByName('phoneField').valid).to.equal(true)
  })

  it('Update validate result', () => {
    form.updateValidateResult({ nameField: 'name is invalid', addressName: '' })
    expect(form.getItemByName('nameField').errorText).to.equal('name is invalid')
    expect(form.getItemByName('nameField').valid).to.equal(false)
    expect(form.getItemByName('addressName').valid).to.equal(true)
    expect(form.getItemByName('addressName').errorText).to.equal('')
  })
})
