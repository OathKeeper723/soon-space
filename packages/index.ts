/**
 * @name         SoonSpace
 * @param        {Object} option
 * @author       xuek
 * @lastUpdate   2019-07-24
 */

import { Scene, WebGLRenderer, PerspectiveCamera, AxesHelper, Color, CubeTexture, CubeTextureLoader, RGBFormat } from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'

class SoonSpace {
    
    el: string;
    initDom: any;
    events: object;
    config: object;
    renderer: any;
    scene: any;
    camera: any;

    constructor(option:any) {

        this.initDom;

        this.findInitDom(option.el)

        this.el = option.el
        this.events = option.events
        this.config = option.config

        this.renderer = new WebGLRenderer()
        this.scene = new Scene()
        this.camera = new PerspectiveCamera(75, 1, 0.1, 100)

        this.animate()
        this.init(this.initDom)

        return this

    }

    // 查找初始挂在
    findInitDom(id: string) {

        this.initDom = document.getElementById(id)

        if (!this.initDom) throw new Error(`Target container {"${id}"} is not a DOM element.`)

    }

    render() {

        this.renderer.render(this.scene, this.camera);

    }

    animate() {

        this.render();

        requestAnimationFrame(this.animate.bind(this))

    }

    init(initDom: any) {

        const { domElement } = this.renderer

        domElement.style.position = "relative"

        domElement.style.width = "100%"

        domElement.style.height = "100%"

        initDom.appendChild(domElement)

        this.scene.add(new AxesHelper(100))

        this.initControls()
    }

    initControls() {

        new OrbitControls(this.camera);

    }

    setBackgroundColor(color: string | number) {

        this.scene.background = new Color(color)

    }

    skyBackground(dirPath: string, fileNames: string[]) {

        var scene = this.scene;

        var cubeTextureLoader = new CubeTextureLoader();

        var cubeTexture;

        if (scene.background instanceof Color) {

            cubeTexture = cubeTextureLoader.setPath(dirPath).load(fileNames);

            cubeTexture.format = RGBFormat;

            scene.background = cubeTexture;

        } else {

            cubeTexture = scene.background;

            if (cubeTexture instanceof CubeTexture) { cubeTexture.dispose(); }

            this.setBackgroundColor(0x4495F0);

            cubeTexture = null;

            this.skyBackground(dirPath, fileNames)
        }

    }

}

export default SoonSpace