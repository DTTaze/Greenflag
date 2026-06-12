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

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE, TRANSACTION_STATUS } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import {
  mapToItemEntity,
  mapToProductEntity,
} from '@shared/helpers/commerce-mapping.helper';

import { UpdateItemDto } from './dtos/item.dto';
import { UpdateProductDto } from './dtos/product.dto';
import { ItemService } from './services/item.service';
import { ProductService } from './services/product.service';
import { TransactionService } from './services/transaction.service';

@ApiTags('Admin Commerce')
@ApiBearerAuth()
@Controller('admin/commerce')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminCommerceController {
  constructor(
    private readonly productService: ProductService,
    private readonly itemService: ItemService,
    private readonly transactionService: TransactionService,
  ) {}

  // --- Products ---

  @Patch('products/:id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<HttpResponse> {
    const mapped = mapToProductEntity(dto);
    return this.productService.updateProduct(id, mapped, undefined, true);
  }

  @Delete('products/:id')
  public async deleteProduct(@Param('id') id: string): Promise<HttpResponse> {
    return this.productService.deleteProduct(id, undefined, true);
  }

  // --- Items ---

  @Patch('items/:id')
  public async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<HttpResponse> {
    const mapped = mapToItemEntity(dto);
    return this.itemService.updateItem(id, mapped, undefined, true);
  }

  @Delete('items/:id')
  public async deleteItem(@Param('id') id: string): Promise<HttpResponse> {
    return this.itemService.deleteItem(id, undefined, true);
  }

  // --- Transactions ---

  @Get('transactions')
  public async getAllTransactions(): Promise<HttpResponse> {
    return this.transactionService.findAll(undefined, {
      relations: {
        receiverInformation: true,
        item: true,
        product: true,
        buyer: { profile: true },
        seller: { profile: true },
      },
      select: {
        buyer: {
          id: true,
          username: true,
          email: true,
          profile: { fullName: true },
        },
        seller: {
          id: true,
          username: true,
          email: true,
          profile: { fullName: true },
        },
      } as any,
    });
  }

  @Get('transactions/status/:status')
  public async getAllTransactionsByStatus(
    @Param('status') status: TRANSACTION_STATUS,
  ): Promise<HttpResponse> {
    return this.transactionService.findAll(
      { status },
      {
        relations: {
          receiverInformation: true,
          item: true,
          product: true,
          buyer: { profile: true },
          seller: { profile: true },
        },
        select: {
          buyer: {
            id: true,
            username: true,
            email: true,
            profile: { fullName: true },
          },
          seller: {
            id: true,
            username: true,
            email: true,
            profile: { fullName: true },
          },
        } as any,
      },
    );
  }

  @Patch('transactions/:id/decision')
  public async makeDecision(
    @Param('id') id: string,
    @Body('decision') decision: TRANSACTION_STATUS,
  ): Promise<HttpResponse> {
    return this.transactionService.makeDecision(id, decision, undefined, true);
  }

  @Post('transactions/:id/cancel')
  public async cancelTransaction(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    return this.transactionService.cancelTransactionById(id, undefined, true);
  }
}
