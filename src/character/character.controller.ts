import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { CharacterService } from './character.service';
import {Sort,Gender} from './interface/enum.interface';


@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('/book/:id')
  async getBookCharacter(
    @Res() res: Response,
    @Param('id') id:number,
    @Query('sort') sort:Sort,
    @Query('filter') filter:Gender
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
