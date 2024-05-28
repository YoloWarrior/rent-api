import { Injectable } from '@nestjs/common';
import { Code } from 'src/core/entities/Code';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Code) private readonly codeRepository: Repository<Code>,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  async sendVerificationCode(email: string) {
    let isUserExist = true;
    let user = await this.userService.findBy(
      { email },
      {
        code: true,
      },
    );

    if (!user) {
      user = await this.userService.create({
        id: uuid(),
        email,
        balance: 20,
      });

      isUserExist = false;
    } else {
      if (user?.code) await this.codeRepository.delete(user?.code.id);
    }

    const verificationCode = this.generateVerificationCode();

    const code = await this.codeRepository.save(
      new Code({
        code: verificationCode,
      }),
    );

    user.code = code;

    await this.userService.create(user);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Код для входа',
      text: `Ваш код для входа ${verificationCode}`,
    });

    return isUserExist;
  }

  async checkVerificationCode(email: string, code: string): Promise<boolean> {
    const confirmCode = await (
      await this.userService.findBy({ email }, { code: true })
    )?.code;

    if (!confirmCode) {
      return true;
    }

    const result = confirmCode?.code === code;

    if (result) {
      confirmCode.user = null;

      await this.codeRepository.save(confirmCode);
      await this.codeRepository.delete(confirmCode.id);

      return true;
    }

    return false;
  }

  private generateVerificationCode() {
    const length = 4;
    let code = '';

    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10);
      code += digit.toString();
    }

    return code;
  }
}
