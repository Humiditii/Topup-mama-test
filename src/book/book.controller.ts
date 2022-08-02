import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Ip, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('books')
  async fetchBooks(
    @Res() res: Response
  ){
    const data = await this.bookService.fetchBooks()
    return res.status(200).json({
      message: 'All books fetched!',
      books:data
    })
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Res() res: Response
  ):Promise<Response> {
    const data = await this.bookService.findOne(id)
    return res.status(200).json({
      message:`Book fetched with id: ${id}`,
      data
    })
  }


}
