<template>
    <div>
        <div>
            <input type="checkbox" id="isUseBump" ref="isUseBump" checked @change="onUseBumpChange($event)">
            <label for="isUseBump">Use bump mapping</label>
        </div>
        <div class="bump-height-panel" id="bumpHeightPanel">
            <label for="bumpHeight" >Bump Height:</label>
            <span class="bump-height-span">
                <input type="range" min="0.3" max="4" step="0.1" id="bumpHeight" ref="bumpHeight"
                    value="1.9" class="bump-height-range" @input="onBumpRangeChange($event)">
            </span>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import store from '../store';
export default {
    methods: {
        ...mapActions({
            onUseBumpChange: 'changeUseBump',
            onBumpRangeChange: 'changeBumpHeight'
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
