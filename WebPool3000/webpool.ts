/// <reference path="./cannon.d.ts" />
/// <amd-dependency path="cannon" />
/// <reference path="./cannon.demo.d.ts" />

/// <reference path="./libs/three-canvasrenderer.d.ts" />
/// <amd-dependency path="three" />

var world:CANNON.World, tableBody:CANNON.Body, timeStep = 1 / 60, poolBallBodies = new Array<CANNON.Body>(15), cueBallBody:CANNON.Body, demo:CANNON.Demo,
    scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer, table3d: THREE.Object3D, poolBallMeshes = new Array<THREE.Mesh>(15), cueBallMesh: THREE.Mesh;

var ballDiameter = 0.054;
var ballMass = 0.17;
var pocketDiameter = ballDiameter * 1.6;
var tableHeight = 0.8;
var fieldWidth = 1.93;
var fieldLength = 0.965;
var fieldThickness = 0.0254;


var sideHeight = ballDiameter + fieldThickness;
var tableBaseSize = new CANNON.Vec3(        fieldWidth,                      fieldThickness, fieldLength);
var tableLegSize = new CANNON.Vec3(         ballDiameter,                    tableHeight,    ballDiameter);

var tableWidthBumperSize = new CANNON.Vec3( fieldWidth / 2 - pocketDiameter, sideHeight,     pocketDiameter);
var tableLengthBumperSize = new CANNON.Vec3(pocketDiameter,                  sideHeight,     fieldLength - pocketDiameter * 1.5);

var tableWidthSideSize = new CANNON.Vec3(   fieldWidth + pocketDiameter * 2, sideHeight,     pocketDiameter);
var tableLengthSideSize = new CANNON.Vec3(  pocketDiameter,                  sideHeight,     fieldLength + pocketDiameter * 4);


var tableBasePos = new CANNON.Vec3(0, -ballDiameter-fieldThickness, 0);

var tableLegDistX = fieldWidth*7/8;
var tableLegDistY = tableHeight + fieldThickness*2 + ballDiameter;
var tableLegDistZ = fieldLength*7/8;
var tableLegPos = [
    new CANNON.Vec3(-tableLegDistX, -tableLegDistY, tableLegDistZ),
    new CANNON.Vec3(tableLegDistX, -tableLegDistY, tableLegDistZ),
    new CANNON.Vec3(-tableLegDistX, -tableLegDistY, -tableLegDistZ),
    new CANNON.Vec3(tableLegDistX, -tableLegDistY, -tableLegDistZ)
];

var tableWidthBumperX = fieldWidth/2;
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

var tableWidthSideZ = fieldLength + pocketDiameter*3;
var tableWidthSidePos = [
    new CANNON.Vec3(0, 0, -tableWidthSideZ),
    new CANNON.Vec3(0, 0, tableWidthSideZ)
];
var tableLengthSideX = fieldWidth + pocketDiameter*3;
var tableLengthSidePos = [
    new CANNON.Vec3(-tableLengthSideX, 0, 0),
    new CANNON.Vec3(tableLengthSideX, 0, 0)
];

document.addEventListener('DOMContentLoaded',
    initSim
    //initDemo
);

function initSim() {
    initThree();
    initCannon();
    domSetup();
}
function initDemo() {
    document.body.innerHTML = '';
    demo = new CANNON.Demo();
    demo.addScene('pool', () => {
        world = demo.getWorld();
        initCannon();
        demo.addVisual(tableBody);
        demo.addVisual(cueBallBody);
        demo.addVisuals(poolBallBodies);
    });

    demo.start();
}
function initCannon() {
    world = world || new CANNON.World();
    world.gravity.set(0, -1, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    tableBody = new CANNON.Body({
        mass: 0,
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
        position: new CANNON.Vec3(0, 1, 0.05)
    });
    cueBallBody.addShape(ball);
    world.addBody(cueBallBody);
    for (var count = 0; count < poolBallBodies.length; count += 1) {
        poolBallBodies[count] = new CANNON.Body({
            mass: ballMass,
            position: new CANNON.Vec3(-1 + count * 0.2, 0.5, -1 + count * 0.2)
        });
        poolBallBodies[count].addShape(ball);
        world.addBody(poolBallBodies[count]);
    }
}
function makeMesh(size: CANNON.Vec3, material:THREE.Material, position:CANNON.Vec3): THREE.Mesh {
    var box = new THREE.BoxGeometry(size.x, size.y, size.z);
    var boxMesh = new THREE.Mesh(box, material);
    boxMesh.position.set(position.x/2, -position.y/2, position.z/2);
    return boxMesh;
}

function setPosition(obj3d: THREE.Object3D, body: CANNON.Body) {
    var position = body.position;
    var quaternion = body.quaternion;
    obj3d.position.set(position.x/2, position.y/2, position.z/2);
    obj3d.quaternion.set(quaternion.w, quaternion.x, quaternion.y, quaternion.z);
}

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 1, 3);
    camera.position.set(0, 1, 2);
    camera.quaternion.setFromEuler(new THREE.Euler(-0.6, 0, 0, 'YXZ'));
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
    document.getElementById('camera').addEventListener('click', (event) => {
        var orientationX = parseFloat((<HTMLInputElement>document.getElementById('orientationX')).value),
            orientationY = parseFloat((<HTMLInputElement>document.getElementById('orientationY')).value),
            orientationZ = parseFloat((<HTMLInputElement>document.getElementById('orientationZ')).value),
            positionX = parseFloat((<HTMLInputElement>document.getElementById('positionX')).value),
            positionY = parseFloat((<HTMLInputElement>document.getElementById('positionY')).value),
            positionZ = parseFloat((<HTMLInputElement>document.getElementById('positionZ')).value);

        camera.setRotationFromEuler(new THREE.Euler(orientationX, orientationY, orientationZ, 'YXZ'));
        camera.position.set(positionX, positionY, positionZ);
    });


    document.getElementById('force').addEventListener('click', (event) => {
        var angle = parseFloat((<HTMLInputElement>document.getElementById('angle')).value),
            power = parseFloat((<HTMLInputElement>document.getElementById('power')).value),
            force = new CANNON.Vec3(Math.cos(angle) * power, 0, Math.sin(angle) * power),
            worldPoint = force.unit().mult(-ballDiameter / 2);

        cueBallBody.applyForce(force, worldPoint);
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
