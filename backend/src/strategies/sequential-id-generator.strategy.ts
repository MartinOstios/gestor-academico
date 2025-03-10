import { Injectable } from '@nestjs/common';
import { IdGeneratorStrategy } from './id-generator.strategy';

/**
 * Estrategia que genera IDs secuenciales para cada entidad
 * Formato: [Prefijo]-[Número secuencial]
 * Ejemplo: EST-001, PROF-001, DEP-001, etc.
 */
@Injectable()
export class SequentialIdGeneratorStrategy implements IdGeneratorStrategy {
  // Mapeo de entidades a prefijos
  private readonly prefixMap = {
    'estudiante': 'EST',
    'profesor': 'PROF',
    'departamento': 'DEP',
    'curso': 'CUR',
    'evaluacion': 'EVAL'
  };

  // Entidades que usan 'codigo' como identificador en lugar de 'id'
  private readonly useCodigoAsId = ['departamento', 'curso'];

  /**
   * Genera un ID secuencial para la entidad especificada
   * @param entityName Nombre de la entidad
   * @param repository Repositorio de la entidad
   * @returns ID generado en formato [Prefijo]-[Número]
   */
  async generateId(entityName: string, repository: any): Promise<string> {
    // Obtener el prefijo para la entidad
    const prefix = this.prefixMap[entityName.toLowerCase()] || entityName.substring(0, 3).toUpperCase();
    
    // Determinar qué campo usar como identificador
    const idField = this.useCodigoAsId.includes(entityName) ? 'codigo' : 'id';
    
    // Buscar el último ID con el mismo prefijo
    let lastId = '';
    
    try {
      // Intentar encontrar la última entidad con el mismo prefijo
      const lastEntity = await repository.createQueryBuilder(entityName)
        .where(`${idField} LIKE :prefix`, { prefix: `${prefix}-%` })
        .orderBy(`${idField}`, 'DESC')
        .getOne();
      
      lastId = lastEntity ? lastEntity[idField] : '';
    } catch (error) {
      console.error(`Error al buscar el último ID para ${entityName}:`, error);
      // Si hay un error, dejamos lastId como cadena vacía
    }
    
    // Extraer el número del último ID o comenzar desde 1
    let nextNumber = 1;
    if (lastId) {
      const match = lastId.match(/-(\d+)$/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    // Formatear el número con ceros a la izquierda (3 dígitos)
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    
    // Devolver el ID generado
    return `${prefix}-${formattedNumber}`;
  }
} 