import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormConfig.options,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    }),
    UsersModule,
  ],
})
export class AppModule {}
