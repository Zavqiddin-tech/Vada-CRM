import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { Auth, AuthDocument } from './auth.schema';

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async getAllCompanys() {
    return await this.authModel.find({ session: { $eq: 'company' } });
  }

  async getOneCompany(id: string) {
    return await this.authModel.findById(id).select('-password');
  }

  async changeStatusCompany(id: string) {
    const company = await this.authModel.findById(id);
    await this.authModel.findByIdAndUpdate(
      company.id,
      { status: !company.status },
      { new: true },
    );
    return await this.authModel.find({ session: { $eq: 'company' } });
  }

  async updateCompany(id: string, dto: AuthDto) {
    if (dto.password) {
      const hash = await argon.hash(dto.password);
      await this.authModel.findByIdAndUpdate(
        id,
        { ...dto, password: hash },
        { new: true },
      );
      return await this.authModel.find({ session: { $eq: 'company' } });
    }

    await this.authModel.findByIdAndUpdate(id, { dto });
    return await this.authModel.find({ session: { $eq: 'company' } });
  }

  async deleteCompany(id: string) {
    await this.authModel.findByIdAndDelete(id);
  }

  // Authorization
  async regis(dto: AuthDto) {
    const admin = await this.authModel.find({ role: { $eq: dto.role } });
    if (admin[0] && admin[0].role === 'admin') {
      return { message: 'mumkin emas' };
    }
    const oldCompany = await this.authModel.find({ email: { $eq: dto.email } });
    if (oldCompany[0]) {
      return { message: 'Bu foydalanuvchi mavjud' };
    }

    const hash = await argon.hash(dto.password);
    await this.authModel.create({
      fname: dto.fname,
      lname: dto.lname,
      phone: dto.phone,
      date: dto.date,
      status: dto.status,
      email: dto.email,
      password: hash,
      role: dto.role,
    });

    return await this.authModel.find({ email: { $eq: dto.email } });
  }

  async login(dto: AuthDto) {
    const company = await this.authModel.find({ email: { $eq: dto.email } });
    console.log(dto);
    console.log(company);
    try {
      if (company[0]) {
        if (company[0].role === 'admin') {
          const decode = await argon.verify(company[0].password, dto.password);
          if (decode) {
            return this.generateToken(company[0].id, company[0].email);
          } else {
            return { message: 'Login yoki parol xato' };
          }
        } else {
          const decode = await argon.verify(company[0].password, dto.password);
          if (decode && company[0].status == 1) {
            return this.generateToken(company[0].id, company[0].email);
          }
          if (decode && company[0].status == 0) {
            return { message: "kirish huquqi yo'q" };
          } else {
            return { message: 'Login yoki parol xato' };
          }
        }
      } else {
        return { message: 'Login yoki parol xato' };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkCompany(token: string, res: Response) {
    const options = {
      secret: process.env.JWT_SECRET as string,
    };
    try {
      const decode = await this.jwt.verify(token.substring(7), options);
      if (decode) {
        console.log('token success');
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('Token muddati tugagan');
        res.status(401).json({ message: 'login parol kiriting' });
      } else {
        console.log('xatolik: ', error.message);
        res.status(401).json({ message: 'login parol kiriting' });
      }
    }
  }

  async checkAdmin(token: string, res: Response) {
    const options = {
      secret: process.env.JWT_SECRET as string,
    };
    try {
      const decode = await this.jwt.verify(token.substring(7), options);
      const admin = await this.authModel.findById(decode.sub);
      if (admin.role === 'admin') {
        console.log('this is admin');
      } else {
        res.status(401).json({ message: 'sizga ruxsat berilmaydi' });
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('Token muddati tugagan');
        res.status(401).json({ message: 'login parol kiriting' });
      } else {
        console.log('xatolik: ', error.message);
        res.status(401).json({ message: 'login parol kiriting' });
      }
    }
  }

  async generateToken(companyId: string, email: string) {
    const payload = { companyId, email };
    console.log(payload);
    return {
      token: this.jwt.sign({
        sub: payload.companyId,
        companyname: payload.email,
      }),
    };
  }
}
