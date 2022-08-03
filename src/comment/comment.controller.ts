import { Controller, Get, Post, Body, Param, Req, Res, Ip } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {Request, Response} from 'express';
import {ApiCreatedResponse, ApiUnprocessableEntityResponse, ApiForbiddenResponse, ApiParam, ApiOkResponse,ApiOperation, ApiInternalServerErrorResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create/book/:id')
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  @ApiOperation({ description: 'This endpoint returns the list of comments on a book' })
  @ApiParam({
    name: "id",
    description: "This is the description of a request parameter argument. It takes the id of the book and return the comments on annonymous users and their ip addresses from Newest to Oldest",
    type: Number,
    required: true // This value is optional
})
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
