const expect = require('chai').expect
const Form = require('../test-lib/index')

describe('FormItemsManagement', () => {
  const items = {
    name: { field: 'nameField', value: '' },
    phone: { field: 'phoneField', value: '' },
  }
  const manager = new Form.FormItemsManager(items)

  it('Create success', () => {
    expect(manager.allItems.name.field).to.equal('nameField')
  })

  it('Set id', () => {
    expect(manager.allItems.name.id).to.equal('name')
  })

  it('Can get item', () => {
    expect(manager.getItem('name').field).to.equal('nameField')
  })

  it('Can get items', () => {
    expect(manager.getItems(['name', 'phone'])[1].field).to.equal('phoneField')
  })
})

describe('Form', () => {
  const items = {
    name: { field: 'nameField', value: '' },
    phone: {
      field: 'phoneField',
      value: '',
      validator: (val) => {
        return /^1\d{10}$/.test(val) ? '' : '格式错误'
      },
    },
    address: { field: 'addressField', value: '' },
  }
  const manager = new Form.FormItemsManager(items)

  const formItems = manager.getItems(['name', 'phone'])

  const form = new Form.Form(formItems)

  it('Create success', () => {
    expect(form.pristine).to.equal(true)
    expect(form.valid).to.equal(true)
    expect(form.data.nameField).to.equal('')
    expect(form.data.phoneField).to.equal('')
    expect(form.items[1].field).to.equal('phoneField')
  })

  it('Item change', () => {
    form.itemChange('phoneField', '180')
    expect(form.pristine).to.equal(false)
    expect(form.data.phoneField).to.equal('180')
    expect(form.items[1].pristine).to.equal(false)
    expect(form.items[0].pristine).to.equal(true)
  })

  it('Item validate', () => {
    console.log('phone field validate', form.itemValidate('phoneField'))
    expect(form.getItem('phoneField').valid).to.equal(false)
    expect(form.getItem('phoneField').errorText).to.equal('格式错误')
    expect(form.valid).to.equal(false)
    expect(form.errorText).to.equal('')
  })

  it('Form validate', () => {
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
    expect(form.getItem('phoneField').valid).to.equal(true)
    expect(form.getItem('phoneField').pristine).to.equal(true)
    expect(form.getItem('phoneField').errorText).to.equal('')
  })

  it('Item reset', () => {
    form.itemChange('phoneField', '180')
    form.resetItem('phoneField')
    expect(form.data.phoneField).to.equal('')
    expect(form.getItem('phoneField').valid).to.equal(true)
    expect(form.getItem('phoneField').pristine).to.equal(true)
    expect(form.getItem('phoneField').errorText).to.equal('')
  })

  it('Item clear validate result', () => {
    form.itemChange('phoneField', '180')
    form.clearValidateResult('phoneField')
    expect(form.getItem('phoneField').errorText).to.equal('')
    expect(form.getItem('phoneField').valid).to.equal(true)
  })
})
