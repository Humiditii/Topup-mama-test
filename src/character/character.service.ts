import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {ConfigService} from '@nestjs/config';
import {Sort, Gender} from './interface/enum.interface';
import {MetaData} from './interface/interface.interface';

@Injectable()
export class CharacterService {
  constructor(
    private readonly httpService:HttpService,
    private readonly configService: ConfigService
  ){}
  
  async getCharacters(book_id:number, sort?:Sort, filter?:Gender):Promise<[{}[], MetaData]>{

    const passSort:boolean =  sort in Sort
    const passFilter:boolean = filter in Gender

    if(sort && !passSort){
      throw new HttpException('Sort type invalid', 400)
    }

    if(filter && !passFilter){
      throw new HttpException('Filter type invalid', 400)
    }

    try {
      let metadata:MetaData = {totalCharacters:0, totalAge:0}
      let characterData:{}[]= []

      const book_url = `${this.configService.get('BASE_URL')}/books/${book_id}`      

      const {data,status}: {data:[], status:number} = await this.httpService.axiosRef.get(this.configService.get('BASE_URL')+'/characters')
      const character_books: {}[] =  data.filter( ({books}:{books:[]}) => books.findIndex(e => e === book_url) !== -1)

      if(!sort && !filter){
        return [character_books, this.metadataFunc(character_books)]
      }
      if(filter && !sort){
        characterData = character_books.filter( (e) => e['gender'] === filter )
        metadata = this.metadataFunc(characterData)
        return [characterData,metadata]
      }
      if(filter && sort){
        const filtered: {}[] = character_books.filter( (e) => e['gender'] === filter )

        switch (sort) {

          case Sort.age:
            characterData = filtered.sort(this.dynamicSort(Sort.age))
            metadata = this.metadataFunc(data)
            return [characterData,metadata]
  
          case Sort.gender:
            characterData = filtered.sort(this.dynamicSort(Sort.gender))
            metadata = this.metadataFunc(data)
            return [characterData,metadata]
          
          case Sort.name:
            characterData = filtered.sort(this.dynamicSort(Sort.name))
            metadata = this.metadataFunc(data)
            return [characterData,metadata]
      
        }
      }

      if(!filter && sort){

        switch (sort) {

          case Sort.age:
            characterData = character_books.sort(this.dynamicSort(Sort.age))
            metadata = this.metadataFunc(data)
            return [characterData,metadata]
  
          case Sort.gender:
            characterData = character_books.sort(this.dynamicSort(Sort.gender))
            metadata = this.metadataFunc(data)
            return [characterData,metadata]
          
          case Sort.name:
            characterData = character_books.sort(this.dynamicSort(Sort.name))
            metadata = this.metadataFunc(data)
            return [characterData,metadata]
      
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

  metadataFunc(param:{}[]):MetaData{
    return {
      totalAge:0,
      totalCharacters:param.length
    }
  }
}
