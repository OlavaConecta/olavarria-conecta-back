import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendasModule } from './tiendas/tiendas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { PlanesModule } from './planes/planes.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [
  
      ConfigModule.forRoot({
      isGlobal: true}),


     TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || '3306', 10),
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE || 'olavarriaconecta',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging:true,
    }),
  }),
    TiendasModule,
  PlanesModule,
  ProductosModule,
  CategoriasModule,
  AdminModule,
  AuthModule,
  CloudinaryModule,
  MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

