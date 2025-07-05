import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  async login(dto: LoginDto) {
    console.log('Login attempt for email:', dto.email);
    
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      console.log('User not found for email:', dto.email);
      throw new UnauthorizedException('User not found');
    }
    
    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    
    if (!user.password) {
      console.log('User has no password');
      throw new UnauthorizedException('Invalid user data');
    }
    
    const isMatch = await bcrypt.compare(dto.password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    
    const payload = { sub: user.id, email: user.email, roles: user.roles?.map(r => r.name) };
    console.log('JWT payload:', payload);
    
    const token = this.jwtService.sign(payload);
    
    const result = {
      access_token: token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles: user.roles },
    };
    
    console.log('Login successful, returning result');
    return result;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('User already exists');
    const user = await this.usersService.create({ ...dto });
    const payload = { sub: user.id, email: user.email, roles: user.roles?.map(r => r.name) };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles: user.roles },
    };
  }

  async getProfile(userId: number) {
    console.log('Getting profile for userId:', userId);
    const user = await this.usersService.findOne(userId);
    if (!user) {
      console.log('User not found for userId:', userId);
      throw new UnauthorizedException('User not found');
    }
    console.log('Profile found:', { id: user.id, email: user.email });
    return user;
  }
} 