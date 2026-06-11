import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/entities/user.entity';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE, TRANSACTION_STATUS } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import {
  mapToItemEntity,
  mapToProductEntity,
} from '@shared/helpers/commerce-mapping.helper';

import { CreateItemDto, UpdateItemDto } from './dtos/item.dto';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { ItemService } from './services/item.service';
import { ProductService } from './services/product.service';
import { TransactionService } from './services/transaction.service';

@ApiTags('Partner Commerce')
@ApiBearerAuth()
@Controller('partner/commerce')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.PARTNER, ROLE.ADMIN)
export class PartnerCommerceController {
  constructor(
    private readonly productService: ProductService,
    private readonly itemService: ItemService,
    private readonly transactionService: TransactionService,
  ) {}

  // --- Products ---

  @Post('products')
  public async createProduct(
    @RequestUser() user: any,
    @Body() dto: CreateProductDto,
  ): Promise<HttpResponse> {
    const mapped = mapToProductEntity(dto);
    return this.productService.create({
      ...mapped,
      sellerId: user.id,
    });
  }

  @Patch('products/:id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const mapped = mapToProductEntity(dto);
    const isAdmin = user.role === ROLE.ADMIN;
    return this.productService.updateProduct(id, mapped, user.id, isAdmin);
  }

  @Delete('products/:id')
  public async deleteProduct(
    @Param('id') id: string,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.productService.deleteProduct(id, user.id, isAdmin);
  }

  // --- Items ---

  @Post('items')
  public async createItem(
    @RequestUser() user: any,
    @Body() dto: CreateItemDto,
  ): Promise<HttpResponse> {
    const mapped = mapToItemEntity(dto);
    return this.itemService.create({
      ...mapped,
      creatorId: user.id,
    });
  }

  @Patch('items/:id')
  public async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const mapped = mapToItemEntity(dto);
    const isAdmin = user.role === ROLE.ADMIN;
    return this.itemService.updateItem(id, mapped, user.id, isAdmin);
  }

  @Delete('items/:id')
  public async deleteItem(
    @Param('id') id: string,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.itemService.deleteItem(id, user.id, isAdmin);
  }

  // --- Transactions ---

  @Get('transactions')
  public async getMyTransactions(
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.transactionService.getTransactionBySellerId(user.id, isAdmin);
  }

  @Patch('transactions/:id/decision')
  public async makeDecision(
    @Param('id') id: string,
    @Body('decision') decision: TRANSACTION_STATUS,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.transactionService.makeDecision(id, decision, user.id, isAdmin);
  }
}
