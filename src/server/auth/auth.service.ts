import { JwtService } from '@nestjs/jwt'; // <= utilise cette lib elle est fait pour nest


// Le paradigm un peu de Nest c'est de crée un nouveau module par service ou controller.
// Comme ça tu as pas tout qui va finir stocker dans un même dossier "service"
// Tu sépares les concerns

// Dans la même idée c'est bien de ne pas accéder prisma tel-quel mais d'utiliser des services 
// pour accéder à des données que tu veux

export class AuthService {
    constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UserService
    ) {}

    createUUID(): string {
        return uuidv4(); // Generates a new UUID
      }
      async isUUIDExistingInDB(id: string): Promise<boolean> {
        const user = await this.userService.findUser({
          id
        });
        return user !== null;
      }
      createJWT(userId: number, role: string): string {
        const payload = { userId, role } as JWTPayload;
        return jwtService.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      }
    
      verifyJWT(JWT: string): JWTPayload | null {
        try {
          const decoded = jwt.verify(JWT, process.env.JWT_SECRET) as JWTPayload;
          return decoded;
        } catch (error) {
          // Handle the error (log it, return null, throw a custom error, etc.)
          console.error('JWT verification failed:', error.message);
          return null; // Or handle it in another appropriate way
        }
      }
}