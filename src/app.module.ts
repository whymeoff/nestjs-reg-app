import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ParticipantModule } from './participant/participant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    AdminModule, 
    ParticipantModule,
    TypeOrmModule.forRoot(typeOrmConfig)
  ]
})
export class AppModule {}
