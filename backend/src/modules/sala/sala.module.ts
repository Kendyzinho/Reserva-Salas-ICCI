import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaService } from './sala.service';
import { SalaController } from './sala.controller';
import { Sala } from 'src/database/entity/sala.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sala])],
  controllers: [SalaController],
  providers: [SalaService],
})
export class SalaModule {}
