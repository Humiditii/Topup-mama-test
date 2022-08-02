import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { CharacterModule } from './character/character.module';
import { CommentModule } from './comment/comment.module';
import {Comment} from './comment/entities/comment.entity';
import {ConfigService} from '@nestjs/config';

@Module({
  imports: [CharacterModule, CommentModule, BookModule,ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
    expandVariables: true
  }), TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory:(configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Comment],
        synchronize: true,
      }),
    inject: [ConfigService]
  })]
})
export class AppModule {}
