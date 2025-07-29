import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { QuoteService } from './quote.service';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { CreateQuoteDto } from './dto/create-quote.dto';

@UseGuards(JwtGuard)
@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Post()
  createQuote(@GetUser('id') userId: string, @Body() dto: CreateQuoteDto) {
    return this.quoteService.createQuote(userId, dto.postId, dto.content);
  }

  @Get(':postId')
  getQuotes(@Param('postId') postId: string) {
    return this.quoteService.getQuotesForPost(postId);
  }

  @Patch(':quoteId')
  editQuote(
    @GetUser('id') userId: string,
    @Param('quoteId') quoteId: string,
    @Body() dto: EditQuoteDto,
  ) {
    return this.quoteService.editQuote(userId, quoteId, dto.content);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':quoteId')
  deleteQuote(
    @GetUser('id') userId: string,
    @Param('quoteId') quoteId: string,
  ) {
    return this.quoteService.deleteQuote(userId, quoteId);
  }

  @Get(':postId/count')
  getQuoteCount(@Param('postId') postId: string) {
    return this.quoteService.getQuoteCountForPost(postId);
  }
}
