import { Exercise } from "../types/progress"
import { Progress } from "./scheduleHandler"

export type UserData = {
    schedule: Exercise[]
    progress: Progress
    touched?: Date // When was this last updated
}

export const userDataProgressCount = (userData: UserData | undefined): number => {
    return userData ? Object.values(userData.progress).reduce((prev, curr) => {
        return prev + Object.values(curr.skills).reduce((p, c) => {
            return p + c
        }, 0)
    }, 0) : 0
}


export const mostAdvancedUserData = (arr: (UserData| undefined)[]) => {
    let furthest: UserData | undefined;

    arr.forEach(userData => {
        if (userDataProgressCount(userData) > userDataProgressCount(furthest)) {
            furthest = userData
        }
    });
    
    return furthest
}