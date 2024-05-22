const Station = require('../Model/StationModel');

async function addStation(req,res){
    const { name , latitude , longitude } = req.body
    try {
        const station = await Station.create({
            name,
            latitude,
            longitude,
        });
        return res.status(201).json({
            success: true,
            message: 'station added successfully',
        });
        }
     catch (error)
        {
        console.error('Error adding station:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        }
}

async function getOneStation(req, res){
    try{
        const { id } = req.params;
        const station = await Station.findById(id);
        return res.status(200).json({
            success: true,
            station: station
        });
    }
    catch(error){
        console.log("Error Fetching Station", error);
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

async function getStations(req,res){
    try {
        const allstations = await Station.find();
        return res.status(201).json({
            success: true,
            allstations,
        });
        }
     catch (error)
        {
        console.error('Error adding station:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        }
}




async function deleteStation(req,res){
    try {
        const stationid = await Station.findById(req.params.id)

        if(!stationid)
            {
                return res.status(404),json({
                    success:false,
                    message:'station not found'
                })
            }

            await stationid.deleteOne();
            return res.status(201).json({
                success: true,
                message:"station deleted successfully",
            });
          
      
        }
        catch (error)
        {
        console.error('Error adding station:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        }
    }

    async function updateStation(req,res){
        try {
           
            const {name,latitude,longitude} = req.body;

            const updatedData = await Station.findByIdAndUpdate(
                req.params.id,
                {name,latitude,longitude},
                { new: true, runValidators: true }
            )
    
            if(!updatedData)
                {
                    return res.status(404),json({
                        success:false,
                        message:'station not found'
                    })
                }

                return res.status(201).json({
                    success: true,
                    message:"station updated successfully",
                });
              
          
            }
            catch (error)
            {
            console.error('Error adding station:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
            }
        }
        

   
module.exports = {addStation,getStations,deleteStation,updateStation, getOneStation};