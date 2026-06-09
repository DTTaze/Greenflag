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
import { TRANSACTION_STATUS } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import {
  mapToItemEntity,
  mapToProductEntity,
} from '@shared/helpers/commerce-mapping.helper';

import { CreateItemDto, PurchaseItemDto, UpdateItemDto } from './dtos/item.dto';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
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
  public async getAllProducts(): Promise<HttpResponse> {
    const products = await this.productService.findAll();
    return {
      success: true,
      message: 'Get all products success',
      data: products,
    };
  }

  @Get('products/:id')
  public async getProductById(@Param('id') id: string): Promise<HttpResponse> {
    const product = await this.productService.findByID(id);
    return {
      success: true,
      message: 'Get product success',
      data: product,
    };
  }

  @Post('products')
  public async createProduct(
    @RequestUser() user: User,
    @Body() dto: CreateProductDto,
  ): Promise<HttpResponse> {
    const mapped = mapToProductEntity(dto);
    const product = await this.productService.create({
      ...mapped,
      sellerId: user.id,
    });
    return {
      success: true,
      message: 'Create product success',
      data: product,
    };
  }

  @Patch('products/:id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<HttpResponse> {
    const mapped = mapToProductEntity(dto);
    const product = await this.productService.updateByID(id, mapped);
    return {
      success: true,
      message: 'Update product success',
      data: product,
    };
  }

  @Delete('products/:id')
  public async deleteProduct(@Param('id') id: string): Promise<HttpResponse> {
    await this.productService.deleteByID(id);
    return {
      success: true,
      message: 'Delete product success',
    };
  }

  // --- Items ---

  @Get('items')
  public async getAllItems(): Promise<HttpResponse> {
    const items = await this.itemService.findAll(
      {},
      { relations: { creator: true } },
    );
    return {
      success: true,
      message: 'Get all items success',
      data: items,
    };
  }

  @Get('items/:id')
  public async getItemById(@Param('id') id: string): Promise<HttpResponse> {
    const item = await this.itemService.findOne(
      { id },
      { relations: { creator: true } },
    );
    return {
      success: true,
      message: 'Get item success',
      data: item,
    };
  }

  @Post('items')
  public async createItem(
    @RequestUser() user: User,
    @Body() dto: CreateItemDto,
  ): Promise<HttpResponse> {
    const mapped = mapToItemEntity(dto);
    const item = await this.itemService.create({
      ...mapped,
      creatorId: user.id,
    });
    return {
      success: true,
      message: 'Create item success',
      data: item,
    };
  }

  @Patch('items/:id')
  public async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<HttpResponse> {
    const mapped = mapToItemEntity(dto);
    const item = await this.itemService.updateByID(id, mapped);
    return {
      success: true,
      message: 'Update item success',
      data: item,
    };
  }

  @Delete('items/:id')
  public async deleteItem(@Param('id') id: string): Promise<HttpResponse> {
    await this.itemService.deleteByID(id);
    return {
      success: true,
      message: 'Delete item success',
    };
  }

  @Post('items/:itemId/purchase')
  public async purchaseItem(
    @RequestUser() user: User,
    @Param('itemId') itemId: string,
    @Body() dto: PurchaseItemDto,
  ): Promise<HttpResponse> {
    const result = await this.itemService.purchaseItem(user.id, itemId, dto);
    return {
      success: true,
      message: result.message,
      data: { jobId: result.jobId },
    };
  }

  // --- Transactions ---

  @Get('transactions/buyer')
  public async getTransactionsByBuyer(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const txs = await this.transactionService.getTransactionByBuyerId(user.id);
    return {
      success: true,
      message: 'Get transactions by buyer success',
      data: txs,
    };
  }

  @Get('transactions/seller')
  public async getTransactionsBySeller(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const txs = await this.transactionService.getTransactionBySellerId(user.id);
    return {
      success: true,
      message: 'Get transactions by seller success',
      data: txs,
    };
  }

  @Get('transactions/:id')
  public async getTransactionById(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const tx = await this.transactionService.getTransactionById(id);
    return {
      success: true,
      message: 'Get transaction success',
      data: tx,
    };
  }

  @Patch('transactions/:id/decision')
  public async makeDecision(
    @Param('id') id: string,
    @Body('decision') decision: TRANSACTION_STATUS,
  ): Promise<HttpResponse> {
    const tx = await this.transactionService.makeDecision(id, decision);
    return {
      success: true,
      message: 'Make decision success',
      data: tx,
    };
  }

  @Post('transactions/:id/cancel')
  public async cancelTransaction(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const tx = await this.transactionService.cancelTransactionById(id);
    return {
      success: true,
      message: 'Cancel transaction success',
      data: tx,
    };
  }

  @Get('transactions/all')
  public async getAllTransactions(): Promise<HttpResponse> {
    const txs = await this.transactionService.findAll();
    return {
      success: true,
      message: 'Get all transactions success',
      data: txs,
    };
  }

  @Get('transactions/status/:status')
  public async getAllTransactionsByStatus(
    @Param('status') status: TRANSACTION_STATUS,
  ): Promise<HttpResponse> {
    const txs = await this.transactionService.findAll({ status });
    return {
      success: true,
      message: 'Get all transactions success',
      data: txs,
    };
  }
}
