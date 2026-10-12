// src/plugins/primevue-components.js
import { AutoComplete } from 'primevue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import KeyFilter from 'primevue/keyfilter'
import OrderList from 'primevue/orderlist'
import Password from 'primevue/password'
import PickList from 'primevue/picklist'
import RadioButton from 'primevue/radiobutton'
import Rating from 'primevue/rating'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Step from 'primevue/step'
import StepList from 'primevue/steplist'
import StepPanel from 'primevue/steppanel'
import StepPanels from 'primevue/steppanels'
import Stepper from 'primevue/stepper'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Tooltip from 'primevue/tooltip'

export default {
  install: (app) => {
    app.component('AutoComplete', AutoComplete)
    app.component('Button', Button)
    app.component('Checkbox', Checkbox)
    app.component('Column', Column)
    app.component('DataTable', DataTable)
    app.component('DataView', DataView)
    app.component('DatePicker', DatePicker)
    app.component('Dialog', Dialog)
    app.component('IconField', IconField)
    app.component('InputIcon', InputIcon)
    app.component('InputNumber', InputNumber)
    app.component('InputText', InputText)
    app.directive('keyfilter', KeyFilter)
    app.component('OrderList', OrderList)
    app.component('Password', Password)
    app.component('PickList', PickList)
    app.component('RadioButton', RadioButton)
    app.component('Rating', Rating)
    app.component('Select', Select)
    app.component('SelectButton', SelectButton)
    app.component('Step', Step)
    app.component('StepList', StepList)
    app.component('StepPanel', StepPanel)
    app.component('StepPanels', StepPanels)
    app.component('Stepper', Stepper)
    app.component('Tag', Tag)
    app.component('Textarea', Textarea)
    app.directive('tooltip', Tooltip)
  },
}