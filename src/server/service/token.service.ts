import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; // UUID library
import { PrismaService } from './prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  // Existing method to validate a token
  // Method to create a new token
  createUUID(): string {
    return uuidv4(); // Generates a new UUID

  }
  async isUUIDExistingInDB(uuid: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        uuid: uuid,
      },
    });
    return user !== null;
  }
    createToken(userId: number, role: string): string {
      const payload = { userId, role };
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
  
  // Additional methods as needed...
}
