import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CitiesModule } from './cities/cities.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { UploadModule } from './upload/upload.module';
import { PropertiesModule } from './properties/properties.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ContactRequestsModule } from './contact-requests/contact-requests.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    CitiesModule,
    InstitutionsModule,
    UploadModule,
    PropertiesModule,
    FavoritesModule,
    ContactRequestsModule,
    ReportsModule,
    AdminModule,
    PaymentsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
