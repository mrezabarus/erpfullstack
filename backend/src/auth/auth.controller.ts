import { Body, Controller, HttpCode, HttpStatus,Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(
      @Res({ passthrough: true }) res: Response,
      @Body('email') email: string,
      @Body('password') password: string,
    ) {
      const data = await this.authService.login(email, password);
    
     res.cookie('access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'none',   // ❌ jangan conditional, harus 'none' biar cross-domain
          path: '/',
          maxAge: 1000 * 60 * 60, // 1 jam
        });
    
      // Juga kembalikan di body supaya Postman & client API bisa baca
      return {
        user: data.user,
        access_token: data.access_token,
      };
    }

    @Get('me')
    getMe(@Req() req: Request){
        const token = req.cookies?.access_token;
        if(!token) throw new UnauthorizedException('Tidak ada token');

        return this.authService.getMeFromToken(token);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response){
        res.clearCookie('access_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'none',   // harus sama kayak waktu set
          path: '/',
        });

        return { message: 'Logout success' };
    }
}
