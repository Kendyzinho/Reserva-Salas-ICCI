// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from '../entity/proyecto.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // del paquete @nestjs/config
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');
        return {
          type: db.type,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          entities: [Proyecto],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
