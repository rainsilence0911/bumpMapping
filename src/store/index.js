import Vue from 'vue';
import Vuex from 'vuex';

import panelBehavior from './modules/panelBehavior';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        panelBehavior
    },
    strict: debug
});
