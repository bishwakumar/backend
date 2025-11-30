import { HelloWorldService } from "./hello-world.service";
import { HelloWorldModel } from "./model/HelloWorld.model";
export declare class HelloWorldResolver {
    private helloWorldService;
    constructor(helloWorldService: HelloWorldService);
    sayHello(): Promise<HelloWorldModel>;
}
