import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../infrastructure/database/prisma.service';

import { CreateOemProfileDto } from './dto/create-oem-profile.dto';

@Injectable()
export class OemProfileService {
  constructor(private prisma: PrismaService) {}

  async getByUserId(userId: string) {
    const profile = await this.prisma.oemProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('OEM profile not found. Please create one first.');
    return profile;
  }

  async create(userId: string, dto: CreateOemProfileDto) {
    const existing = await this.prisma.oemProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('OEM profile already exists for this user');

    const { firmType, firmSize, ...rest } = dto;
    return this.prisma.oemProfile.create({
      data: {
        ...rest,
        firmType: firmType as unknown as Prisma.OemProfileCreateInput['firmType'],
        firmSize: firmSize as unknown as Prisma.OemProfileCreateInput['firmSize'],
        user: { connect: { id: userId } },
      },
    });
  }

  async update(userId: string, dto: Partial<CreateOemProfileDto>) {
    const existing = await this.prisma.oemProfile.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('OEM profile not found');

    return this.prisma.oemProfile.update({
      where: { userId },
      data: dto as Prisma.OemProfileUpdateInput,
    });
  }

  /**
   * Check if user qualifies for 15% fee discount
   */
  async isDiscountEligible(userId: string): Promise<boolean> {
    const profile = await this.prisma.oemProfile.findUnique({ where: { userId } });
    if (!profile) return false;
    return profile.isMSE || profile.isStartup || profile.isLocalSupplier;
  }
}
