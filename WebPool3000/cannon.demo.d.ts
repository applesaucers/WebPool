/// <reference path="./cannon.d.ts" />

/// <reference path="./libs/three-canvasrenderer.d.ts" />
/// <amd-dependency path="three" />
declare module CANNON {

    export class Demo extends EventTarget {
            constructor(settings?: {
            stepFrequency?: number;
            quatNormalizeSkip?: number;
            quatNormalizeFast?: boolean;
            gx?: number;
            gy?: number;
            gz?: number;
            iterations?: number;
            tolerance?: number;
            k?: number;
            d?: number;
            scene?: number;
            paused?: boolean;
            rendermode?: string;
            constraints?: boolean;
            contacts?: boolean;
            cm2contact?: boolean;
            normals?: boolean;
            axes?: boolean;
            particleSize?: number;
            shadows?: boolean;
            aabbs?: boolean;
            profiling?: boolean;
            maxSubSteps?: number;
        })

        addScene(title: string, initfunc: () => void): void;
        restartCurrentScene(): void;
        changeScene(number): void;
        start(): void;

        setGlobalSpookParams(k: number, d: number, h: number): void;
        getWorld(): World;
        addVisual(body: Body): void;
        addVisuals(body: Body[]): void;
        removeVisual(body: Body): void;
        removeAllVisuals(): void;
        shape2mesh(body: Body): THREE.Object3D;
    }
}