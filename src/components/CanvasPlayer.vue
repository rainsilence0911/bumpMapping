<template>
    <div>
        <canvas ref="player" class="webgl-player" width="500" height="500"></canvas>
    </div>
</template>
<script>
import store from '../store';
import * as types from '../store/mutation-types';
import BumpPlayer from '../observer/BumpPlayer';
export default {
    mounted () {
        store.subscribe((mutation, state) => {
            var payload = mutation.payload;
            if (mutation.type === types.PANEL_READY) {
                this._player = new BumpPlayer(this.$refs.player, payload.bumpHeight, payload.useBump);
            } else if (mutation.type === types.CHANGE_USE_BUMP) {
                this._player.useBump(payload);
            } else if (mutation.type === types.CHANGE_BUMP_HEIGHT) {
                this._player.bumpHeight(payload);
            } else if (mutation.type === types.CHANGE_USE_SHADOW) {
                this._player.useShadow(payload);
            }
        });
    }
};
</script>
<style scoped>
.webgl-player {
    border: none;
}
</style>
