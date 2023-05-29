import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoresRepository } from './stores.repository';
import { Stores } from './stores.entity';
import { StoresSearchDto } from './dto/stores.dto';
import { CreateStoresDto } from './dto/createStores.dto';
import axios from 'axios';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';




@Injectable()
export class StoresService {
        constructor(
        @InjectRepository(StoresRepository)
        private storesRepository: StoresRepository,     
        ) {}


    async processCSVFile(inputFile: string): Promise<void> {
        const batchSize = 100;
     
        return new Promise<void>((resolve, reject) => {
            let currentBatch: any[] = []
            createReadStream(inputFile, { encoding: 'utf-8' })
                .pipe(csvParser())
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    reject(error);
                })
                .on('data', async (row: any) => {
                    if (row['상세영업상태코드'] === '01') {
                        currentBatch.push(row); 

                    
                        if (currentBatch.length === batchSize) {
                            await this.storesRepository.processCSVFile(currentBatch); 
                            currentBatch = []; 
                        }
                    }
                })
                .on('end', async () => {
                    if (currentBatch.length > 0) {
                        await this.storesRepository.processCSVFile(currentBatch);
                    }
                    resolve();
                })
                .on('finish', () => {
                    console.log('CSV processing completed.');
                });
        });
    }

 

        async updateCoordinates(): Promise<void> {
        try {
        
            const stores = await this.storesRepository.getStoreAddressId();
            
            for (const store of stores) {
                
                const {address, storeId} = store;

                try {
                    const coordinates = await this.storesRepository.getCoordinate(address);
                 
                    const La = coordinates[0]; 
                    const Ma = coordinates[1]; 
                   
              
                    await this.storesRepository.updateCoord(La,Ma,storeId);

                    console.log(`Updated coordinates for address: ${address}`, La,Ma, storeId);
                } catch (error) {
                    console.error(`Error updating coordinates for address: ${address}`, error);
                }
            }

      
        } catch (error) {
            console.error('Error occurred during database operation:', error);
        }
    }


    private apiUrl = 'https://get.geojs.io/v1/ip/geo.json';
    async getGeolocation(): Promise<any> {
        const response = await axios.get(this.apiUrl);
       
        const myLatitude = response.data.latitude;
        const myLongitude = response.data.longitude;
        console.log(myLatitude, myLongitude)
        return response.data;
    }

    //     const url = `https://dapi.kakao.com/v2/local/search/keyword.json&x=${myLongitude}&y=${myLatitude}`;

    //     const restApiKey = '800b8fe2427efbffbef3bc6fe96a5464';
    //     const headers = { Authorization: 'KakaoAK ' + restApiKey };
    //     const response2 = await axios.get(url, { headers });
    //     console.log(response2)
    //     const boundary = response2.data.documents[0].region.boundary;
    //     const southwest = boundary.southwest;
    //     const northeast = boundary.northeast;

    //     const southWestLat = southwest.latitude;
    //     const southWestLng = southwest.longitude;
    //     const northEastLat = northeast.latitude;
    //     const northEastLng = northeast.longitude;

    //     console.log('Southwest Coordinate:', southWestLat, southWestLng);
    //     console.log('Northeast Coordinate:', northEastLat, northEastLng);
    //     const query = 'SELECT * FROM your_table WHERE latitude >= southwest_lat AND latitude <= northeast_lat AND longitude >= southwest_lng AND longitude <= northeast_lng'; 
       
    // }




    // async getViewName


    async searchStores(keyword: string): Promise <StoresSearchDto[]> {
        const searchStores = await this.storesRepository.searchStores(keyword)
        return searchStores;
    }
    
    async getOneStore(storeId:number): Promise<Stores> {
        const getOneStore = await this.storesRepository.findOne({
            where: { storeId : storeId}, relations: ['reviews']
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