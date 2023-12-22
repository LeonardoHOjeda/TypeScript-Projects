import { EmpleadoService } from '../src/modules/empleado/services/empleado.service'
import { Empleado } from '../src/entities/empleados/empleado.entity'
import { HTTPError } from '../src/middlewares/error_handler'

describe('EmpleadoService', () => {
  let empleadoService: EmpleadoService

  beforeEach(() => {
    empleadoService = new EmpleadoService()
  })

  describe('findOne', () => {
    it('should return the empleado with related entities', async () => {
      // Mock the Empleado.findOne method
      const mockEmpleado = new Empleado()
      jest.spyOn(Empleado, 'findOne').mockResolvedValue(mockEmpleado)

      // Mock the related entity methods
      const mockSupervisor = { id: 1, name: 'John Doe' }
      const mockMetodoPago = { id: 1, type: 'Credit Card' }
      const mockBanco = { id: 1, name: 'Bank of Example' }
      jest.spyOn(empleadoService, 'findSupervisor').mockResolvedValue(mockSupervisor)
      jest.spyOn(empleadoService, 'findMetodoPago').mockResolvedValue(mockMetodoPago)
      jest.spyOn(empleadoService, 'findBanco').mockResolvedValue(mockBanco)

      // Call the findOne method
      const id_emp = 1
      const noempx = 'example'
      const result = await empleadoService.findOne(id_emp, noempx)

      // Assert the result
      expect(result).toEqual({
        ...mockMetodoPago,
        supervisor: mockSupervisor,
        metodoPago: mockMetodoPago,
        banco: mockBanco
      })
    })

    it('should throw an HTTPError if empleado is not found', async () => {
      // Mock the Empleado.findOne method to return null
      jest.spyOn(Empleado, 'findOne').mockResolvedValue(null)

      // Call the findOne method
      const id_emp = 1
      const noempx = 'example'
      await expect(empleadoService.findOne(id_emp, noempx)).rejects.toThrow(HTTPError)
    })
  })
})
