import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      //const payload = jwt.verify(token, envs.JWT_SECRET) as never as JwtPayload
      //req.user = payload
      next();
    } catch {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
