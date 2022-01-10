const { GAME_MODE, YEAR_REGEX } = require('../utils/quizzConstants');
const quizzServices = require('../services/quizzServices');

const { getQuestion, startGame, answer } = quizzServices;

exports.question = async (req, res, next) => {
    try {
        if(req.session.username){
            if(!req.session.endGame){
                if(!req.session.currentQuestion){
                    let result = await getQuestion(req.session);
                    res.status(200).json(result);
                }else{
                    res.status(400).json({
                        error: "You already asked for a question."
                    }) 
                }
            }else{
                res.status(400).json({
                    error: "You already lost the game."
                })
            }
        }else{
            res.status(400).json({
                error: "No session started."
            })
        }
        
        
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
};

exports.answer = async (req, res, next) => {
    try {
        if(req.session.username){
            if(!req.session.endGame){
                if(req.body.songID){
                    if(req.body.year){
                        if(req.body.year.match(YEAR_REGEX)){
                            let result = await answer(req.session, req.body.songID, parseInt(req.body.year));
                            res.status(200).json(result);
                        }else{
                            res.status(400).json({
                                error: "Invalid year parameter (must be between 1900 and 2021)."
                            }) 
                        }
                    }else{
                        res.status(400).json({
                            error: "Missing year parameter."
                        })
                    }
                }else{
                    res.status(400).json({
                        error: "Missing songID parameter."
                    })
                }
            }else{
                res.status(400).json({
                    error: "You already lost the game."
                })
            }
        }else{
            res.status(400).json({
                error: "No session started."
            })
        }
        
        
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
}

exports.start = async (req, res, next) => {
    try {
        if(!req.session.username || req.session.endGame){
            if(req.body.username){
                if(req.body.mode){
                    if(GAME_MODE.includes(req.body.mode)){
                        if(req.body.artist){
                            let result = await startGame(req.session, req.body.username, req.body.mode, req.body.artist);
                            res.status(200).json(result);
                        }else{
                            res.status(400).json({
                                error: "Missing artist parameter."
                            })
                        }
                    }else{
                        res.status(400).json({
                            error: "Wrong mode parameter."
                        })
                    }
                }else{
                    res.status(400).json({
                        error: "Missing mode parameter."
                    })
                }
            }else{
                res.status(400).json({
                    error: "Missing username parameter."
                })
            }
        }else{
            res.status(400).json({
                error: "You already started a game."
            })
        }
        
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
};