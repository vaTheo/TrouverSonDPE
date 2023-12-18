import { Module } from '@nestjs/common';
import { DataRatingModule } from '../datarating-module/dataRatings.module';
import { UserModule } from '../user-module/user.module';

@Module({
    imports: [UserModule,DataRatingModule],
    controllers: [],
    providers: [], //Service and midlware  

})
export class RootModule {}
