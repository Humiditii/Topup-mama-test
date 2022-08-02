import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService],
  imports: [HttpModule]
})
export class CharacterModule {}
