import { Controller, Get, Post, Body, Param, Req, Res, Ip } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {Request, Response} from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create/book/:id')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Ip() ip,
    @Res() res: Response,
    @Param('id') id:number

  ): Promise<Response> {
    createCommentDto.ip_address = ip
    createCommentDto.book_id = id

    const comment = await this.commentService.create(createCommentDto);

    return res.status(200).json({
      message: 'Commend added!',
      comment
    })

  }


  @Get('book/:id')
  async findByBook(
    @Param('id') id: number,
    @Res() res: Response
    ): Promise<Response> {
    const [comments, count] = await  this.commentService.bookComment(id,true);
    return res.status(200).json({
      message: 'comments fetched!',
      data: {
        comments, numberOfComment:count
      }
    })
  }

}
