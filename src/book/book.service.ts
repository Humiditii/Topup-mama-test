import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {CommentService} from '../comment/comment.service';

@Injectable()
export class BookService {
  constructor(
    private commentService: CommentService,
    private readonly httpService:HttpService,
    private readonly configService: ConfigService
  ){}

  async fetchBooks():Promise<{}[]>{
    try {
      const {data,status}: {data:[], status:number} = await this.httpService.axiosRef.get(this.configService.get('BASE_URL')+'/books')

      const fetched:{}[] = []

      for await (const [id,{name, authors}] of data.entries()) {
        const count = await this.commentService.count(id)
        const obj =  {id,name, authors, commentCount:count }
        fetched.push(obj)
      }
      
      return fetched

    } catch (error) {
      throw new HttpException('Internal Server error', 500)
    }
  }


  async findOne(id: number) {
    try {
      
      const {data,status}: {data:[], status:number} = await this.httpService.axiosRef.get(this.configService.get('BASE_URL')+'/books/'+id)

      const [comments,count] = await this.commentService.bookComment(id,true)
      return {
        book:data,
        Comment: {
          comments:comments,
          count:count
        }
      }

    } catch (error) {
      throw new HttpException('Internal Server error', 500)
    }
  }
}

// {
//   "url": "https://www.anapioficeandfire.com/api/books/1",
//   "name": "A Game of Thrones",
//   "isbn": "978-0553103540",
//   "authors": [
//     "George R. R. Martin"
//   ],
//   "numberOfPages": 694,
//   "publisher": "Bantam Books",
//   "country": "United States",
//   "mediaType": "Hardcover",
//   "released": "1996-08-01T00:00:00",
//   "characters": [
//     "https://www.anapioficeandfire.com/api/characters/2",
//     ...
//   ],
//   "povCharacters": [
//     "https://www.anapioficeandfire.com/api/characters/148",
//     ...
//   ]
// }