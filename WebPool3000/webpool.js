/// <reference path="./cannon.d.ts" />
/// <amd-dependency path="cannon" />
/// <reference path="./three-canvasrenderer.d.ts" />
/// <amd-dependency path="three" />
var world, tableBody, timeStep = 1 / 60, poolBallBodies = new Array(15), cueBallBody, scene, camera, renderer, table3d, poolBallMeshes = new Array(15), cueBallMesh;

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

var tableBasePos = new CANNON.Vec3(0, ballDiameter / 2 + fieldThickness, 0);

var tableLegDistX = fieldWidth / 3;
var tableLegDistY = tableHeight / 2 + fieldThickness * 1.5 + ballDiameter / 2;
var tableLegDistZ = fieldLength / 2;
var tableLegPos = [
    new CANNON.Vec3(-tableLegDistX, tableLegDistY, tableLegDistZ),
    new CANNON.Vec3(tableLegDistX, tableLegDistY, tableLegDistZ),
    new CANNON.Vec3(-tableLegDistX, tableLegDistY, -tableLegDistZ),
    new CANNON.Vec3(tableLegDistX, tableLegDistY, -tableLegDistZ)
];

var tableWidthBumperX = fieldWidth / 4;
var tableWidthBumperZ = fieldLength / 2 + pocketDiameter * 0.5;
var tableWidthBumperPos = [
    new CANNON.Vec3(-tableWidthBumperX, 0, tableWidthBumperZ),
    new CANNON.Vec3(tableWidthBumperX, 0, tableWidthBumperZ),
    new CANNON.Vec3(-tableWidthBumperX, 0, -tableWidthBumperZ),
    new CANNON.Vec3(tableWidthBumperX, 0, -tableWidthBumperZ)
];
var tableLengthBumperX = fieldWidth / 2 + pocketDiameter * 0.5;
var tableLengthBumperPos = [
    new CANNON.Vec3(-tableLengthBumperX, 0, 0),
    new CANNON.Vec3(tableLengthBumperX, 0, 0)
];

var tableWidthSideZ = fieldLength / 2 + pocketDiameter * 1.5;
var tableWidthSidePos = [
    new CANNON.Vec3(0, 0, -tableWidthSideZ),
    new CANNON.Vec3(0, 0, tableWidthSideZ)
];
var tableLengthSideX = fieldWidth / 2 + pocketDiameter * 1.5;
var tableLengthSidePos = [
    new CANNON.Vec3(-tableLengthSideX, 0, 0),
    new CANNON.Vec3(tableLengthSideX, 0, 0)
];

initThree();
initCannon();
document.addEventListener('DOMContentLoaded', domSetup);
function initCannon() {
    world = new CANNON.World();
    world.gravity.set(0, -1, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    tableBody = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.KINEMATIC,
        position: new CANNON.Vec3(0, 0, 0)
    });

    tableBody.addShape(new CANNON.Box(tableBaseSize), tableBasePos);
    world.addBody(tableBody);

    var ball = new CANNON.Sphere(ballDiameter / 2);

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
function makeMesh(size, material, position) {
    var box = new THREE.BoxGeometry(size.x, size.y, size.z);
    var boxMesh = new THREE.Mesh(box, material);
    boxMesh.position.set(position.x, position.y, position.z);
    return boxMesh;
}

function setPosition(obj3d, body) {
    var position = body.position;
    var quaternion = body.quaternion;
    obj3d.position.set(position.x, position.y, position.z);
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
    cueBallMesh = new THREE.Mesh(ballShape, new THREE.MeshBasicMaterial({ color: 0xCCCCCC }));
    scene.add(cueBallMesh);
    for (var count = 0; count < poolBallMeshes.length; count += 1) {
        poolBallMeshes[count] = new THREE.Mesh(ballShape, new THREE.MeshBasicMaterial({ color: 0x990099 }));
        scene.add(poolBallMeshes[count]);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(800, 800);
}

function domSetup() {
    document.getElementById('camera').addEventListener('click', function (event) {
        var orientationX = parseFloat(document.getElementById('orientationZ').value), orientationY = parseFloat(document.getElementById('orientationY').value), orientationZ = parseFloat(document.getElementById('orientationZ').value), positionX = parseFloat(document.getElementById('positionX').value), positionY = parseFloat(document.getElementById('positionY').value), positionZ = parseFloat(document.getElementById('positionZ').value);

        camera.setRotationFromEuler(new THREE.Euler(orientationX, orientationY, orientationZ, 'YXZ'));
        camera.position.set(positionX, positionY, positionZ);
    });

    document.getElementById('force').addEventListener('click', function (event) {
        var angle = parseFloat(document.getElementById('angle').value), power = parseFloat(document.getElementById('power').value), force = new CANNON.Vec3(Math.cos(angle) * power, 0, Math.sin(angle) * power), worldPoint = force.unit().mult(-ballDiameter / 2);

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
//# sourceMappingURL=webpool.js.map
