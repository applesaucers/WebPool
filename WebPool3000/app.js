/// <reference path="./cannon.d.ts" />
/// <amd-dependency path="cannon" />
/// <reference path="./three.d.ts" />
/// <amd-dependency path="three" />
var world, table, timeStep = 1 / 60, poolBalls = new Array(15), cueBall, scene, camera, renderer, tableMesh, poolBallMeshes = new Array(15), cueBallMesh;
initThree();
initCannon();
animate();

var ballDiameter = 0.0054;
var ballMass = 0.17;
var pocketDiameter = ballDiameter * 1.6;
var tableHeight = 0.8;
var fieldWidth = 1.93;
var fieldLength = 0.965;
var fieldThickness = 2.54;

var tableBaseSize = new CANNON.Vec3(fieldWidth, fieldLength, fieldThickness);
var tableWidthBumperSize = new CANNON.Vec3((fieldWidth - pocketDiameter * 3) / 2, pocketDiameter, ballDiameter + fieldThickness);
var tableLengthBumperSize = new CANNON.Vec3(pocketDiameter, (fieldLength - pocketDiameter * 2) / 2, ballDiameter + fieldThickness);
var tableWidthSideSize = new CANNON.Vec3(2.13, pocketDiameter, ballDiameter + fieldThickness);
var tableLengthSideSize = new CANNON.Vec3(pocketDiameter, 0.2825, ballDiameter + fieldThickness);
var tableLegSize = new CANNON.Vec3(fieldThickness, fieldThickness, tableHeight);

var tableBasePos = new CANNON.Vec3(0, 0, tableHeight);

var tableLegPos = [
    new CANNON.Vec3(-fieldWidth / 2, fieldLength / 2, 0),
    new CANNON.Vec3(fieldWidth / 2, fieldLength / 2, 0),
    new CANNON.Vec3(-fieldWidth / 2, -fieldLength / 2, 0),
    new CANNON.Vec3(fieldWidth / 2, -fieldLength / 2, 0)
];

var tableLengthBumperPos = [
    new CANNON.Vec3(-fieldWidth / 2 - pocketDiameter, 0, 0),
    new CANNON.Vec3(fieldWidth / 2 + pocketDiameter, 0, 0)
];

var tableWidthBumperPos = [
    new CANNON.Vec3(-fieldWidth / 4, fieldLength / 2 + pocketDiameter, 0),
    new CANNON.Vec3(fieldWidth / 4, fieldLength / 2 + pocketDiameter, 0),
    new CANNON.Vec3(-fieldWidth / 4, -fieldLength / 2 - pocketDiameter, 0),
    new CANNON.Vec3(fieldWidth / 4, -fieldLength / 2 - pocketDiameter, 0)
];

var tableLengthSidePos = [
    new CANNON.Vec3(-fieldWidth / 2 - pocketDiameter * 2, 0, 0),
    new CANNON.Vec3(fieldWidth / 2 + pocketDiameter * 2, 0, 0)
];

var tableWidthSidePos = [
    new CANNON.Vec3(-fieldLength / 2 - pocketDiameter * 2, 0, 0),
    new CANNON.Vec3(fieldLength / 2 + pocketDiameter * 2, 0, 0)
];

function initCannon() {
    world = new CANNON.World();
    world.gravity.set(0, 0, -30);
    world.broadphase = new CANNON.NaiveBroadphase();

    table = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.KINEMATIC,
        position: new CANNON.Vec3(0, 0, 0)
    });

    table.addShape(new CANNON.Box(tableBaseSize), tableBasePos);

    world.addBody(table);

    var ball = new CANNON.Sphere(ballDiameter / 2);
    cueBall.addShape(ball);
    world.addBody(cueBall);
    for (var count = 0; count < poolBalls.length; count += 1) {
        poolBalls[count] = new CANNON.Body({
            mass: ballMass,
            position: new CANNON.Vec3(0, 0, tableHeight + fieldThickness)
        });
        poolBalls[count].addShape(ball);
        world.addBody(poolBalls[count]);
    }

    cueBall = new CANNON.Body({
        mass: ballMass,
        position: new CANNON.Vec3(0, 0, tableHeight + fieldThickness)
    });
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.z = 5;
    scene.add(camera);
    var wood = new THREE.MeshBasicMaterial({ color: 0x996600 });
    var field = new THREE.MeshBasicMaterial({ color: 0x009933 });

    var table3d = new THREE.Object3D();
    table3d.add(makeMesh(tableBaseSize, field, tableBasePos));

    for (var count = 0; count < tableLegPos.length; count += 1) {
        table3d.add(makeMesh(tableLegSize, wood, tableLegPos[count]));
    }
    for (var count = 0; count < tableLengthBumperPos.length; count += 1) {
        table3d.add(makeMesh(tableLengthBumperSize, wood, tableLengthBumperPos[count]));
    }
    for (var count = 0; count < tableWidthBumperPos.length; count += 1) {
        table3d.add(makeMesh(tableWidthBumperSize, wood, tableWidthBumperPos[count]));
    }
    for (var count = 0; count < tableLengthSidePos.length; count += 1) {
        table3d.add(makeMesh(tableLengthSideSize, wood, tableLengthSidePos[count]));
    }
    for (var count = 0; count < tableWidthSidePos.length; count += 1) {
        table3d.add(makeMesh(tableWidthSideSize, wood, tableWidthSidePos[count]));
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
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
    setPosition(cueBallMesh, table);
}
function render() {
    renderer.render(scene, camera);
}
//# sourceMappingURL=app.js.map
