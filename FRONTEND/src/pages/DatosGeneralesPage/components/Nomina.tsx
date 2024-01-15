import { InputAdornment, TextField } from '@mui/material'
import { Icon } from '../../../utils/Icon'
import { faBrush, faBuilding, faHandHoldingDollar, faIndustry, faPersonDigging, faRectangleList, faBriefcaseClock, faBuildingColumns, faCalendar, faClock, faCoins, faFileContract, faFileInvoiceDollar, faGlasses, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { Nomina as NominaModel, TiposSalarios } from '../../../models/nomina.model'
import { Empleado } from '../../../models/empleado.model'
import { calculateAntiquity, formatDefaultDate } from '../../../utils/helpers'

export const Nomina = ({ empleado, nomina }: { empleado: Empleado, nomina: NominaModel }) => {
  if (!empleado) {
    return null
  }

  const nominaData = {
    area: `${nomina?.area.cveArea} - ${nomina?.area.desArea}` || 'NA',
    categoria: `${nomina?.categoria.categ} - ${nomina?.categoria.desCat}` || 'NA',
    centroCosto: `${nomina?.centroCosto.cCosto} - ${nomina?.centroCosto.descr}` || 'NA',
    departamento: `${nomina?.departamento.depto} - ${nomina?.departamento.descr}` || 'NA',
    linea: `${nomina?.linea.linea} - ${nomina?.linea.descr}` || 'NA',
    planta: `${nomina?.planta.cvePlanta} - ${nomina?.planta.desPlanta}` || 'NA',
    manoObra: `${nomina?.manoObra.tipoMO} - ${nomina?.manoObra.descripcion}` || 'NA'
  }

  const empleadoData = {
    fecha_alta: formatDefaultDate(empleado?.fecha_alta) || 'NA',
    antiguedad: calculateAntiquity(empleado?.fecha_alta) || '"N" años y "M" meses',
    fecha_periodo_prueba: formatDefaultDate(empleado?.fechaPerPrueba) || 'NA',
    fin_contrato: formatDefaultDate(empleado?.fechaTerContrato) || 'NA',
    revision_contrato: empleado?.fechaRevContrato ?? 'NA',
    tipo_salario: TiposSalarios[empleado?.gpo_imss] ?? 'NA',
    cuenta: empleado?.cuenta_invernomina ?? 'NA',
    supervisor: `${nomina?.supervisor.super.trim()} - ${nomina?.supervisor.nombr}` || 'NA',
    metodo_pago: nomina?.metodoPago.descripcion ?? 'NA',
    banco: `${nomina?.banco.banco} - ${nomina?.banco.descr}` || 'NA',
    horario: nomina?.horario.horario ?? 'NA',
    turno: nomina?.turno.turno ?? 'NA'
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <TextField
          label = 'Area'
          value={`${nominaData.area}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faPersonDigging}/>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label = 'Categoria'
          value={`${nominaData.categoria}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faRectangleList}/>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label = 'Centro de Costos'
          value={`${nominaData.centroCosto}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faHandHoldingDollar}/>
              </InputAdornment>
            ),
            inputProps: {
              style: { fontSize: '11px' }
            }
          }}
        />

        <TextField
          label = 'Departamento'
          value={`${nominaData.departamento}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faBuilding}/>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label = 'Linea'
          value={`${nominaData.linea}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faPersonDigging}/>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label = 'Planta'
          value={`${nominaData.planta}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faIndustry}/>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label = 'Tipo de Mano de Obra'
          value={`${nominaData.manoObra}`}
          variant='filled'
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faBrush}/>
              </InputAdornment>
            )
          }}
        />
      </div>
      <hr className='my-5' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextField
          label='Fecha de Alta'
          value={empleadoData.fecha_alta}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faCalendar}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Antigüedad'
          value={empleadoData.antiguedad}
          variant="filled"
          InputProps={{
            readOnly: true
          }}
        />

        <TextField
          label='Periodo de Prueba'
          value={empleadoData.fecha_periodo_prueba}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faBriefcaseClock}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Fin de Contrato'
          value={empleadoData.fin_contrato}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faFileContract}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Revision de Contrato'
          value={empleadoData.revision_contrato}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faGlasses}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Horario'
          value={empleadoData.horario}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faClock}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Turno'
          value={empleadoData.turno}
          variant="filled"
          InputProps={{
            readOnly: true
          }}
        />

        <TextField
          label='Supervisor'
          value={empleadoData.supervisor}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faUserTie}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Tipo de Salario'
          value={empleadoData.tipo_salario}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faCoins}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Tipo de Pago'
          value={empleadoData.metodo_pago}
          variant="filled"
          InputProps={{
            readOnly: true
          }}
        />

        <TextField
          label='Banco'
          value={empleadoData.banco}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faBuildingColumns}></Icon>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label='Numero de Cuenta'
          value={empleadoData.cuenta}
          variant="filled"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>
                <Icon css='icon' icon={faFileInvoiceDollar}></Icon>
              </InputAdornment>
            )
          }}
        />
      </div>
    </>

  )
}
