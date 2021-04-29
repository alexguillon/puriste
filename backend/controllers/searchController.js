const searchServices = require('../services/searchServices');

const { searchArtist, searchTrackPool } = searchServices;

exports.search = async (req, res, next) => {
    try {
        if(req.query.artist){
            if(req.query.offset){
                if(Number.isInteger(parseInt(req.query.offset)) && parseInt(req.query.offset) > -1){
                    let result = await searchArtist(req.query.artist, parseInt(req.query.offset));
                    res.status(200).json(result);
                }else{
                    res.status(400).json({
                        error: "Wrong offset parameter. It must be a positive integer."
                    });
                }
            }else{
                res.status(400).json({
                    error: "Missing offset parameter."
                })
            }
        }else if(req.query.tracks){
            if(req.query.pool){
                if(Number.isInteger(parseInt(req.query.pool)) && parseInt(req.query.pool) > 0 && parseInt(req.query.pool) < 1000){
                    let result = await searchTrackPool(req.query.tracks, parseInt(req.query.pool));
                    res.status(200).json(result);
                }else{
                    res.status(400).json({
                        error: "Wrong offset parameter. It must be a positive integer between 1 and 1000."
                    });
                }
            }else{
                let result = await searchTrackPool(req.query.tracks);
                res.status(200).json(result);
            }
        }else{
            res.status(400).json({
                error: "Missing artist name parameter."
            })
        }
    } catch (error) {
        next(error);
    }
};