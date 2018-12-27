import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import store from './store';
import router from './router';

// require("@babel/polyfill");

Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css';
import './assets/css/MaterialIcons.css';

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});
