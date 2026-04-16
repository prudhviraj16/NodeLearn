exports.getAll = (req, res) => {
    res.status(200).json({
        status: 'success',
        
    })
}

exports.getById = (req, res) => {
    let id = req.params.id
    res.status(200).json({
        status: 'success',
        
    })
}