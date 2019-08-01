import { DefaultLoadingManager, LoadingManager, RepeatWrapping, Object3D, FrontSide, BackSide, DoubleSide, MeshPhongMaterial, Color, BufferGeometry, Geometry, Vector3, Vector2, Face3, Mesh } from 'three'
import Texture from '../Utils/Texture'

export class SbmInfo {
  id: string
  url: string
  mapsUrl: string
  name?: string
  scale?: number
  anisotropy?: string
  baseFloor?: string
  useBufferGeometry?: boolean
}

interface SBMLoader {
  crossOrgin: string[]
  textures: any
  materials: any
}

class SBMLoader implements SBMLoader {

  sbmInfo: SbmInfo

  constructor(sbmInfo: SbmInfo) {
    this.sbmInfo = sbmInfo
    this.crossOrgin = []
    this.textures = {}
    this.materials = {}
  }

  public load(): any {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest()
      xhr.open('GET', this.sbmInfo.url, true)
      xhr.responseType = 'arraybuffer'
      // xhr.setRequestHeader('crossOrgin', this.crossOrgin)

      xhr.onreadystatechange = (res: any) => {

        const { readyState, status, response } = res.currentTarget

        if (readyState === 4) {

          if (status === 200 || status === 304) {

            resolve(response)

          } else {

            reject(response)

          }

        }

      }

      xhr.send(null)

    })

  }

  public parse(data: any): Object3D {
    const container = new Object3D()
    container.userData.filesource = this.sbmInfo.url
    container.userData.id = this.sbmInfo.id
    container.userData.materials = []
    container.userData.textures = []
    if (this.sbmInfo.baseFloor != null) {
      container.userData.baseFloor = this.sbmInfo.baseFloor
    }
    container.name = this.sbmInfo.name

    const view = new DataView(data)
    const isLE = true

    let offset = 0
    offset += 8

    const version = view.getUint8(offset)
    offset += 1

    if (version > 4) { throw new Error('sbm version is wrong.') }

    if (version > 3) {
      view.getUint8(offset)
      offset += 1
      view.getUint16(offset)
      offset += 2
      view.getUint16(offset)
      offset += 2
      view.getUint16(offset)
      offset += 2
      view.getUint16(offset)
      offset += 2
    }

    const materialCount = view.getUint16(offset, isLE)
    offset += 2
    const meshCount = view.getUint16(offset, isLE)
    offset += 2

    // progress.totalModels = meshCount
    // progress.totalMaterials = materialCount

    if (version > 3) {
      view.getUint8(offset)
      offset += 1
      view.getUint8(offset)
      offset += 1
    }
    // 材料创造
    for (let i = 0; i < materialCount; ++i) {
      const id =
        version > 3
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      offset += version > 3 ? 4 : 2

      if (version > 3) {
        view.getUint8(offset)
        offset += 1
      }

      view.getFloat32(offset, isLE)
      offset += 4
      view.getFloat32(offset, isLE)
      offset += 4
      view.getFloat32(offset, isLE)
      offset += 4
      view.getFloat32(offset, isLE)
      offset += 4

      const d0 = view.getFloat32(offset, isLE)
      offset += 4
      const d1 = view.getFloat32(offset, isLE)
      offset += 4
      const d2 = view.getFloat32(offset, isLE)
      offset += 4
      const d3 = view.getFloat32(offset, isLE)
      offset += 4

      view.getFloat32(offset, isLE)
      offset += 4
      view.getFloat32(offset, isLE)
      offset += 4
      view.getFloat32(offset, isLE)
      offset += 4
      view.getFloat32(offset, isLE)
      offset += 4

      const cullingMode = view.getUint8(offset)

      offset += 1
      let facing = 0
      if (cullingMode === 0) {
        facing = FrontSide
      } else if (cullingMode === 1) {
        facing = BackSide
      } else if (cullingMode === 2) {
        facing = DoubleSide
      }

      const texnamelen = view.getUint16(offset, isLE)
      offset += 2

      let texture = null
      if (texnamelen > 0) {
        const temp = data.slice(offset, offset + texnamelen)
        // var textureName = decoder.decode(temp)
        let textureName = ''
        let test = ''
        const array = new Uint8Array(temp, 0, texnamelen)

        for (let j = 0; j < texnamelen; ++j) {
          if (array[j] > 127) {
            test = test + '%' + array[j].toString(16).toUpperCase()
          } else {
            if (test.length) {
              textureName += decodeURIComponent(test)
            }

            textureName += String.fromCharCode(array[j])
            test = ''
          }
        }

        offset += texnamelen
        textureName = textureName.replace('\\', '/')
        let mapsUrl: any = null
        if (this.sbmInfo.mapsUrl.toString().length) {
          let onlyTextureName = textureName
          const sidx = onlyTextureName.lastIndexOf('/')
          if (sidx !== -1) {
            onlyTextureName = onlyTextureName.substr(
              sidx + 1,
              onlyTextureName.length - sidx + 1
            )
          }

          mapsUrl = this.sbmInfo.mapsUrl + onlyTextureName
        }


        if (!!this.textures && this.textures[mapsUrl]) {

          texture = this.textures[mapsUrl]

        } else {

          texture = Texture.load(mapsUrl)
          texture.name = textureName
          this.textures[mapsUrl] = texture
          container.userData.textures.push(mapsUrl)

        }

        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping

        texture.flipY = false

        if (this.sbmInfo.anisotropy) {
          texture.anisotropy = this.sbmInfo.anisotropy
        }
      }

      let material = this.materials[id.toString()]
      if (material == null) {
        const trans = d3 < 1 ? true : false
        material = new MeshPhongMaterial({
          color: new Color(d0, d1, d2),
          // ambient: new Color(a0, a1, a2),
          opacity: d3,
          transparent: trans,
          map: texture,
          side: facing,
          alphaTest: 0.5,
          shininess: 50,
          specular: 0x050505,
          // needsUpdate: true
          // overdraw: 1
        })

        material.name = id.toString()

        this.materials[id.toString()] = material
        container.userData.materials.push(material.uuid)
      }
    }

    for (let i = 0; i < meshCount; ++i) {
      const id = String(
        version > 3
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      )
      offset += version > 3 ? 4 : 2

      if (version > 2) {
        const meshNameLen = view.getUint16(offset, isLE)
        offset += 2
        if (meshNameLen > 0) {
          const temp = data.slice(offset, offset + meshNameLen)
          let test = ''
          const array = new Uint8Array(temp, 0, meshNameLen)
          for (let j = 0; j < meshNameLen; ++j) {
            if (array[j] > 127) {
              test = test + '%' + array[j].toString(16).toUpperCase()
            } else {
              test = ''
            }
          }

          offset += meshNameLen
        }
      }

      if (version > 3) {
        view.getUint16(offset, isLE)
        offset += 2
        view.getUint16(offset, isLE)
        offset += 2
      }

      const mat_id =
        version > 3
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      offset += version > 3 ? 4 : 2

      const geom = new Geometry()

      const vtCount =
        version > 2
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      offset += version > 2 ? 4 : 2

      if (version > 3) {
        view.getUint8(offset)
        offset += 1
      }

      if (vtCount > 0) {
        for (let v = 0; v < vtCount; ++v) {
          const vt = new Vector3()
          vt.x = view.getFloat32(offset, isLE)
          offset += 4
          vt.y = view.getFloat32(offset, isLE)
          offset += 4
          vt.z = view.getFloat32(offset, isLE)
          offset += 4
          vt.multiplyScalar(this.sbmInfo.scale)
          geom.vertices.push(vt)
        }
      }

      const norCount =
        version > 2
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      offset += version > 2 ? 4 : 2

      if (version > 3) {
        view.getUint8(offset)
        offset += 1
      }

      if (norCount > 0) {
        for (let n = 0; n < norCount; ++n) {
          const nor = new Vector3()
          nor.x = view.getFloat32(offset, isLE)
          offset += 4
          nor.y = view.getFloat32(offset, isLE)
          offset += 4
          nor.z = view.getFloat32(offset, isLE)
          offset += 4
        }
      }

      const tcCount =
        version > 2
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      offset += version > 2 ? 4 : 2

      if (version > 3) {
        view.getUint8(offset)
        offset += 1
      }

      const texcoords = new Array(tcCount)
      if (tcCount > 0) {
        for (let t = 0; t < tcCount; ++t) {
          const tc = new Vector2()
          tc.x = view.getFloat32(offset, isLE)
          offset += 4
          tc.y = view.getFloat32(offset, isLE)
          offset += 4

          texcoords[t] = tc
        }
      }

      const idxCount =
        version > 2
          ? view.getUint32(offset, isLE)
          : view.getUint16(offset, isLE)
      offset += version > 2 ? 4 : 2

      if (version > 3) {
        view.getUint8(offset)
        offset += 1
        view.getUint8(offset)
        offset += 1
      }

      if (idxCount > 0) {
        for (let f = 0; f < idxCount; ++f) {
          const a =
            version > 3
              ? view.getUint32(offset, isLE)
              : view.getUint16(offset, isLE)
          offset += version > 3 ? 4 : 2
          const b =
            version > 3
              ? view.getUint32(offset, isLE)
              : view.getUint16(offset, isLE)
          offset += version > 3 ? 4 : 2
          const c =
            version > 3
              ? view.getUint32(offset, isLE)
              : view.getUint16(offset, isLE)
          offset += version > 3 ? 4 : 2
          const face = new Face3(a, b, c)
          geom.faces.push(face)

          if (texcoords.length > 0) {
            geom.faceVertexUvs[0].push([
              texcoords[face.a],
              texcoords[face.b],
              texcoords[face.c]
            ])
          }
        }
      }

      geom.computeBoundingSphere()
      geom.computeBoundingBox()
      geom.computeVertexNormals(true)
      geom.computeFaceNormals()

      if (this.materials[mat_id.toString()]) {
        let mesh
        if (this.sbmInfo.useBufferGeometry) {
          const bufgeom = new BufferGeometry()
          bufgeom.fromGeometry(geom)
          bufgeom.boundingBox = geom.boundingBox.clone()
          mesh = new Mesh(bufgeom, this.materials[mat_id.toString()])
        } else {
          mesh = new Mesh(geom, this.materials[mat_id.toString()])
        }

        mesh.userData.id = id
        mesh.name = id

        mesh.castShadow = true
        mesh.receiveShadow = true

        container.add(mesh)
      }

    }

    return container
  }

}

export default SBMLoader