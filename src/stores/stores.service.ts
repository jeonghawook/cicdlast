import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoresRepository } from './stores.repository';
import { Stores } from './stores.entity';
import { StoresSearchDto } from './dto/stores.dto';
import { CreateStoresDto } from './dto/createStores.dto';

@Injectable()
export class StoresService {

        constructor(
        @InjectRepository(StoresRepository)
        private storesRepository: StoresRepository,
     
    ){}

    

    async searchStores(keyword: string): Promise <StoresSearchDto[]> {
        const searchStores = await this.storesRepository.searchStores(keyword)
        return searchStores;
    }
    
    async getOneStore(storeId:number): Promise<Stores> {
        const getOneStore = await this.storesRepository.findOne({
            where: { storeId : storeId}
        },)//{ relations: ['reviews'] }    
        console.log(getOneStore)    
    return getOneStore;
    }


    async createStore(createUserDto: CreateStoresDto): Promise<Stores> {
        const { 
        storeName,
        category,
        description,
        maxWaitingCnt,
        currentWaitingCnt,
        Ma,
        La,
        tableForTwo,
        tableForFour, } = createUserDto;
        const store = this.storesRepository.create({
            storeName,
            category,
            description,
            maxWaitingCnt,
            currentWaitingCnt,
            Ma,
            La,
            tableForTwo,
            tableForFour
        })
        await this.storesRepository.save(store)
        return store
    }
}
    //   “storeId” : number = 1  
    //     “storeName”: string = “burgerKing”,
    //     “category”: string = “양식”, 
    //     “rating”: number = 4.6,
    //     “waiting”: number = 7,
    //     “distance”: number = 44m

    //         ”storeId” : number = 1,
    // “storeName”: string = “Shake Shack”,
    // “category”: string = “양식”,
    // “rating”: number = 4.4,
    // “waiting”: number = 8,
    // “distance”: number = 112(미터?)
    // “reviews”: Object[] = [
    //     {
    //         “username”: string = “이겸*”,
    //         “review”: string = “존맛탱”,
    //     },
    //     {
    //         “username”: string = “최혜*”,
    //         “review”: string = “맛있어요”,
    //     },
    // ],