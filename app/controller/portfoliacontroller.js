const  logger  = require('../logger/logger');
const { addForm, editForm } = require('../validations/portfoliaValidation')
const connection = require('../helpers/db');
exports.portfolia = async (req, res) => {
    connection.query(`SELECT tb_portfolio.projectcategory,category.id,category.categoryname FROM tb_portfolio JOIN category ON tb_portfolio.projectcategory = tb_portfolio.projectcategory`, (err, result) => {

        if (result) {
            console.log(result);
            let sql = `SELECT * FROM tb_portfolio`
            connection.query(sql, (err, results) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    results.map(d=>{
                        const id = d.projectcategory;
                  result.forEach(v => {
                   const c_id = v.id;
                   if(id == c_id){
                      d.projectcategory  = v.categoryname
                   }
               });
               });
               
                }
            res.send(results)

            })


        }
        else {
            res.send('category not found')
        }
        logger.error(err)
    });

}


exports.findDataByid = async (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM tb_portfolio WHERE id =${id}`
    connection.query(sql, (err, result) => {
        if (result) {
            res.send(result)
        } else {
            res.send("Invalid ID")
        }
    })
}

exports.addData = async(req, res) => {
    try {
        const { error } = addForm(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        else {
                const multiImages = req.files.map(images =>images.filename);
                const projectcategory = req.body.projectcategory;
                const projectname = req.body.projectname;
                const projecttitle = req.body.projecttitle;
                const uploadImage = multiImages;
                const projecturl= req.body.projecturl;
                const projectdate = req.body.projectdate
                connection.query(`SELECT id FROM category where categoryname='${projectcategory}'`, function (err, result) {
                    console.log(result);
                    const category_id = result[0].id;
                    const sql = `INSERT INTO tb_portfolio (projectcategory,projectname,projecttitle,uploadImage,projecturl,projectdate) VALUES('${category_id}','${projectname}','${projecttitle}','${uploadImage}','${projecturl}','${projectdate}')`;
                    connection.query(sql, (err, result) => {
                        if (err) {
                            logger.error('Error', err);
                        } else {
                            res.send("Data Inserted...")
                        }
                    })
                })
    
    
            }
    }
    catch (error) {
        logger.error('error', error);
    }
}
exports.editData = async (req, res) => {

    try {

        let { error } = editForm(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }else {
            const id = req.params.id;
        
            const result = req.files.map(images => images.filename);
                const projectcategory = req.body.projectcategory;
                const projectname = req.body.projectname;
                const projecttitle = req.body.projecttitle;
                const uploadImage = result;
                const projecturl = req.body.projecturl;
                const projectdate = req.body.projectdate

        }

            connection.query(`SELECT id FROM category where category='${projectcategory}'`, function (err, result) {
                const category_id = result[0].id;
                connection.query(`UPDATE tb_portfolio SET projectcategory='${category_id}', projectname='${projectname}', uploadImage='${uploadImage}', projecttitle='${projecttitle}', projecturl = '${projecturl}',projectdate='${projectdate}' WHERE id ='${id}'`, function (err, response) {

                    if (response) {
                        res.send('Data updated')
                    } else {
                        logger.error('Error', err);
                    }
                })

            })

            connection.query(`UPDATE tb_portfolio SET projectname='${projectname}', uploadImage='${uploadImage}', projecttitle='${projecttitle}', projecturl = '${projecturl}',projectdate='${projectdate}' WHERE id ='${id}'`, function (err, response) {

                if (response) {
                    res.send('Data updated')
                } else {
                    logger.error('Error', err);
                }
            })
        }
    catch (err) {
        logger.error('Error', err);
    }
}

exports.deleteData = (req, res) => {
    const id = req.params.id;
    let sql = `DELETE FROM tb_portfolio WHERE id=${id}`
    connection.query(sql, (err, result) => {
     
            if (err) {
                logger.error('Error', err);
            } else {
                res.send('delete portfolia')
            }
        })
}
       
exports.deleteAll = async (req, res) => {
    const id = req.query;

    var countId = Object.keys(id).length;
    for (let i = 0; i < countId; i++) {
        const sql = `DELETE from tb_portfolio WHERE id = ?`

            if (sql) {
                connection.query(sql, Object.keys(id)[i], function (err) {
                    if (err) {
                        logger.error("error",err)
                    }
                })
        }
    }
}
