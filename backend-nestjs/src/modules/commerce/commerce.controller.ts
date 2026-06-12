import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/entities/user.entity';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';

import { PurchaseItemDto } from './dtos/item.dto';
import { ItemService } from './services/item.service';
import { ProductService } from './services/product.service';
import { TransactionService } from './services/transaction.service';

@ApiTags('Commerce')
@Controller('commerce')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CommerceController {
  constructor(
    private readonly productService: ProductService,
    private readonly itemService: ItemService,
    private readonly transactionService: TransactionService,
  ) {}

  // --- Products ---

  @Get('products')
  public async getAllProducts(
    @Query('showDeleted') showDeleted?: string,
  ): Promise<HttpResponse> {
    const withDeleted = showDeleted === 'true';
    return this.productService.findAllProducts({ withDeleted });
  }

  @Get('products/:id')
  public async getProductById(@Param('id') id: string): Promise<HttpResponse> {
    return this.productService.getProductDetail(id);
  }

  // --- Items ---

  @Get('items')
  public async getAllItems(
    @Query('showDeleted') showDeleted?: string,
  ): Promise<HttpResponse> {
    const withDeleted = showDeleted === 'true';
    return this.itemService.findAll(
      {},
      { relations: { creator: true }, withDeleted },
    );
  }

  @Get('items/:id')
  public async getItemById(@Param('id') id: string): Promise<HttpResponse> {
    return this.itemService.findOne({ id }, { relations: { creator: true } });
  }

  @Post('items/:itemId/purchase')
  public async purchaseItem(
    @RequestUser() user: User,
    @Param('itemId') itemId: string,
    @Body() dto: PurchaseItemDto,
  ): Promise<HttpResponse> {
    return this.itemService.purchaseItem(user.id, itemId, dto);
  }

  // --- Transactions ---

  @Get('transactions/buyer')
  public async getTransactionsByBuyer(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.transactionService.getTransactionByBuyerId(user.id);
  }

  @Get('transactions/:id')
  public async getTransactionById(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    return this.transactionService.getTransactionById(id);
  }

  @Post('transactions/:id/cancel')
  public async cancelTransaction(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.transactionService.cancelTransactionById(id, user.id, false);
  }
}
