export function validateSession(playerSessionData){
    if(playerSessionData && !playerSessionData.endGame){
        throw new Error("You already start a game.");
    }
}