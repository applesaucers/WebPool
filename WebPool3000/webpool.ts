/// <reference path="./cannon.d.ts" />
/// <amd-dependency path="cannon" />
/// <reference path="./cannon.demo.d.ts" />

/// <reference path="./libs/three-canvasrenderer.d.ts" />
/// <amd-dependency path="three" />

document.addEventListener('DOMContentLoaded',
    initSimulation
//initDebug
    );

function initSimulation() {
    initThree();
    initCannon();
    initWebGl();
    domSetup();
}

interface glShapeData {
    position: glBufferData;
    color: glBufferData
}

interface glCubeData extends glShapeData { index: glBufferData }

interface glBufferData {
    buffer: WebGLBuffer;
    size: number;
    count: number;
}

var context: WebGLRenderingContext, pyramid: glShapeData, cube: glCubeData, perspective: Float32Array, binder: Float32Array[], lastTime: number,
    shader: { program: WebGLShader; perspective: WebGLUniformLocation; binder: WebGLUniformLocation; position: number; color: number },
    glViewport: { width: number; height: number }, rotation: { pyramid: number; cube: number };

lastTime = 0;
perspective = mat4.create();
binder = [mat4.create()];
rotation = {
    pyramid: 0,
    cube: 0
}

function initWebGl() {
    setupGL();
    setupShaders();
    setupBuffers();

    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.enable(context.DEPTH_TEST);

    tick();
}
function tick() {
    requestAnimationFrame(tick);

    drawScene();
    animateScene();
}

