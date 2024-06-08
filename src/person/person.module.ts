import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './person.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  controllers: [PersonController],
  providers: [PersonService, ConfigService],
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.');
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + '.' + ext[ext.length - 1],
          );
        },
      }),
    }),
    ConfigModule.forRoot(),
  ],
})
export class PersonModule {}
