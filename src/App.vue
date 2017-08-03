<template>
    <div id="app">
        <canvas-player/>
        <control-panel/>
    </div>
</template>

<script>
import ControlPanel from './components/ControlPanel';
import CanvasPlayer from './components/CanvasPlayer';
export default {
    name: 'app',
    components: {
        ControlPanel,
        CanvasPlayer
    }
};
</script>

<style>
html, body {
    margin: 0;
    height: 100%;
}
#app {
    height: 100%;
}
</style>
