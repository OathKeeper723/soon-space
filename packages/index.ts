/**
 * @name         SoonSpace
 * @param        {Object} option
 * @author       xuek
 * @lastUpdate   2019-07-24
 */

import { WebGLRenderer, AmbientLight, PerspectiveCamera, AxesHelper, Color, CubeTexture, CubeTextureLoader, RGBFormat } from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'
import Scene from './Scene'
import loader from './Loader'

const { loadSBM } = loader

interface SoonSpace {
    el: string
    initDom: any
    events: object
    config: object
    renderer: any
    scene: Scene
    camera: any
    controls: OrbitControls
}

class SoonSpace implements SoonSpace {

    constructor(option: any) {

        this.initDom

        this.findInitDom(option.el)

        this.el = option.el
        this.events = option.events
        this.config = option.config

        this.renderer = new WebGLRenderer()
        this.scene = new Scene()
        this.camera = new PerspectiveCamera(75, 1, 0.1, 100)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        console.log( this.camera instanceof PerspectiveCamera )

        this.animate()

        this.initControls()

        this.init(this.initDom)

        /*光源*/
        const ambientLight = new AmbientLight(new Color(1, 1, 1));
        ambientLight.intensity = 2;
        this.scene.add(ambientLight);

        return this

    }

    // 查找初始挂在
    findInitDom(id: string) {

        this.initDom = document.getElementById(id)

        if (!this.initDom) throw new Error(`Target container {"${id}"} is not a DOM element.`)

    }

    animate() {

        this.renderer.render(this.scene, this.camera)

        this.controls.update()

        requestAnimationFrame(this.animate.bind(this))

    }

    init(initDom: any) {

        this.camera.position.set(-40, 40, 40);

        this.camera.lookAt(this.scene.position);

        this.renderer.setClearColor(0x222222);

        const { domElement } = this.renderer

        domElement.style.position = "relative"

        domElement.style.width = "100%"

        domElement.style.height = "100%"

        initDom.appendChild(domElement)

        this.scene.add(new AxesHelper(100))

    }

    initControls() {

        //是否可以缩放 
        this.controls.enableZoom = true

        console.log( this.controls )
      
    }

    setBackgroundColor(color: string | number) {

        this.scene.background = new Color(color)

    }

    skyBackground(dirPath: string, fileNames: string[]) {

        var scene = this.scene

        var cubeTextureLoader = new CubeTextureLoader()

        var cubeTexture

        if (scene.background instanceof Color) {

            cubeTexture = cubeTextureLoader.setPath(dirPath).load(fileNames)

            cubeTexture.format = RGBFormat

            scene.background = cubeTexture

        } else {

            cubeTexture = scene.background

            if (cubeTexture instanceof CubeTexture) { cubeTexture.dispose() }

            this.setBackgroundColor(0x4495F0)

            cubeTexture = null

            this.skyBackground(dirPath, fileNames)
        }

    }

    loadSBM = loadSBM

}

export default SoonSpace

