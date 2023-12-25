import { UserData, userDataProgressCount } from "./userDataUtils"

describe("User data utils function", () => {
    test("Check userDataProgressCount", () => {
        const userData: UserData = {
            progress: {
                "十": { skills: { "recognize": 4 } },
                "四": { skills: { "compose": 3 } }
            },
            schedule: []
        }
        expect(userDataProgressCount(userData)).toBe(7)
    })
})