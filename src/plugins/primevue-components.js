// src/plugins/primevue-components.js
import DataView from 'primevue/dataview';
import PickList from 'primevue/picklist';
import OrderList from 'primevue/orderlist';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Rating from 'primevue/rating';
import SelectButton from 'primevue/selectbutton';
import DataTable  from 'primevue/datatable';
import Column from 'primevue/column'
import  Tooltip  from 'primevue/tooltip';
import { AutoComplete } from 'primevue';


export default {
    install: (app) => {
        app.component('Column', Column);
        app.component('DataTable', DataTable);
        app.component('DataView', DataView);
        app.component('PickList', PickList);
        app.component('OrderList', OrderList);
        app.component('Button', Button);
        app.component('Tag', Tag);
        app.component('Rating', Rating);
        app.component('SelectButton', SelectButton);
        app.directive('tooltip', Tooltip);
        app.component('AutoComplete',AutoComplete);
    }
}
