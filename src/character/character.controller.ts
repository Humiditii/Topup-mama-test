import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { CharacterService } from './character.service';
import {Sort,Gender} from './interface/enum.interface';
import { ApiParam,ApiQuery, ApiOkResponse,ApiOperation, ApiInternalServerErrorResponse, ApiNotFoundResponse } from '@nestjs/swagger';


@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('/book/:id')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  @ApiOperation({ description: 'This endpoint get all characters in a book. The response could be sorted with some query parameters. Also the characters could be filtered by gender' })
  @ApiParam({
    name: "id",
    description: "This is the description of a query argument. It takes the id of the book to fetch",
    type: Number,
    required: true // This value is optional
})
@ApiQuery({
  name: "sort",
  description: "This is the description of a query argument. It takses a string i.e [name, gender,age] to sort the response of the character list",
  type: String,
  required: false // This value is optional
})
@ApiQuery({
  name: "filter",
  description: "This is the description of a query argument. It takes a string i.e [Male, Female] to filter the characters",
  type: Number,
  required: false // This value is optional
})
  async getBookCharacter(
    @Res() res: Response,
    @Param('id') id:number,
    @Query('sort') sort?:Sort,
    @Query('filter') filter?:Gender
  ):Promise<Response>{
    const [charInfo,metadata] = await this.characterService.getCharacters(id,sort,filter)
    res.header['metadata'] = metadata
    return res.status(200).json({
      message: 'characters details fetched!',
      metadata:res.header['metadata'],
      data: charInfo
    })
  }
  
}
