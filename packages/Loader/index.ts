import Scene from '../Scene' 
import SBMLoader, { SbmInfo } from './SBMLoader'

const loader = {

  loadSBM(sbmInfo: SbmInfo): any {

    return new Promise((resolve, reject) => {

      const loader = new SBMLoader(sbmInfo)

      loader.load()

        .then((res: any) => {

          let container = loader.parse(res)

          new Scene().add(container)
          
          resolve(container)

        })

        .catch((err: any) => {

          reject(err)

        })

    })

  }
}

export default loader