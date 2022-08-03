import { Controller, Get, Param, Res } from '@nestjs/common';
import {  ApiOkResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiQuery, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('books')
  @ApiOkResponse({ 
    description: 'The resource was returned successfully'})
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  @ApiOperation({description: "This endpoint fetch all book names, list of authors and number of comments on it"})
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
  @ApiOkResponse({ 
    description: 'The resource was returned successfully'})
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  @ApiOperation({description: "This endpoint get a particular book information and comments on the book in descending order i.e Newest to Oldest comment"})
  /// Request Documentation
  @ApiParam({
      name: "id",
      description: "This is the description of a query argument. It takes the id of the book to fetch",
      type: Number,
      required: true // This value is optional
  })
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
