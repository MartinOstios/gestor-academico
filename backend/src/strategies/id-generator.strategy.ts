import { Injectable } from '@nestjs/common';

/**
 * Interfaz que define la estrategia para generar IDs
 */
export interface IdGeneratorStrategy {
  /**
   * Genera un ID único para una entidad
   * @param entityName Nombre de la entidad para la que se genera el ID
   * @param repository Repositorio de la entidad para verificar unicidad
   * @returns Promise con el ID generado
   */
  generateId(entityName: string, repository: any): Promise<string>;
}

/**
 * Contexto que utiliza una estrategia de generación de IDs
 */
@Injectable()
export class IdGeneratorContext {
  constructor(private strategy: IdGeneratorStrategy) {}

  /**
   * Establece la estrategia a utilizar
   * @param strategy Estrategia de generación de IDs
   */
  setStrategy(strategy: IdGeneratorStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Genera un ID utilizando la estrategia actual
   * @param entityName Nombre de la entidad
   * @param repository Repositorio de la entidad
   * @returns Promise con el ID generado
   */
  async generateId(entityName: string, repository: any): Promise<string> {
    return this.strategy.generateId(entityName, repository);
  }
} 