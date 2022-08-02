import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {ConfigService} from '@nestjs/config';
import {Sort, Gender} from './interface/enum.interface';

@Injectable()
export class CharacterService {
  constructor(
    private readonly httpService:HttpService,
    private readonly configService: ConfigService
  ){}
  
  async getCharacters(book_id:number, sort?:Sort, filter?:Gender):Promise<{}[]>{
    try {

      const book_url = `${this.configService.get('BASE_URL')}/books/${book_id}`      

      const {data,status}: {data:[], status:number} = await this.httpService.axiosRef.get(this.configService.get('BASE_URL')+'/characters')
      const character_books: {}[] =  data.filter( ({books}:{books:[]}) => books.findIndex(e => e === book_url) !== -1)

      if(!sort && !filter){
        return character_books
      }
      if(filter && !sort){
        return character_books.filter( (e) => e['gender'] === filter )
      }
      if(filter && sort){
        const filtered: {}[] = character_books.filter( (e) => e['gender'] === filter )

        switch (sort) {

          case Sort.age: return filtered.sort(this.dynamicSort(Sort.age))
  
          case Sort.gender: return filtered.sort(this.dynamicSort(Sort.gender))
          
          case Sort.name: return filtered.sort(this.dynamicSort(Sort.name))
      
        }
      }

      if(!filter && sort){

        switch (sort) {

          case Sort.age: return character_books.sort(this.dynamicSort(Sort.age))
  
          case Sort.gender: return character_books.sort(this.dynamicSort(Sort.gender))
          
          case Sort.name: return character_books.sort(this.dynamicSort(Sort.name))
      
        }

      }

    } catch (error) {
      throw new HttpException('Internal Server error', 500)
    }
  }

  dynamicSort(property:string) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any,b:any) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
}
