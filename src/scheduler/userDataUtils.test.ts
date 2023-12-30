import { defaultUserData } from './scheduleHandler'
import { UserData, userDataProgressCount } from './userDataUtils'

describe('User data utils function', () => {
   test('Check userDataProgressCount', () => {
      const userData: UserData = {
         ...defaultUserData,
         progress: {
            十: { skills: { recognize: 4 } },
            四: { skills: { compose: 3 } },
         },
         schedule: [],
         stats: { reviewCount: 12 },
      }
      expect(userDataProgressCount(userData)).toBe(12)
   })
})
