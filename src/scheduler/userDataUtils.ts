import { Exercise } from '../types/progress'
import { Progress } from './scheduleHandler'

export type UserData = {
    schedule: Exercise[]
    progress: Progress
    stats: {
        reviewCount: number // How many reviews has this user done over the accounts lifespan
    }
    touched: number // When was this last updated
}

/** What indicates that this userData has progressed? XP? Review count? Define it here. */
export const userDataProgressCount = (
    userData: UserData | undefined
): number => {
    return userData?.stats?.reviewCount ?? 0
}
