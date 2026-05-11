// src/plugins/primevue-components.js
import DataView from 'primevue/dataview';
import PickList from 'primevue/picklist';
import OrderList from 'primevue/orderlist';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Rating from 'primevue/rating';
import SelectButton from 'primevue/selectbutton';
// Añade aquí cualquier otro que uses de Sakai...

export default {
    install: (app) => {
        app.component('DataView', DataView);
        app.component('PickList', PickList);
        app.component('OrderList', OrderList);
        app.component('Button', Button);
        app.component('Tag', Tag);
        app.component('Rating', Rating);
        app.component('SelectButton', SelectButton);
    }
}
