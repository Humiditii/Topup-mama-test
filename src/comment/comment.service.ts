import { Injectable } from '@nestjs/common';
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
    const new_comment = new Comment()
    for (const key in createCommentDto) {
      new_comment[key] = createCommentDto[key]
    }
    return this.commentRepo.save(new_comment)
  }


  async bookComment(book_id: number, count?:boolean):Promise<[Comment[], number]> {
    const comments = await this.commentRepo.find({
      where: {
        book_id:book_id
      },
      order: {
        id: 'DESC'
      }
    })
    return [comments, count? comments.length: null]
  }


  async count(book_id:number):Promise<number>{
    const [_,count] =  await this.commentRepo.findAndCount({where:{book_id:book_id}})
    return count
  }

}
