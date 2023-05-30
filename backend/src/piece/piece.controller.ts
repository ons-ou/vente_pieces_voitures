import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { PieceService } from './piece.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { Piece } from './entities/piece.entity';
import { CrudController } from 'src/generic/crud/Crud.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/editFileName';
import path from 'path';

@Controller('pieces')
export class PieceController extends CrudController<
  Piece,
  CreatePieceDto,
  UpdatePieceDto
> {
  constructor(private readonly pieceService: PieceService) {
    super(pieceService);
  }

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async addPiece(
    @Body() dto: CreatePieceDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
    const imagePath =`uploads/${image.filename}`;
    dto.image = imagePath;
    }
    return this.pieceService.add(dto);
  }

  @Get('search')
  async searchPieces(
    @Query('brand') brand: string,
    @Query('model') model: string,
    @Query('motorization') motorization: string,
    @Query('sortBy') sortBy: string,
  ): Promise<{data:Piece[]}> {
    const results = await this.pieceService.searchPieces(
      brand,
      model,
      motorization,
      sortBy,
    );
    return (results);
  }
  @Get('search/category/:id')
  async searchPiecesByCategory(@Param('id') id:number):Promise<{data:Piece[]}>{
    return await this.pieceService.searchPiecesByCategory(id);
  }
  @Get('search/subcategory/:id')
  async searchPiecesBySubCategory(@Param('id') id:number):Promise<{data:Piece[]}>{
    return await this.pieceService.searchPiecesBySubCategory(id);
  }
}
