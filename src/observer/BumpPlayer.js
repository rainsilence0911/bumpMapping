import Shader from '../gl/Shader';
import Matrix from '../gl/Matrix';
import Texture from '../gl/Texture';

import Timer from '../util/Timer';

import vertShader from '../glsl/bump.vert';
import fragShader from '../glsl/bump.frag';

import shadowVertShader from '../glsl/shadow.vert';
import shadowFragShader from '../glsl/shadow.frag';

import normalSamplerPath from '../assets/20_2.gif';
import wallSamplerPath from '../assets/20_1.gif';
import vertData from '../assets/data';

export default class BumpPlayer {
    constructor (canvas, bumpHeight, useBump) {
        this._state = {
            useBump: useBump || true,
            bumpHeight: Number(bumpHeight),
            rectangle: {
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                uniform: {
                    uPMatrix: Matrix.perspective(45, canvas.width / canvas.height, 0.1, 100.0)
                }
            }
        };
        this.timer = new Timer(3);
        this.timer.addTask(this.onFrameEnter.bind(this));

        let shader = this._shader = Shader.create(canvas, vertShader, fragShader);
        this.initShader(shader);

        this._shadowShader = Shader.create(canvas, shadowVertShader, shadowFragShader);
        var rectangleMesh = this._rectangleMesh = this._shadowShader.createMesh();
        rectangleMesh.addAttributeBuffer('aVertexPosition', [
            -3.0, 0.0, 3.0,
            -3.0, 0.0, -3.0,
            3.0, 0.0, 3.0,
            3.0, 0.0, -3.0
        ], 3);
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
            this._state.rectangle.uniform.uNormalSampler = texture;
            this.timer.start();
        });

        Texture.linear(shader.gl, wallSamplerPath, (texture) => {
            this._state.rectangle.uniform.uSampler = texture;
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
        this._state.useBump = value;
    }

    bumpHeight (value) {
        this._state.bumpHeight = Number(value);
    }

    onFrameEnter (elapse) {
        var state = this._state;
        var rectangle = state.rectangle;
        var rot = rectangle.rotate;
        rot.x += elapse * 45;
        rot.y += elapse * 45;
        rot.z += elapse * 45;

        var shader = this._shader;
        var uniform = rectangle.uniform;

        var gl = shader.gl;

        shader.viewport();
        shader.clearColor(0.0, 0.0, 0.0, 1.0);
        shader.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var mvMatrix = Matrix.translate(0.0, 0.0, -8.0);

        mvMatrix.rotate(rot.x, 1, 0, 0);
        mvMatrix.rotate(rot.y, 0, 1, 0);
        mvMatrix.rotate(rot.z, 0, 0, 1);

        uniform.uMVMatrix = mvMatrix;
        uniform.uNormalMatrix = Matrix.transpose(Matrix.inverse(Matrix.clone(mvMatrix)));
        uniform.uBumpHeight = state.bumpHeight;
        uniform.bUseBumpMapping = state.useBump;

        shader.uniforms(uniform).draw(this._mesh, gl.TRIANGLES);

        this._shadowShader.uniforms({
            uPMatrix: uniform.uPMatrix,
            uMVMatrix: Matrix.translate(0.0, -2.0, -8.0)
        }).draw(this._rectangleMesh, gl.TRIANGLE_STRIP);
    }
};
