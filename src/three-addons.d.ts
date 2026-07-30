declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { GLTFLoader } from 'three';
  export { GLTFLoader };
  export default GLTFLoader;
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { DRACOLoader } from 'three';
  export { DRACOLoader };
  export default DRACOLoader;
}

declare module 'three/addons/loaders/GLTFLoader' {
  import { GLTFLoader } from 'three';
  export { GLTFLoader };
  export default GLTFLoader;
}

declare module 'three/addons/loaders/DRACOLoader' {
  import { DRACOLoader } from 'three';
  export { DRACOLoader };
  export default DRACOLoader;
}

declare module 'three/examples/jsm/loaders/FBXLoader' {
  import { Group, LoadingManager } from 'three';
  export class FBXLoader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (object: Group) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    parse(FBXBuffer: ArrayBuffer | string, path: string): Group;
  }
}