import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import {Comment} from './entities/comment.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>
  ){}

  async create(createCommentDto: CreateCommentDto):Promise<Comment>{
    try {
      const new_comment = new Comment()
      for (const key in createCommentDto) {
        new_comment[key] = createCommentDto[key]
      }
      return this.commentRepo.save(new_comment)
    } catch (error) {
      const err = {
        message: error.response.statusText?error.response.statusText:"Internal Server Error",
        code: error.response.status ? error.response.status : 500 }
      throw new HttpException(err.message, err.code) 
    }
  }


  async bookComment(book_id: number, count?:boolean):Promise<[Comment[], number]> {
    try {
      const comments = await this.commentRepo.find({
        where: {
          book_id:book_id
        },
        order: {
          id: 'DESC'
        }
      })
      return [comments, count? comments.length: null]
    } catch (error) {
      const err = { message: error.response.statusText?error.response.statusText:"Internal Server Error",
    code: error.response.status ? error.response.status : 500 }
      throw new HttpException(err.message, err.code) 
    }
  }


  async count(book_id:number):Promise<number>{
    const [_,count] =  await this.commentRepo.findAndCount({where:{book_id:book_id}})
    return count
  }

}
