import { Controller } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
}