function setupGL() {
    try {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("height", "500");
        canvas.setAttribute("width", "500");

        context = canvas.getContext("webgl");
        glViewport = {
            width: canvas.width,
            height: canvas.height
        };
        document.body.appendChild(canvas);
    } catch (e) {
    }
    if (!context) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function setupShaders() {
    var shaderProgram: WebGLProgram,
        fragmentShader = getShader(context, "shader-fs"),
        vertexShader = getShader(context, "shader-vs");
        

    shaderProgram = context.createProgram();
    context.attachShader(shaderProgram, vertexShader);
    context.attachShader(shaderProgram, fragmentShader);
    context.linkProgram(shaderProgram);

    shader = {
        program: shaderProgram,
        perspective: context.getUniformLocation(shaderProgram, "uPerspective"),
        binder: context.getUniformLocation(shaderProgram, "uBinder"),
        color: context.getAttribLocation(shaderProgram, "aColor"),
        position: context.getAttribLocation(shaderProgram, "aPosition")
    }

    if (!context.getProgramParameter(shader.program, context.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }


    context.useProgram(shaderProgram);
    context.enableVertexAttribArray(shader.color);
    context.enableVertexAttribArray(shader.position);
}

function setupBuffers() {
    pyramid = {
        position: {
            buffer: context.createBuffer(),
            size: 3,
            count: 12
        },
        color: {
            buffer: context.createBuffer(),
            size: 4,
            count: 12
        }
    };

    context.bindBuffer(context.ARRAY_BUFFER, pyramid.position.buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([
        // Front face
        0.0, 1.0, 0.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        // Right face
        0.0, 1.0, 0.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        // Back face
        0.0, 1.0, 0.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        // Left face
        0.0, 1.0, 0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0
    ]), context.STATIC_DRAW);

    context.bindBuffer(context.ARRAY_BUFFER, pyramid.color.buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([
        // Front face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        // Right face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        // Back face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        // Left face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ]), context.STATIC_DRAW);

    cube = {
        position: {
            buffer: context.createBuffer(),
            size: 3,
            count: 24
        },
        color: {
            buffer: context.createBuffer(),
            size: 4,
            count: 24
        },
        index: {
            buffer: context.createBuffer(),
            size: 1,
            count: 36
        }
    };

    context.bindBuffer(context.ARRAY_BUFFER, cube.position.buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ]), context.STATIC_DRAW);

    context.bindBuffer(context.ARRAY_BUFFER, cube.color.buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([
        // Front face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        // Back face
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        // Top face
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        // Bottom face
        1.0, 0.5, 0.5, 1.0,
        1.0, 0.5, 0.5, 1.0,
        1.0, 0.5, 0.5, 1.0,
        1.0, 0.5, 0.5, 1.0,
        // Right face
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        // Left face
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ]), context.STATIC_DRAW);


    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, cube.index.buffer);
    context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array([
        0, 1, 2, 0, 2, 3,    // Front face
        4, 5, 6, 4, 6, 7,    // Back face
        8, 9, 10, 8, 10, 11,  // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23  // Left face
    ]), context.STATIC_DRAW);
}

function drawScene() {
    context.viewport(0, 0, glViewport.width, glViewport.height);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    mat4.perspective(perspective, 45, glViewport.width / glViewport.height, 0.1, 100.0);
    mat4.identity(binder[0]);
    mat4.translate(binder[0], binder[0], [-1.5, 0.0, -7.0]);

    binderPush();
    mat4.rotate(binder[0], binder[0], degToRad(rotation.pyramid), [1, 1, 1]);

    context.bindBuffer(context.ARRAY_BUFFER, pyramid.position.buffer);
    context.vertexAttribPointer(shader.position, pyramid.position.size, context.FLOAT, false, 0, 0);

    context.bindBuffer(context.ARRAY_BUFFER, pyramid.color.buffer);
    context.vertexAttribPointer(shader.color, pyramid.color.size, context.FLOAT, false, 0, 0);

    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, pyramid.position.count);

    binderPop();
    binderPush();

    mat4.translate(binder[0], binder[0], [3.0, 0.0, 0.0]);
    mat4.rotate(binder[0], binder[0], degToRad(rotation.cube), [1, 0, 0]);

    context.bindBuffer(context.ARRAY_BUFFER, cube.position.buffer);
    context.vertexAttribPointer(shader.position, cube.position.size, context.FLOAT, false, 0, 0);

    context.bindBuffer(context.ARRAY_BUFFER, cube.color.buffer);
    context.vertexAttribPointer(shader.color, cube.color.size, context.FLOAT, false, 0, 0);

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, cube.index.buffer);
    setMatrixUniforms();
    context.drawElements(context.TRIANGLES, cube.index.count, context.UNSIGNED_SHORT, 0);

    binderPop();
}

