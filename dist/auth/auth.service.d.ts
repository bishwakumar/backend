import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerInput: RegisterInput): Promise<AuthResponse>;
    login(loginInput: LoginInput): Promise<AuthResponse>;
    validateUser(userId: string): Promise<User | null>;
}
