const { GAME_MODE } = require('../utils/quizzConstants');
const quizzServices = require('../services/quizzServices');

const { launchNewQuizz } = quizzServices;

exports.quizz = async (req, res, next) => {
    try {
        if(req.query.mode){
            if(GAME_MODE.includes(req.query.mode)){
                if(req.query.artist){
                    let result = await launchNewQuizz(req.query.artist);
                    res.status(200).json(result);
                }else{
                    res.status(400).json({
                        error: "Missing artist parameter."
                    })
                }
            }else{
                res.status(400).json({
                    error: "Invalid game mode parameter."
                })
            }
        }else{
            res.status(400).json({
                error: "Missing game mode parameter."
            })
        }
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
};