function animateScene() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        rotation.pyramid += (90 * elapsed) / 1000.0;
        rotation.cube += (75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

function getShader(context: WebGLRenderingContext, id:string) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            str += k.textContent;
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.getAttribute("type") == "x-shader/x-fragment") {
        shader = context.createShader(context.FRAGMENT_SHADER);
    } else if (shaderScript.getAttribute("type") == "x-shader/x-vertex") {
        shader = context.createShader(context.VERTEX_SHADER);
    } else {
        return null;
    }

    context.shaderSource(shader, str);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        alert(context.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function binderPush() {
    binder.unshift(mat4.clone(binder[0]));
}

function binderPop() {
    if (binder.length == 0) {
        throw "Invalid popMatrix!";
    }
    binder.shift();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function setMatrixUniforms() {
    context.uniformMatrix4fv(shader.perspective, false, perspective);
    context.uniformMatrix4fv(shader.binder, false, binder[0]);
}

//non opengl

var world: CANNON.World, tableBody: CANNON.Body, timeStep = 1 / 60, poolBallBodies = new Array<CANNON.Body>(15), cueBallBody: CANNON.Body, debug: CANNON.Demo,
    scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer, table3d: THREE.Object3D, poolBallMeshes = new Array<THREE.Mesh>(15), cueBallMesh: THREE.Mesh;

var ballDiameter = 0.054;
var ballMass = 0.17;
var pocketDiameter = ballDiameter * 1.6;
var tableHeight = 0.8;
var fieldWidth = 1.93;
var fieldLength = 0.965;
var fieldThickness = 0.0254;


var sideHeight = ballDiameter + fieldThickness;
var tableBaseSize = new CANNON.Vec3(fieldWidth, fieldThickness, fieldLength);
var tableLegSize = new CANNON.Vec3(ballDiameter, tableHeight, ballDiameter);

var tableWidthBumperSize = new CANNON.Vec3(fieldWidth / 2 - pocketDiameter, sideHeight, pocketDiameter);
var tableLengthBumperSize = new CANNON.Vec3(pocketDiameter, sideHeight, fieldLength - pocketDiameter * 1.5);

var tableWidthSideSize = new CANNON.Vec3(fieldWidth + pocketDiameter * 2, sideHeight, pocketDiameter);
var tableLengthSideSize = new CANNON.Vec3(pocketDiameter, sideHeight, fieldLength + pocketDiameter * 4);


var tableBasePos = new CANNON.Vec3(0, -ballDiameter - fieldThickness, 0);

var tableLegDistX = fieldWidth * 7 / 8;
var tableLegDistY = tableHeight + fieldThickness * 2 + ballDiameter;
var tableLegDistZ = fieldLength * 7 / 8;
var tableLegPos = [
    new CANNON.Vec3(-tableLegDistX, -tableLegDistY, tableLegDistZ),
    new CANNON.Vec3(tableLegDistX, -tableLegDistY, tableLegDistZ),
    new CANNON.Vec3(-tableLegDistX, -tableLegDistY, -tableLegDistZ),
    new CANNON.Vec3(tableLegDistX, -tableLegDistY, -tableLegDistZ)
];

var tableWidthBumperX = fieldWidth / 2;
var tableWidthBumperZ = fieldLength + pocketDiameter;
var tableWidthBumperPos = [
    new CANNON.Vec3(-tableWidthBumperX, 0, tableWidthBumperZ),
    new CANNON.Vec3(tableWidthBumperX, 0, tableWidthBumperZ),
    new CANNON.Vec3(-tableWidthBumperX, 0, -tableWidthBumperZ),
    new CANNON.Vec3(tableWidthBumperX, 0, -tableWidthBumperZ)
];
var tableLengthBumperX = fieldWidth + pocketDiameter;
var tableLengthBumperPos = [
    new CANNON.Vec3(-tableLengthBumperX, 0, 0),
    new CANNON.Vec3(tableLengthBumperX, 0, 0)
];

var tableWidthSideZ = fieldLength + pocketDiameter * 3;
var tableWidthSidePos = [
    new CANNON.Vec3(0, 0, -tableWidthSideZ),
    new CANNON.Vec3(0, 0, tableWidthSideZ)
];
var tableLengthSideX = fieldWidth + pocketDiameter * 3;
var tableLengthSidePos = [
    new CANNON.Vec3(-tableLengthSideX, 0, 0),
    new CANNON.Vec3(tableLengthSideX, 0, 0)
];
function initDebug() {
    document.body.innerHTML = '';
    debug = new CANNON.Demo();
    debug.addScene('pool', () => {
        world = debug.getWorld();
        initCannon();
        debug.addVisual(tableBody);
        debug.addVisual(cueBallBody);
        debug.addVisuals(poolBallBodies);
    });

    debug.start();
}
function initCannon() {
    world = world || new CANNON.World();
    world.gravity.set(0, -10, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.allowSleep = false;

    var felt = new CANNON.Material("felt");
    var plastic = new CANNON.Material("plastic");

    world.addContactMaterial(new CANNON.ContactMaterial(felt, plastic, {
        friction: 0.2,
        restitution: 0.6
    }));
    world.addContactMaterial(new CANNON.ContactMaterial(plastic, plastic, {
        friction: 0.08,
        restitution: 0.93
    }));

    tableBody = new CANNON.Body({
        mass: 0,
        material: felt,
        type: CANNON.Body.KINEMATIC,
        position: new CANNON.Vec3(0, 0, 0)
    });

    tableBody.addShape(new CANNON.Box(tableBaseSize), tableBasePos);

    for (var count = 0; count < tableLengthBumperPos.length; count += 1) {
        tableBody.addShape(new CANNON.Box(tableLengthBumperSize), tableLengthBumperPos[count]);
    }
    for (var count = 0; count < tableWidthBumperPos.length; count += 1) {
        tableBody.addShape(new CANNON.Box(tableWidthBumperSize), tableWidthBumperPos[count]);
    }
    for (var count = 0; count < tableLengthSidePos.length; count += 1) {
        tableBody.addShape(new CANNON.Box(tableLengthSideSize), tableLengthSidePos[count]);
    }
    for (var count = 0; count < tableWidthSidePos.length; count += 1) {
        tableBody.addShape(new CANNON.Box(tableWidthSideSize), tableWidthSidePos[count]);
    }

    world.addBody(tableBody);

    var ball = new CANNON.Sphere(ballDiameter);

    cueBallBody = new CANNON.Body({
        mass: ballMass,
        material: plastic,
        linearDamping: 0
    });
    cueBallBody.addShape(ball);
    world.addBody(cueBallBody);
    for (var count = 0; count < poolBallBodies.length; count += 1) {
        poolBallBodies[count] = new CANNON.Body({
            mass: ballMass,
            material: plastic,
            linearDamping: 0
        });
        poolBallBodies[count].addShape(ball);
        world.addBody(poolBallBodies[count]);
    }
    initPositions();
}

function initPositions() {
    cueBallBody.position.set(fieldWidth / 4, 0, 0);
    cueBallBody.velocity.set(0, 0, 0);
    cueBallBody.angularVelocity.set(0, 0, 0);

    var rowCount = 1,
        nextRowTotal = 1;
    for (var count = 0; count < poolBallBodies.length; count += 1) {
        if (count >= nextRowTotal) {
            rowCount += 1;
            nextRowTotal += rowCount;
        }
        poolBallBodies[count].position.set(-fieldWidth / 4 - rowCount * ballDiameter * Math.SQRT2 * 2, 0, rowCount * ballDiameter / 2 * 2 - (nextRowTotal - count) * ballDiameter * 2);
        poolBallBodies[count].velocity.set(0, 0, 0);
        poolBallBodies[count].angularVelocity.set(0, 0, 0);
    }
}

function makeMesh(size: CANNON.Vec3, material: THREE.Material, position: CANNON.Vec3): THREE.Mesh {
    var box = new THREE.BoxGeometry(size.x, size.y, size.z);
    var boxMesh = new THREE.Mesh(box, material);
    boxMesh.position.set(position.x / 2, -position.y / 2, position.z / 2);
    return boxMesh;
}

function setPosition(obj3d: THREE.Object3D, body: CANNON.Body) {
    var position = body.position;
    var quaternion = body.quaternion;
    obj3d.position.set(position.x / 2, position.y / 2, position.z / 2);
    obj3d.quaternion.set(quaternion.w, quaternion.x, quaternion.y, quaternion.z);
}

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 1, 3);
    camera.position.set(0, 1, 2);
    camera.quaternion.setFromEuler(new THREE.Euler(degToRad(-35), 0, 0, 'YXZ'));
    scene.add(camera);

    var wood = new THREE.MeshBasicMaterial({ color: 0x996600 });
    var field = new THREE.MeshBasicMaterial({ color: 0x009933 });
    var bumper = new THREE.MeshBasicMaterial({ color: 0x330099 });

    table3d = new THREE.Object3D();
    table3d.add(makeMesh(tableBaseSize, field, tableBasePos));

    for (var count = 0; count < tableLegPos.length; count += 1) {
        table3d.add(makeMesh(tableLegSize, wood, tableLegPos[count]));
    }
    for (var count = 0; count < tableLengthBumperPos.length; count += 1) {
        table3d.add(makeMesh(tableLengthBumperSize, bumper, tableLengthBumperPos[count]));
    }
    for (var count = 0; count < tableWidthBumperPos.length; count += 1) {
        table3d.add(makeMesh(tableWidthBumperSize, bumper, tableWidthBumperPos[count]));
    }
    for (var count = 0; count < tableLengthSidePos.length; count += 1) {
        table3d.add(makeMesh(tableLengthSideSize, wood, tableLengthSidePos[count]));
    }
    for (var count = 0; count < tableWidthSidePos.length; count += 1) {
        table3d.add(makeMesh(tableWidthSideSize, wood, tableWidthSidePos[count]));
    }

    scene.add(table3d);

    var ballShape = new THREE.SphereGeometry(ballDiameter / 2, 8, 8);
    cueBallMesh = new THREE.Mesh(ballShape, new THREE.MeshBasicMaterial({ color: 0xCCCCCC }))
    scene.add(cueBallMesh);
    for (var count = 0; count < poolBallMeshes.length; count += 1) {
        poolBallMeshes[count] = new THREE.Mesh(ballShape, new THREE.MeshBasicMaterial({ color: 0x990099 }))
        scene.add(poolBallMeshes[count]);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(800, 800);

}

function domSetup() {
    (<HTMLInputElement>document.getElementById('orientationX')).value = "-35";
    (<HTMLInputElement>document.getElementById('orientationY')).value = "0";
    (<HTMLInputElement>document.getElementById('orientationZ')).value = "0";
    (<HTMLInputElement>document.getElementById('positionX')).value = "0";
    (<HTMLInputElement>document.getElementById('positionY')).value = "1";
    (<HTMLInputElement>document.getElementById('positionZ')).value = "2";
    (<HTMLInputElement>document.getElementById('angle')).value = "180";
    (<HTMLInputElement>document.getElementById('power')).value = "120";


    document.getElementById('camera').addEventListener('click', (event) => {
        var orientationX = degToRad(parseFloat((<HTMLInputElement>document.getElementById('orientationX')).value)),
            orientationY = degToRad(parseFloat((<HTMLInputElement>document.getElementById('orientationY')).value)),
                orientationZ = degToRad(parseFloat((<HTMLInputElement>document.getElementById('orientationZ')).value)),
            positionX = parseFloat((<HTMLInputElement>document.getElementById('positionX')).value),
            positionY = parseFloat((<HTMLInputElement>document.getElementById('positionY')).value),
            positionZ = parseFloat((<HTMLInputElement>document.getElementById('positionZ')).value);

        camera.setRotationFromEuler(new THREE.Euler(orientationX, orientationY, orientationZ, 'YXZ'));
        camera.position.set(positionX, positionY, positionZ);
    });


    document.getElementById('force').addEventListener('click', (event) => {
        var angle = degToRad(parseFloat((<HTMLInputElement>document.getElementById('angle')).value)),
            power = parseFloat((<HTMLInputElement>document.getElementById('power')).value),
            force = new CANNON.Vec3(Math.cos(angle) * power, 0, Math.sin(angle) * power),
            worldPoint = force.unit().mult(-ballDiameter / 2);

        cueBallBody.applyForce(force, worldPoint);
    });

    document.getElementById('reset').addEventListener('click',(event) => {
        initPositions();
    });

    document.body.appendChild(renderer.domElement);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updatePhysics();
    render();
}

function updatePhysics() {
    // Step the physics world
    world.step(timeStep);
    // Copy coordinates from Cannon.js to Three.js
    setPosition(table3d, tableBody);
    setPosition(cueBallMesh, cueBallBody);
    for (var count = 0; count < poolBallBodies.length; count += 1) {
        setPosition(poolBallMeshes[count], poolBallBodies[count]);
    }
}
function render() {
    renderer.render(scene, camera);
}
