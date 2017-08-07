<template>
    <div class="setting-container">
        <fieldset>
            <legend>Bump Setting</legend>
            <div>
                <input type="checkbox" id="isUseBump" ref="isUseBump" checked @change="onUseBumpChange($event)">
                <label for="isUseBump">use bump mapping</label>
            </div>
            <div class="bump-height-panel" id="bumpHeightPanel">
                <label for="bumpHeight" >bump height:</label>
                <span class="bump-height-span">
                    <input type="range" min="0.3" max="4" step="0.1" id="bumpHeight" ref="bumpHeight"
                        value="1.9" class="bump-height-range" @input="onBumpRangeChange($event)">
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend>Shadow Setting(experimental)</legend>
            <div class="shadow-panel" id="shadowPanel">
                <input type="checkbox" id="isUseShadow" ref="isUseShadow" @change="onUseShadowChange($event)">
                <label for="isUseShadow" >use shadow</label>
            </div>
            <div>
                <label for="shadowPosition" >shadow position:</label>
                <span class="bump-height-span">
                    <input type="range" min="-11" max="11" step="1" id="shadowPosition" ref="shadowPosition"
                        value="0" class="bump-height-range" @input="onShadowPositionChange($event)">
                </span>
            </div>
        </fieldset>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import store from '../store';
export default {
    methods: {
        ...mapActions({
            onUseShadowChange: 'changeUseShadow',
            onUseBumpChange: 'changeUseBump',
            onBumpRangeChange: 'changeBumpHeight',
            onShadowPositionChange: 'changeShadowPosition'
        })
    },

    mounted () {
        let isUseBump = this.$refs.isUseBump.checked;
        let bumpRange = this.$refs.bumpHeight.value;
        store.dispatch('panelReady', {
            useBump: isUseBump,
            bumpHeight: bumpRange
        });
    }
};
</script>
<style scoped>
.setting-container {
    width: 500px;
}

.bump-height-panel {
    line-height: 30px;
}

.bump-height-span {
    display: inline-block;
    position: relative;
}

.bump-height-range {
    display: inline-block;
    position: relative;
    top: 5px;
}
</style>
