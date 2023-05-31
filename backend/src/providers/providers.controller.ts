import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { Providers } from './entities/providers.entity';
import { CreateprovidersDto } from './dto/create-providers.dto';
import { UpdateprovidersDto } from './dto/update-providers.dto';
import { ProvidersService } from './providers.service';
import { CrudController } from '../generic/crud/crud.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName } from '../editFileName';
import { diskStorage } from 'multer';
import { Piece } from '../piece/entities/piece.entity';
import SearchDto from './dto/providerSearch.dto';

@Controller('providers')
export class ProvidersController extends CrudController<
  Providers,
  CreateprovidersDto,
  UpdateprovidersDto
> {
  constructor(private readonly providerService: ProvidersService) {
    super(providerService);
  }


  @Get('')
  async getAllProviders(
    @Query() query: SearchDto,
  ): Promise<any> {
    const { active } = query;
    let p;
    let nb;
    if (active === 'bloques') {
      p = await this.providerService.findAllWithQuery(
        query,
        'deletedAt IS NOT NULL',
        true,
      );
      nb = await this.providerService.getCountWithQuery(
        'deletedAt IS NOT NULL',
        true,
      );
    } else if (active === 'actifs') {
      p = await this.providerService.findAll(query);
      nb = await this.providerService.getCount();
    } else {
      p = await this.providerService.getAllProviders(query);
      nb = await this.providerService.countAllProviders();
    }
    return { data: p, count: nb };
  }

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../frontend/public',
        filename: editFileName,
      }),
    }),)
  async addProvider(
    @UploadedFile() image: Express.Multer.File,
    @Body() provider: CreateprovidersDto): Promise<Providers> {
      if (image) {
        provider.logo = image.filename;
      }
      return this.providerService.addProvider(provider);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../frontend/public',
        filename: editFileName,
      }),
    }),)
  async updateProvider(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() provider: UpdateprovidersDto): Promise<Providers> {
      if (image) {
        provider.logo = image.filename;
      }
      return this.providerService.update(id, provider);
  }


  @Get('all/:id')
  async getProvider(@Param('id', ParseIntPipe) id: number): Promise<Providers> {
    return this.providerService.findOne(id, true);
  }

  @Delete('delete/:id')
  async deleteProvider(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ count: number }> {
    return this.providerService.deleteProvider(id);
  }

  @Get('restore/:id')
  async restoreProvider(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Providers> {
    return this.providerService.restoreProvider(id);
  }
}
