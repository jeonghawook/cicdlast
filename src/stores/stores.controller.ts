import { Body, Controller, Get, Param, Post, Query, Render, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { Stores } from './stores.entity';
import { StoresService } from './stores.service';
import { StoresSearchDto } from './dto/stores.dto';
import { CreateStoresDto } from './dto/createStores.dto';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import { error } from 'console';

@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) { }
    ///api/stores/search?keyword=햄버거
    @Get('/search')
    searchStores(@Query('keyword') keyword: string): Promise<StoresSearchDto[]> {
        return this.storesService.searchStores(keyword);
    }


    @Post('/')
    @UsePipes(ValidationPipe)
    createStore(@Body() createStoreDto: CreateStoresDto): Promise<Stores> {
        return this.storesService.createStore(createStoreDto)
    }

    // @Get('/locations')
    // async getGeolocation(): Promise<any> {
    //     const geolocationData = await this.storesService.getGeolocation();
    //     console.log(geolocationData);
    //     return geolocationData;
    // } 

    @Get('/locations')
    async getGeolocation(): Promise<any> {
        console.log("check")
        const geolocationData = await this.storesService.getGeolocation();
        console.log(geolocationData)
        return geolocationData;
    }


    @Post('/process')
    async processCSV(): Promise<void> {

        const inputFile = path.resolve('src/stores/csv/111.csv');

        await this.storesService.processCSVFile(inputFile);
    }


    @Post('update-coordinates')
    async updateCoordinates(): Promise<string> {
        await this.storesService.updateCoordinates();
        return 'Coordinates updated successfully';
    }



    @Get('/:storeId')
    getOneStore(@Param('storeId') storeId: number): Promise<Stores> {
        console.log("check")
        return this.storesService.getOneStore(storeId)
    }
    // @Get()
    // root(@Res() res: Response) {
    //     return res.render(
    //         this.storesService.getViewName(),
    //         { message: 'Hello world!' },
    //     );
    // }
}
