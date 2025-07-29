import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) {}

  async createQuote(userId: string, postId: string, content: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Quoted post not found');

    return this.prisma.quote.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        user: true,
        post: true,
      },
    });
  }

  async getQuotesForPost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        quotes: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    return post.quotes;
  }

  async editQuote(userId: string, quoteId: string, newContent: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.quote.update({
      where: { id: quoteId },
      data: { content: newContent },
    });
  }

  async deleteQuote(userId: string, quoteId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.quote.delete({ where: { id: quoteId } });
  }

  async getQuoteCountForPost(postId: string) {
    return this.prisma.quote.count({ where: { postId } });
  }
}
