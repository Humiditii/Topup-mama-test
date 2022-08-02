import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { HttpModule } from '@nestjs/axios';
import {CommentModule} from '../comment/comment.module';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [HttpModule, CommentModule]
})
export class BookModule {}
