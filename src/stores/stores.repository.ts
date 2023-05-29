import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { Stores } from "./stores.entity";
import { StoresSearchDto } from "./dto/stores.dto";
import axios from 'axios';
@Injectable()
export class StoresRepository extends Repository<Stores>{

    constructor(dataSource: DataSource) {
        super(Stores, dataSource.createEntityManager());
    }


    async searchStores(keyword: string): Promise<StoresSearchDto[]> {
        const searchStores = await this.createQueryBuilder('stores')
            .select(['stores.storeId', 'stores.storeName', 'stores.category', 'stores.maxWaitingCnt'])
            .where('stores.storeName ILIKE :keyword OR stores.category ILIKE :keyword', { keyword: `%${keyword}%` })
            .getMany();
        //ILIKE = case insensitive
        return searchStores;
    }


    async processCSVFile(rows: any): Promise<void> {
        for (const rowData of rows) {

            {
                const La = 0;
                const Ma = 0;
                const description = 'string';
                const maxWaitingCnt = 0;
                const currentWaitingCnt = 0;
                const tableForTwo = Math.floor(Math.random() * 10);
                const tableForFour = Math.floor(Math.random() * 10);
                const storeName = rowData['사업장명'];
                const category = rowData['위생업태명'];
                const address = rowData['도로명전체주소'];

                const store = this.create({
                    storeName,
                    description,
                    maxWaitingCnt,
                    currentWaitingCnt,
                    La,
                    Ma,
                    tableForFour,
                    tableForTwo,
                    category,
                    address,
                });

                try {
                    const result = await this.save(store);
                    console.log('Inserted', result, 'row:', store);
                } catch (error) {
                    console.error('Error occurred during insert:', error);
                }
            }
        }
    }

    async getStoreAddressId() {
        return await this.find({ select: ['storeId', 'address'] })
    }

    async getCoordinate(address: string): Promise<any> {
        const url =
            'https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURIComponent(address);
        const restApiKey = '800b8fe2427efbffbef3bc6fe96a5464';
        const headers = { Authorization: 'KakaoAK ' + restApiKey };

        try {
            const response = await axios.get(url, { headers });
            const result = response.data;

            if (result.documents.length !== 0) {
                const resultAddress = result.documents[0].address;
                const coordinates = [resultAddress.y, resultAddress.x];
                return coordinates;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Error fetching coordinates from Kakao API: ' + error.message);
        }
    }

    async updateCoord(La: number, Ma: number, storeId: number): Promise<any> {
        await this.update(storeId, { La, Ma });
    }
}
