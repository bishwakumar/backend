import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  async sayHello() {
    return {
      value: 'Hello World!'
    }
  }
}
