
import * as types from '../mutation-types';

const state = {
    useBump: true,
    bumpHeight: 0
};

const getters = {
    useBump: state => state.useBump
};

const actions = {
    changeUseBump ({ commit, state }, e) {
        commit(types.CHANGE_USE_BUMP, (e.target || e.srcElement).checked);
    },
    changeBumpHeight ({ commit, state }, e) {
        commit(types.CHANGE_BUMP_HEIGHT, (e.target || e.srcElement).value);
    },
    panelReady ({ commit, state }, data) {
        commit(types.PANEL_READY, data);
    }
};

const mutations = {
    [types.CHANGE_USE_BUMP] (state, param) {
        state.useBump = param || false;
    },
    [types.CHANGE_BUMP_HEIGHT] (state, param) {
        state.bumpHeight = param;
    },
    [types.PANEL_READY] (state, param) {
        state.useBump = param.useBump;
        state.bumpHeight = param.bumpHeight;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
