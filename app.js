const mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', function(request, response) {

    connection.query('SELECT * FROM users', function(error, results, fields) {
        const responseData = {
            users: results

        }
        const jsonContent = JSON.stringify(responseData);
        response.end(jsonContent);

    });
});
app.get('/:id', function(request, response) {
    var userId = request.params.id;
    connection.query('SELECT * FROM users WHERE id = ?', [userId], function(error, results, fields) {
        if (results.length > 0) {

            const responseData = {
                user: results

            }
            const jsonContent = JSON.stringify(responseData);
            response.end(jsonContent);
        } else {
            const responseData = {
                message: "KULLANICI BULUNAMADI",
                code: 404,
            }
            const jsonContent = JSON.stringify(responseData);
            response.end(jsonContent);
        }
    });
});
app.post('/', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;

    connection.query('INSERT INTO users (username, password,email) VALUES (?,?,?)', [username, password, email], function(error, results, fields) {
        const responseData = {
            message: "KAYIT BAŞARILI",
            code: 200,
            endingMessage: "KAYIT İD:" + results.insertId
        }
        const jsonContent = JSON.stringify(responseData);
        response.end(jsonContent);

    });
});
app.delete('/:id', function(request, response) {
    var userId = request.params.id;
    connection.query('SELECT * FROM users WHERE id = ?', [userId], function(error, results, fields) {
        if (results.length > 0) {

            connection.query('DELETE FROM users WHERE id = ?', [userId], function(error, results, fields) {
                if (error) {
                    const responseData = {
                        message: "SİLME İŞLEMİ BAŞARISIZ",
                        code: 500,
                        er: error

                    }
                    const jsonContent = JSON.stringify(responseData);
                    response.end(jsonContent);
                } else {
                    const responseData = {
                        message: userId + " idli kulanıcı silindi",
                        code: 200,

                    }
                    const jsonContent = JSON.stringify(responseData);
                    response.end(jsonContent);

                }
            });

        } else {
            const responseData = {
                message: "SİLME BAŞARISIZ",
                code: 404,
                Error: "KULLANICI BULUNAMADI"

            }
            const jsonContent = JSON.stringify(responseData);
            response.end(jsonContent);
        }
    });
});


app.put('/:id', function(request, response) {
    var userId = request.params.id;
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;

    connection.query('SELECT * FROM users WHERE id = ?', [userId], function(error, results, fields) {
        if (results.length > 0) {

            for (var i = 0; i < results.length; i++) {

                if (email) {} else {
                    email = results[i].email;
                }
                if (username) {} else {
                    username = results[i].username;
                }
                if (password) {} else {
                    password = results[i].password;
                }

            }
            connection.query('UPDATE users SET  username = ?, password = ?, email = ?  WHERE id =? ', [username, password, email, userId], function(error, results, fields) {
                if (error) {
                    const responseData = {
                        message: "GÜNCELLEM BAŞARISIZ",
                        code: 500,
                        er: error

                    }
                    const jsonContent = JSON.stringify(responseData);
                    response.end(jsonContent);
                } else {
                    const responseData = {
                        message: "GÜNCELLEM BAŞARILI",
                        code: 200,

                    }
                    const jsonContent = JSON.stringify(responseData);
                    response.end(jsonContent);

                }
            });
        } else {
            const responseData = {
                message: "GÜNCELLEM BAŞARISIZ",
                code: 404,
                Error: "KULLANICI BULUNAMADI"

            }
            const jsonContent = JSON.stringify(responseData);
            response.end(jsonContent);
        }

    });



});


app.listen(8088);