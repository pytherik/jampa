import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const newBookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    const data = await getLinkPreview(dto.link);
    console.log(data);
    // console.log(data['favicon'][0]);
    return newBookmark;
  }

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const editedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
        userId: userId,
      },
      data: {
        ...dto,
      },
    });

    return editedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
}
