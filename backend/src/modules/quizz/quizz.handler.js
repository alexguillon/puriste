export function validateSession(playerSessionData){
    if(playerSessionData && !playerSessionData.endGame){
        throw new Error("You already start a game.");
    }
}

export function validateQuizzSession({ username, endGame, currentQuestion }){
    if(!username){
        throw new Error("No session started.");
    }
    if(endGame){
        throw new Error("You already lost the game.");
    }
    if(currentQuestion){
        throw new Error("You already ask a question.");
    }
}