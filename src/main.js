import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import store from './store';
import router from './router';
import { fileSystem as fs, path } from './assets/js/commonFunctionalities';

// require("@babel/polyfill");

Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css';
import './assets/css/MaterialIcons.css';
import './assets/css/MontserratFont.css';
import './assets/css/generic.css';



let importThemeAndStartVue = async function() {
    // import theme
    //let theme = (await fs.readFileAsync(path.join(__dirname, './assets/themes/theme-dark.json'), 'utf-8'));
    console.log(__filename);


    new Vue({
        el: '#app',
        store,
        router,
        render: h => h(App)
    });
}

importThemeAndStartVue();
