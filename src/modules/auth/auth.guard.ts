import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwtSrevice: JwtService
    ){}

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        //Bearer 
        const [type, token] = request.headers.authorization?.split(' ')??[];
        if(!token){
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtSrevice.verifyAsync(token, {secret: jwtConstants.secret});
            request['usuario'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
        
    }
    
}
    
