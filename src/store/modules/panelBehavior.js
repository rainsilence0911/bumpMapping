
import * as types from '../mutation-types';

const state = {
    useBump: true,
    useShadow: false,
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
    changeUseShadow ({ commit, state }, e) {
        commit(types.CHANGE_USE_SHADOW, (e.target || e.srcElement).checked);
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
    [types.CHANGE_USE_SHADOW] (state, param) {
        state.useShadow = param || false;
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
