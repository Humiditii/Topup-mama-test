import {ApiProperty} from '@nestjs/swagger';

export class CreateCommentDto {

    @ApiProperty({
        type: String,
        description: 'This is a required property, it accepts user commeny',
      })
    private readonly comment:string;
    book_id:number;
    ip_address:string;
}
