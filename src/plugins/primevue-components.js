// src/plugins/primevue-components.js
import DataView from 'primevue/dataview'
import PickList from 'primevue/picklist'
import OrderList from 'primevue/orderlist'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Rating from 'primevue/rating'
import SelectButton from 'primevue/selectbutton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tooltip from 'primevue/tooltip'
import { AutoComplete } from 'primevue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'

export default {
  install: (app) => {
    app.component('Column', Column)
    app.component('DataTable', DataTable)
    app.component('DataView', DataView)
    app.component('PickList', PickList)
    app.component('OrderList', OrderList)
    app.component('Button', Button)
    app.component('Tag', Tag)
    app.component('Rating', Rating)
    app.component('SelectButton', SelectButton)
    app.directive('tooltip', Tooltip)
    app.component('AutoComplete', AutoComplete)
    app.component('Dialog', Dialog)
    app.component('InputText', InputText)
    app.component('Select', Select)
    app.component('DatePicker', DatePicker)
    app.component('IconField', IconField)
    app.component('InputIcon', InputIcon)
    app.component('Stepper', Stepper)
    app.component('StepList', StepList)
    app.component('StepPanels', StepPanels)
    app.component('Step', Step)
    app.component('StepPanel', StepPanel)
    app.component('RadioButton', RadioButton)
    app.component('Checkbox', Checkbox)
  },
}
