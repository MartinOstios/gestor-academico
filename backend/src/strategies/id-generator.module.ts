import { Module } from '@nestjs/common';
import { IdGeneratorContext } from './id-generator.strategy';
import { SequentialIdGeneratorStrategy } from './sequential-id-generator.strategy';

@Module({
  providers: [
    {
      provide: IdGeneratorContext,
      useFactory: () => {
        // Crear el contexto con la estrategia secuencial por defecto
        return new IdGeneratorContext(new SequentialIdGeneratorStrategy());
      }
    },
    SequentialIdGeneratorStrategy
  ],
  exports: [IdGeneratorContext]
})
export class IdGeneratorModule {} 