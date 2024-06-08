import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('companys')
  getAllCompanys() {
    return this.authService.getAllCompanys();
  }

  @Get('company/:id')
  getOneCompany(@Param('id') id: string) {
    return this.authService.getOneCompany(id);
  }

  // update status
  @Put('company/status/:id')
  changeStatusCompany(@Param('id') id: string) {
    return this.authService.changeStatusCompany(id);
  }

  // update full
  @Put('company/:id')
  updateCompany(@Param('id') id: string, @Body() dto: AuthDto) {
    return this.authService.updateCompany(id, dto);
  }

  @Delete('company/:id')
  deleteCompany(@Param('id') id: string) {
    return this.authService.deleteCompany(id);
  }

  // Authorization
  @UsePipes(ValidationPipe)
  @Post('regis')
  regis(@Body() dto: AuthDto) {
    return this.authService.regis(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Get('checkadmin')
  checkAdmin(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization;
    if (token) {
      return this.authService.checkAdmin(token, res);
    }
  }

  @Get('checkcompany')
  checkCompany(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization;
    if (token) {
      return this.authService.checkCompany(token, res);
    }
  }
}
