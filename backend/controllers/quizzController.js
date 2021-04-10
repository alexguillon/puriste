const { GAME_MODE } = require('../utils/quizzConstants');

exports.newQuizz = async (req, res, next) => {
    try {
        if(req.query.mode){
            if(GAME_MODE.includes(req.query.mode)){
                if(req.query.artist){
                    let result = await launchNewQuizz(req.query.artist);
                    res.status(200).json(result);
                }else{

                }
                let result = await launchNewQuizz();
                res.status(200).json(result);
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
        next(error);
    }
};