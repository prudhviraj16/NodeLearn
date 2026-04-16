const fs = require('fs')

let hotels = JSON.parse(fs.readFileSync('./data/hostels.json'))

exports.checkHotelExist = (req,res,next,value,name) => {
    const hotel = hotels.find(h =>h.id === +value)
    if(!hotel) {
        return res.status(404).json({
            status : 'fail',
            message : 'Hotel With ID' + value + ' Not Found'
        })
    }
    next()
}

exports.validateRequestBody = (req,res,next) => {
    const body = req.body

    if(!body){
        return res.status(404).json({
            status : 'fail',
            message : 'No Request Body'
        })
    }

    if(!body.name || !body.price || !body.city){
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid Request Body'
        })
    }
    
    next()
}

exports.getAll = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            hotels
        }
    })
}

exports.getById = (req, res) => {
    let id = req.params.id
    const hotel = hotels.find(h => h.id == id);

    res.status(200).json({
        status: 'success',
        data: {
            hotel
        }
    })
}

exports.create = (req, res) => {
    const newId = hotels[hotels.length - 1].id + 1
    let newHotel = {
        ...req.body,
        id: newId
    }
    hotels.push(newHotel)
    fs.writeFile('./data/hostels.json', JSON.stringify(hotels), () => {
        res.status(200).json({
            status: 'success',
            data: {
                hotels
            }
        })
    })
}

exports.update = (req, res) => {
    const id = +req.params.id;

    const hotelToUpdate = hotels.find(h => h.id === id);

    if (!hotelToUpdate) {
        return res.status(404).json({
            status: 'fail',
            message: 'Hotel not found'
        });
    }
    Object.assign(hotelToUpdate, req.body);

    fs.writeFile(
        './data/hostels.json',
        JSON.stringify(hotels, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to update file'
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    hotel: hotelToUpdate
                }
            });
        }
    );
};


exports.delete = (req, res) => {
    const id = +req.params.id;
    const hotelToDelete = hotels.find(h => h.id === id);
    const index = hotels.indexOf(hotelToDelete)
    hotels.splice(index,1)

    fs.writeFile(
        './data/hostels.json',
        JSON.stringify(hotels), () => {
            res.status(204).json({
                status : 'success',
                data : {
                    hotel : hotelToDelete
                }
            })
            console.log("deleted")
        })
};