
import { LlavesCardex } from '../../../models/cardex.model'

const getTextColor = (backgroundColor: string) => {
  if (backgroundColor.toLocaleLowerCase() === 'fff' || backgroundColor.toLocaleLowerCase() === 'ffffff') return '#000'
  return '#fff'
}
export const Keys = ({ keysCardex: llaves }: { keysCardex: LlavesCardex[] }) => {
  return (
    <>
    <div className='container mx-auto md:px-20'>
      <h3 className="text-center bg-[#4765a6] text-white w-full mx-auto text-3xl rounded">Claves de Cárdex</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
        {llaves.map((llave) => (
          <div className="flex items-center gap-2 text-xs md:text-sm" key={llave.clave}>
            <p
              className="px-2 py-1 font-bold text-md"
              style={{ backgroundColor: `#${llave.color}`, color: getTextColor(llave.color) }}
            >
              {llave.clave}
            </p>
            <p className='font-bold'>{llave.descr?.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
