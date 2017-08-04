import Shader from '../gl/Shader';
import Matrix from '../gl/Matrix';
import Texture from '../gl/Texture';

import Timer from '../util/Timer';

import vertShader from '../glsl/bump.vert';
import fragShader from '../glsl/bump.frag';

import normalSamplerPath from '../assets/20_2.gif';
import wallSamplerPath from '../assets/20_1.gif';
import vertData from '../assets/data';

export default class BumpPlayer {
    constructor (canvas, bumpHeight, useBump) {
        this._useBump = false;
        this._bumpHeight = Number(bumpHeight);
        this._useBump = useBump || true;
        this._uniform = {
            uPMatrix: Matrix.perspective(45, canvas.width / canvas.height, 0.1, 100.0)
        };
        this._state = {
            xRot: 0,
            yRot: 0,
            zRot: 0
        };
        this.timer = new Timer(3);
        this.timer.addTask(this.onFrameEnter.bind(this));

        let shader = this._shader = Shader.create(canvas, vertShader, fragShader);
        this.initShader(shader);
    }

    initShader (shader) {
        let mesh = this._mesh = this._shader.createMesh();
        shader.depthTest();

        this.requestVertexData().then((result) => {
            var data = result.data;

            for (var name in data) {
                if (data.hasOwnProperty(name)) {
                    var info = data[name];
                    mesh.addAttributeBuffer(name, info.vertice, info.count);
                }
            }

            mesh.addIndexBuffer(result.indexBuffer);
            this.timer.start();
        });

        Texture.linear(shader.gl, normalSamplerPath, (texture) => {
            this._uniform.uNormalSampler = texture;
            this.timer.start();
        });

        Texture.linear(shader.gl, wallSamplerPath, (texture) => {
            this._uniform.uSampler = texture;
            this.timer.start();
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
        this._useBump = value;
    }

    bumpHeight (value) {
        this._bumpHeight = Number(value);
    }

    onFrameEnter (elapse) {
        this._state.xRot += elapse * 45;
        this._state.yRot += elapse * 45;
        this._state.zRot += elapse * 45;

        var shader = this._shader;
        var state = this._state;
        var uniform = this._uniform;

        var gl = shader.gl;

        shader.viewport();
        shader.clearColor(0.0, 0.0, 0.0, 1.0);
        shader.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var mvMatrix = Matrix.translate(0.0, 0.0, -8.0);

        mvMatrix.rotate(state.xRot, 1, 0, 0);
        mvMatrix.rotate(state.yRot, 0, 1, 0);
        mvMatrix.rotate(state.zRot, 0, 0, 1);

        uniform.uMVMatrix = mvMatrix;
        uniform.uNormalMatrix = Matrix.transpose(Matrix.inverse(Matrix.clone(mvMatrix)));
        uniform.uBumpHeight = this._bumpHeight;
        uniform.bUseBumpMapping = this._useBump;

        shader.uniforms(uniform).draw(this._mesh, gl.TRIANGLES);
    }
};
