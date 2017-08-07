import Shader from '../gl/Shader';
import Matrix from '../gl/Matrix';
import Texture from '../gl/Texture';

import Timer from '../util/Timer';

import bumpVert from '../glsl/bump.vert';
import bumpFrag from '../glsl/bump.frag';

import planeVert from '../glsl/plane.vert';
import planeFrag from '../glsl/plane.frag';

import shadowVert from '../glsl/shadow.vert';
import shadowFrag from '../glsl/shadow.frag';

import normalSamplerPath from '../assets/20_2.gif';
import wallSamplerPath from '../assets/20_1.gif';
import vertData from '../assets/data';

export default class BumpPlayer {
    constructor (canvas, bumpHeight, useBump) {
        var perspectiveMatrix = Matrix.perspective(45, canvas.width / canvas.height, 0.1, 100.0);

        this._state = {
            cameraDistance: -7,
            shadowX: 0,
            useBump: useBump || true,
            useShadow: false,
            bumpHeight: Number(bumpHeight),
            cube: {
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                uniform: {
                    uPMatrix: perspectiveMatrix
                },
                mesh: null
            },
            plane: {
                vertice: [
                    -4.0, 0.0, 4.0,
                    -4.0, 0.0, -4.0,
                    4.0, 0.0, 4.0,
                    4.0, 0.0, -4.0
                ],
                uniform: {
                    uPMatrix: perspectiveMatrix
                },
                mesh: null
            },
            shadow: {
                uniform: {
                    uPMatrix: perspectiveMatrix
                },
                cubeMesh: null,
                planeMesh: null
            }
        };
        this.timer = new Timer(3);
        this.timer.addTask(this.onFrameEnter.bind(this));

        this.requestVertexData().then((result) => {
            this.initCubeShader(canvas, result);
            this.initPlaneShader(canvas);
            this.initShadowShader(canvas, result);
        });
    }

    initCubeShader (canvas, result) {
        let shader = this._cubeShader = Shader.create(canvas, bumpVert, bumpFrag);
        let mesh = this._state.cube.mesh = shader.createMesh();
        shader.depthTest();

        var data = result.data;

        for (var name in data) {
            if (data.hasOwnProperty(name)) {
                var info = data[name];
                mesh.addAttributeBuffer(name, info.vertice, info.count);
            }
        }

        mesh.addIndexBuffer(result.indexBuffer);
        this.timer.start();

        Texture.linear(shader.gl, normalSamplerPath, (texture) => {
            this._state.cube.uniform.uNormalSampler = texture;
            this.timer.start();
        });

        Texture.linear(shader.gl, wallSamplerPath, (texture) => {
            this._state.cube.uniform.uSampler = texture;
            this.timer.start();
        });
    }

    initPlaneShader (canvas) {
        this._planeShader = Shader.create(canvas, planeVert, planeFrag);
        var mesh = this._state.plane.mesh = this._planeShader.createMesh();
        mesh.addAttributeBuffer('aVertexPosition', this._state.plane.vertice, 3);
    }

    initShadowShader (canvas, result) {
        var shader = this._shadowShader = Shader.create(canvas, shadowVert, shadowFrag);
        var shadow = this._state.shadow;

        var cubeMesh = shadow.cubeMesh = shader.createMesh();
        var prop = 'aVertexPosition';
        var data = result.data[prop];
        cubeMesh.addAttributeBuffer(prop, data.vertice, data.count);
        cubeMesh.addIndexBuffer(result.indexBuffer);

        var planeMesh = shadow.planeMesh = shader.createMesh();
        planeMesh.addAttributeBuffer(prop, this._state.plane.vertice, 3);

        var gl = shader.gl;
        this._state.shadow.buffer = shader.createFrameBufferTexture(256, 256, {
            wrapS: gl.CLAMP_TO_EDGE,
            wrapT: gl.CLAMP_TO_EDGE
        });
    }

    // simulate ajax call
    requestVertexData () {
        var p = new Promise((resolve) => {
            resolve(vertData);
        });
        return p;
    }

    useBump (value) {
        this._state.useBump = value;
    }

    useShadow (value) {
        this._state.useShadow = value;
    }

    shadowX (value) {
        this._state.shadowX = value;
    }

    cameraDistance (value) {
        this._state.cameraDistance = value;
    }

    bumpHeight (value) {
        this._state.bumpHeight = Number(value);
    }

    onFrameEnter (elapse) {
        this.doTickAction(elapse);

        this.clearStage();
        this.renderCube();
        this.renderPlane();
    }

    doTickAction (elapse) {
        var state = this._state;
        var cube = state.cube;
        var rot = cube.rotate;
        rot.x += elapse * 45;
        rot.y += elapse * 45;
        rot.z += elapse * 45;
    }

    clearStage () {
        var shader = this._cubeShader;
        var gl = shader.gl;

        shader.viewport();
        shader.clearColor(0.0, 0.0, 0.0, 1.0);
        shader.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    renderCube () {
        var state = this._state;
        var cube = state.cube;
        var rot = cube.rotate;

        var mMatrix = new Matrix();
        mMatrix.rotate(rot.x, 1, 0, 0);
        mMatrix.rotate(rot.y, 0, 1, 0);
        mMatrix.rotate(rot.z, 0, 0, 1);

        var shader = this._cubeShader;
        var gl = shader.gl;

        var uniform = cube.uniform;
        uniform.uVMatrix = Matrix.translate(0.0, 0.0, state.cameraDistance);
        uniform.uMMatrix = mMatrix;
        uniform.uNormalMatrix = Matrix.transpose(Matrix.inverse(Matrix.multiply(uniform.uVMatrix, uniform.uMMatrix)));
        uniform.uBumpHeight = state.bumpHeight;
        uniform.bUseBumpMapping = state.useBump;
        shader.uniforms(uniform).draw(cube.mesh, gl.TRIANGLES);
    }

    renderPlane () {
        var state = this._state;
        if (!state.useShadow) {
            return;
        }

        this.renderShadow();

        var shader = this._planeShader;

        var plane = state.plane;
        var shadow = state.shadow;
        var uniform = plane.uniform;
        var gl = shader.gl;
        shader.viewport();
        uniform.uVMatrix = Matrix.translate(0.0, -2.0, state.cameraDistance);
        uniform.uMMatrix = new Matrix();
        uniform.uViewFromLightMatrix = shadow.uniform.uVMatrix;
        uniform.uShadowMap = shadow.buffer.texture;
        shader.uniforms(uniform).draw(plane.mesh, gl.TRIANGLE_STRIP);
    }

    renderShadow () {
        var shader = this._shadowShader;
        var state = this._state;
        var gl = shader.gl;
        var shadow = state.shadow;
        var uniform = shadow.uniform;

        uniform.uVMatrix = Matrix.lookAt(state.shadowX, 14.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

        shader.drawFrameBuffer(shadow.buffer, (buffer) => {
            shader.viewport(0, 0, buffer.width, buffer.height);
            shader.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            uniform.uMMatrix = state.cube.uniform.uMMatrix;
            shader.uniforms(uniform).draw(shadow.cubeMesh, gl.TRIANGLES);

            uniform.uMMatrix = new Matrix();
            shader.uniforms(uniform).draw(shadow.planeMesh, gl.TRIANGLE_STRIP);
        });

        return shadow.buffer;
    }
};
