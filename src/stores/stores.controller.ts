import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Stores } from './stores.entity';
import { StoresService } from './stores.service';
import { StoresSearchDto } from './dto/stores.dto';
import { CreateStoresDto } from './dto/createStores.dto';


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


    @Get('/:storeId')
    getOneStore(@Param('storeId') storeId: number): Promise<Stores> {
        console.log("check")
        return this.storesService.getOneStore(storeId)
    }

}
