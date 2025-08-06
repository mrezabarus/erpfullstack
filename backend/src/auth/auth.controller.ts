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
    ){
        //return this.authService.login(email, password);
        const data = await this.authService.login(email, password);

        res.cookie('access_token', data.access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60,
            sameSite: 'lax',
            path: '/',
        })
        return { user: data.user };
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
            secure: false,
            sameSite: 'lax',
            path: '/',
        });

        return { message: 'Logout success' };
    }
}
