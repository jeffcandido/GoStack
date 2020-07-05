interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    }
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'jeff@pskbundle.com.br',
      name: 'Jefferson Cândido',
    }
  },
} as IMailConfig;
