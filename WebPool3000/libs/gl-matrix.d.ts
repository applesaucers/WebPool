

declare type GlArray = Float32Array;
declare type NumberArray = Float32Array | Number[];

interface glMatrix {
  setMatrixArrayType(type: GlArray): void;
  toRadian(a: number): number;
}
declare var glMatrix: glMatrix;

interface vec2 {
    create(): GlArray;
    clone(a: NumberArray): GlArray;
    fromValues(x: number, y: number): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    set(out: GlArray, x: number, y: number): GlArray;
    add(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    subtract(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    sub(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    divide(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    div(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    min(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    max(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    scale(out: GlArray, a: NumberArray, b: number): GlArray;
    scaleAndAdd(out: GlArray, a: NumberArray, b: NumberArray, scale: number): GlArray;
    distance(a: NumberArray, b: NumberArray): number;
    dist(a: NumberArray, b: NumberArray): number;
    squaredDistance(a: NumberArray, b: NumberArray): number;
    sqrDist(a: NumberArray, b: NumberArray): number;
    length(a: NumberArray): number;
    len(a: NumberArray): number;
    squaredLength(a: NumberArray): number;
    sqrLen(a: NumberArray): number;
    negate(out: GlArray, a: NumberArray): GlArray;
    normalize(out: GlArray, a: NumberArray): GlArray;
    dot(a: NumberArray, b: NumberArray): number;
    cross(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    lerp(out: GlArray, a: NumberArray, b: NumberArray, t: number): GlArray;
    random(out: GlArray, scale: number): GlArray;
    transformMat2(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    transformMat2d(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    transformMat3(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    transformMat4(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    forEach<T>(a: GlArray[], stride: number, offset: number, count: number, fn: (a: GlArray, b: GlArray, arg: T) => void, arg: T): GlArray[];
    str(a: NumberArray): string;
}
declare var vec2: vec2;


interface vec3 {
    create(): GlArray;
    clone(a: NumberArray): GlArray;
    fromValues(x: number, y: number, z: number): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    set(out: GlArray, x: number, y: number, z: number): GlArray;
    add(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    subtract(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    sub(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    divide(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    div(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    min(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    max(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    scale(out: GlArray, a: NumberArray, b: number): GlArray;
    scaleAndAdd(out: GlArray, a: NumberArray, b: NumberArray, scale: number): GlArray;
    distance(a: GlArray, b: NumberArray): number;
    dist(a: NumberArray, b: NumberArray): number;
    squaredDistance(a: NumberArray, b: NumberArray): number;
    sqrDist(a: NumberArray, b: NumberArray): number;
    length(a: NumberArray): number;
    len(a: NumberArray): number;
    squaredLength(a: NumberArray): number;
    sqrLen(a: NumberArray): number;
    negate(out: GlArray, a: NumberArray): GlArray;
    normalize(out: GlArray, a: NumberArray): GlArray;
    dot(a: NumberArray, b: NumberArray): number;
    cross(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    lerp(out: GlArray, a: NumberArray, b: NumberArray, t: number): GlArray;
    random(out: GlArray, scale: number): GlArray;
    transformMat4(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    transformMat3(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    transformQuat(out: GlArray, a: NumberArray, q: NumberArray): GlArray;
    rotateX(out: GlArray, a: NumberArray, b: NumberArray, c: number): GlArray;
    rotateY(out: GlArray, a: NumberArray, b: NumberArray, c: number): GlArray;
    rotateZ(out: GlArray, a: NumberArray, b: NumberArray, c: number): GlArray;
    forEach<T>(a: GlArray[], stride: number, offset: number, count: number, fn: (a: GlArray, b: GlArray, arg: T) => void, arg: T): GlArray[];
    str(a: NumberArray): string;
}
declare var vec3: vec3;


interface vec4 {
    create(): GlArray;
    clone(a: NumberArray): GlArray;
    fromValues(x: number, y: number, z: number, w: number): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    set(out: GlArray, x: number, y: number, z: number, w: number): GlArray;
    add(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    subtract(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    sub(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    divide(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    div(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    min(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    max(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    scale(out: GlArray, a: NumberArray, b: number): GlArray;
    scaleAndAdd(out: GlArray, a: NumberArray, b: NumberArray, scale: number): GlArray;
    distance(a: NumberArray, b: NumberArray): number;
    dist(a: NumberArray, b: NumberArray): number;
    squaredDistance(a: NumberArray, b: NumberArray): number;
    sqrDist(a: NumberArray, b: NumberArray): number;
    length(a: NumberArray): number;
    len(a: NumberArray): number;
    squaredLength(a: NumberArray): number;
    sqrLen(a: NumberArray): number;
    negate(out: GlArray, a: NumberArray): GlArray;
    normalize(out: GlArray, a: NumberArray): GlArray;
    dot(a: NumberArray, b: NumberArray): number;
    lerp(out: GlArray, a: NumberArray, b: NumberArray, t: number): GlArray;
    random(out: GlArray, scale: number): GlArray;
    transformMat4(out: GlArray, a: NumberArray, m: NumberArray): GlArray;
    transformQuat(out: GlArray, a: NumberArray, q: NumberArray): GlArray;
    forEach<T>(a: GlArray[], stride: number, offset: number, count: number, fn: (a: GlArray, b: GlArray, arg: T) => void, arg: T): GlArray[];
    str(a: NumberArray): string;
}
declare var vec4: vec4;


interface mat2 {
    create(): GlArray;
    clone(a: NumberArray): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    identity(out: GlArray): GlArray;
    transpose(out: GlArray, a: NumberArray): GlArray;
    invert(out: GlArray, a: NumberArray): GlArray;
    adjoint(out: GlArray, a: NumberArray): GlArray;
    determinant(a: NumberArray): number;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    rotate(out: GlArray, a: NumberArray, rad: number): GlArray;
    scale(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    str(a: NumberArray): string;
}
declare var mat2: mat2;


interface mat2d {
    create(): GlArray;
    clone(a: NumberArray): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    identity(out: GlArray): GlArray;
    invert(out: GlArray, a: NumberArray): GlArray;
    determinant(a: NumberArray): number;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    rotate(out: GlArray, a: NumberArray, rad: number): GlArray;
    scale(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    translate(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    str(a: NumberArray): string;
}
declare var mat2d: mat2d;


interface mat3 {
    create(): GlArray;
    fromMat4(out: GlArray, a: NumberArray): GlArray;
    clone(a: NumberArray): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    identity(out: GlArray): GlArray;
    transpose(out: GlArray, a: NumberArray): GlArray;
    invert(out: GlArray, a: NumberArray): GlArray;
    adjoint(out: GlArray, a: NumberArray): GlArray;
    determinant(a: NumberArray): number;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    translate(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    rotate(out: GlArray, a: NumberArray, rad: number): GlArray;
    scale(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    fromMat2d(out: GlArray, a: NumberArray): GlArray;
    fromQuat(out: GlArray, q: NumberArray): GlArray;
    normalFromMat4(out: GlArray, a: NumberArray): GlArray;
    str(a: NumberArray): string;
}
declare var mat3: mat3;


interface mat4 {
    create(): GlArray;
    clone(a: NumberArray): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    identity(out: GlArray): GlArray;
    transpose(out: GlArray, a: NumberArray): GlArray;
    invert(out: GlArray, a: NumberArray): GlArray;
    adjoint(out: GlArray, a: NumberArray): GlArray;
    determinant(a: NumberArray): number;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    translate(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    scale(out: GlArray, a: NumberArray, v: NumberArray): GlArray;
    rotate(out: GlArray, a: NumberArray, rad: number, axis: NumberArray): GlArray;
    rotateX(out: GlArray, a: NumberArray, rad: number): GlArray;
    rotateY(out: GlArray, a: NumberArray, rad: number): GlArray;
    rotateZ(out: GlArray, a: NumberArray, rad: number): GlArray;
    fromRotationTranslation(out: GlArray, q: NumberArray, v: NumberArray): GlArray;
    fromQuat(out: GlArray, q: NumberArray): GlArray;
    frustum(out: GlArray, left: number, right: number, bottom: number, top: number, near: number, far: number): GlArray;
    perspective(out: GlArray, fovy: number, aspect: number, near: number, far: number): GlArray;
    ortho(out: GlArray, left: number, right: number, bottom: number, top: number, near: number, far: number): GlArray;
    lookAt(out: GlArray, eye: NumberArray, center: NumberArray, up: NumberArray): GlArray;
    str(a: NumberArray): string;
}
declare var mat4: mat4;


interface quat {
    create(): GlArray;
    rotationTo(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    setAxes(out: GlArray, view: NumberArray, right: NumberArray, up: NumberArray): GlArray;
    clone(a: NumberArray): GlArray;
    fromValues(x: number, y: number, z: number, w: number): GlArray;
    copy(out: GlArray, a: NumberArray): GlArray;
    set(out: GlArray, x: number, y: number, z: number, w: number): GlArray;
    identity(out: GlArray): GlArray;
    setAxisAngle(out: GlArray, axis: NumberArray, rad: number): GlArray;
    add(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    multiply(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    mul(out: GlArray, a: NumberArray, b: NumberArray): GlArray;
    scale(out: GlArray, a: NumberArray, b: number): GlArray;
    rotateX(out: GlArray, a: NumberArray, rad: number): GlArray;
    rotateY(out: GlArray, a: NumberArray, rad: number): GlArray;
    rotateZ(out: GlArray, a: NumberArray, rad: number): GlArray;
    calculateW(out: GlArray, a: NumberArray): GlArray;
    dot(a: NumberArray, b: NumberArray): number;
    lerp(out: GlArray, a: NumberArray, b: NumberArray, t: number): GlArray;
    slerp(out: GlArray, a: NumberArray, b: NumberArray, t: number): GlArray;
    invert(out: GlArray, a: NumberArray): GlArray;
    conjugate(out: GlArray, a: NumberArray): GlArray;
    length(a: NumberArray): number;
    len(a: NumberArray): number;
    squaredLength(a: NumberArray): number;
    sqrLen(a: NumberArray): number;
    normalize(out: GlArray, a: NumberArray): GlArray;
    fromMat3(out: GlArray, m: NumberArray): GlArray;
    str(a: NumberArray): string;
}
declare var quat: quat;

