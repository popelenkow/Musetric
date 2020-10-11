import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/module';

const isDev = process.env.NODE_ENV === 'development';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	await app.listen(3000, () => isDev && console.log('http://localhost:3000'));

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
