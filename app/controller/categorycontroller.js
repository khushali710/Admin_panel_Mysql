const  logger  = require('../logger/logger');
const { addForm, editForm } = require('../validations/categoryValidation')
const connection = require('../helpers/db');


exports.category = async (req, res) => {

    let sql = `SELECT * FROM category`
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error', err);
        } else {
            res.send(result)
        }
    })
}
exports.addData = (req, res) => {
    try {
        const { error } = addForm(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const category = req.body.category;
            const sql = `INSERT INTO category (categoryname) VALUES ('${category}')`;
            connection.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("Data Inserted...")
                }
            })
        }
    } catch (err) {
        logger.error('Error', err);
    }
}





exports.editData = async (req, res) => {

    try {
        const { error } = editForm(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const id = req.params.id;
            const category = req.body.category;
            let sql = `UPDATE category SET categoryname='${category}'  WHERE id =${id}`
            connection.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("data update")
                }
            })
        }
    } catch (err) {
        logger.error('Error', err);
    }

}

exports.deleteData = (req, res) => {
    const id = req.params.id;
    console.log(id);
    let sql = `DELETE FROM category WHERE id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            logger.error('Error', err);
        } else {
            res.send("data deleted")
        }
    })

}
exports.deleteAll = (req, res) => {
    const id = req.query;
    
    const countId = Object.keys(id).length;
    for (let i = 0; i < countId; i++) {
        const sql = `DELETE from category WHERE id = ?`
        if (sql) {
            connection.query(sql, Object.keys(id)[i], function (err) {
                if (err) {
                    logger.error("error", err)
                }
            })
        }

    }
    res.send("all data delete")
}



    
