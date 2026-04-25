import type { User } from '@db/auth/types'

interface DB {
  users: User[]
}
export const db: DB = {
  users: [
    {
      id: 1,
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'admin',

      avatar: `${import.meta.env.BASE_URL ?? '/'}images/avatars/avatar-1.png`,
      email: 'admin@demo.com',
      role: 'admin',
      abilityRules: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
    },
    {
      id: 2,
      fullName: 'Jane Doe',
      username: 'janedoe',
      password: 'client',

      avatar: `${import.meta.env.BASE_URL ?? '/'}images/avatars/avatar-2.png`,
      email: 'client@demo.com',
      role: 'client',
      abilityRules: [
        {
          action: 'read',
          subject: 'AclDemo',
        },
      ],
    },
  ],
}
