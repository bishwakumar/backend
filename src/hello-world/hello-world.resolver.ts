import { Query, Resolver } from '@nestjs/graphql';
import { HelloWorldService } from "./hello-world.service";
import { HelloWorldModel } from "./model/HelloWorld.model";

@Resolver()
export class HelloWorldResolver {

  constructor(private helloWorldService: HelloWorldService) {}

  @Query(() => HelloWorldModel)
  async sayHello(): Promise<HelloWorldModel> {
    return await this.helloWorldService.sayHello();
  }
}
