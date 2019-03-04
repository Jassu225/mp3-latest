import Vue from 'vue';
import VueRouter from 'vue-router';

// components
import fileUpload from '../components/fileUpload.vue';

import urls from './urls';

Vue.use(VueRouter);

const routes = [
    { path: urls.FILE_UPLOAD, components: {fileUpload} },
    // { path: urls.UPLOAD_PROGRESS, components: { uploadProgress} }
];

const router = new VueRouter({
    mode: "history",
    routes // short for `routes: routes`
});

export default router;