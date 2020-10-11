import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './controller';

import { AppService } from './service';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: 'dist',
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule {}
