import { IsNotEmpty } from "class-validator";


export class CreateStoresDto {
    @IsNotEmpty()
    storeName: string;
    category: string;
    description: string;
    maxWaitingCnt: number;
    currentWaitingCnt: number;
    Ma: number;
    La: number;
    address: string;
    @IsNotEmpty()
    tableForTwo: number;
    tableForFour: number;
    //   “storeId” : number = 1  
    //     “storeName”: string = “burgerKing”,
    //     “category”: string = “양식”, 
    //     “rating”: number = 4.6,
    //     “waiting”: number = 7,
    //     “distance”: number = 44m
}