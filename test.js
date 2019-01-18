'use strict';

var fs = require("fs");
var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var fs = require("fs");

//start mysql connection
var connection = mysql.createConnection({
  host     : '127.0.0.1', //mysql database host name
  user     : 'root', //mysql database user name
  password : 'rahasia', //mysql database password
  database : 'test_db' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(8080,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

// rest api to get all results
app.get('/ac/all', function (req, res) {

  const datatbl = {};
  const array = [];
   connection.query('select * from img', function (error, results, fields) {
	  if (error) throw error;
      for (var i = 0 ; i <results.length; i++){
        var row = results[i];
        // console.log(results[0]);
        var im = row.image;
        // console.log(im)
        var outputfile = "out_"+row.id+".jpg";

        // console.log(im);
        // // Converted to Buffer:
        const buf = new Buffer(im, "binary");
        // // Write new file out:
        fs.writeFileSync('img/'+outputfile, buf);
        // console.log("New file output:", outputfile);
        // var size = Object.keys(datatbl).length
        const imgPath = __dirname+'/img/'
        const datatbl2 = Object.assign({id :row.id, desciption :row.descrip, image:imgPath+outputfile}, datatbl);
        array.push(datatbl2)
        // for (var j, j = 0; j < size.length; j++){
        //   console.log(j)
        // }
        // var element = {};
        // element.id = row.id;
        // element.descrip = row.descrip;
        // element.image = __dirname+'/'+outputfile;
        // datatbl.push(element);
        // console.log(datatbl);
        // array.push(datatbl)
        // console.log(array);
        // var str = JSON.stringify(element);
        // console.log(element);
        // const rslJson = JSON.parse(str);
        // console.log(rslJson);
        // res.json(JSON.stringify(datatbl2));
    }
    // console.log(typeof array);
    // res.end;
    res.json(array);
	});
});

//rest api to get a single employee data
app.get('/ac/:id', function (req, res) {
   // console.log(req);
   connection.query('select * from img where id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
      const datatbl = {};
      const array = [];

      var row = results[0];
      // console.log(results[0]);
      var im = row.image;
      console.log(im)
      var outputfile = "out_"+row.id+".jpg";
      // console.log(im);
      // // Converted to Buffer:
      const buf = new Buffer(im, "binary");
      // // Write new file out:
      fs.writeFileSync('img/'+outputfile, buf);
      // console.log("New file output:", outputfile);
      // var size = Object.keys(datatbl).length
      const imgPath = __dirname+'/img/'
      const datatbl2 = Object.assign({id :row.id, desciption :row.descrip, image:imgPath+outputfile}, datatbl);
      array.push(datatbl2)
      res.json(array);

	  // res.end(JSON.stringify(results));
	});
});

//rest api to create a new record into mysql database
app.post('/ac/add', function (req, res) {
   var postData  = req.body;
   var id = req.body.id;
   var descrip = req.body.descrip;
   var image = req.body.image;
   // var id = req.body.id;
   // var email = req.body.email;
   // var password = req.body.password;
   // var username = req.body.username;
   console.log(postData)
   var imageData = fs.readFileSync(__dirname + '/upload/es-dot.jpg');
   const bfr = new Buffer(imageData, "binary");
   console.log(bfr)
   // var user_id = req.body.id;
   // var postData = [req.body.descrip = 'memphis',req.body.image = imageData];
   connection.query('INSERT INTO img (id, descrip, image) VALUES (?,?,?)', [id, descrip, bfr], function (error, results, fields) {
	  if (error){
      console.log(error)
    }else{
    // res.end(JSON.stringify(results));
    // res.ok("Berhasil menambahkan user!", res)
    // res.end(JSON.stringify(result));
    res.send({ result: 'insert berhasil' })
  }
	});
});

// //rest api to update record into mysql database
// app.put('/employees', function (req, res) {
//    connection.query('UPDATE `employee` SET `employee_name`=?,`employee_salary`=?,`employee_age`=? where `id`=?', [req.body.employee_name,req.body.employee_salary, req.body.employee_age, req.body.id], function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end(JSON.stringify(results));
// 	});
// });
//
// //rest api to delete record from mysql database
// app.delete('/employees', function (req, res) {
//    console.log(req.body);
//    connection.query('DELETE FROM `employee` WHERE `id`=?', [req.body.id], function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end('Record has been deleted!');
// 	});
// });
