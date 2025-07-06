import { OnApplicationShutdown, Injectable } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationShutdown {
  onApplicationShutdown() {
    console.log('Bye tea‑lovers 👋');
  }
}
