  var oracledb = require('oracledb');

var config = {
    "user": "CESII",
    "password": "CESII",
    "connectString":"192.168.92.66:1522/CESIIDB"
}

oracledb.getConnection(config,function (err,connection) {
    if(err) {
        console.log(err.message);
        // doRelease(connection);
        return;
    }

    connection.execute("select * from dic_roles",function (err,result) {
        if(err) {
            console.error(err.message);
            doRelease(connection);
            return;
        }
        // 打印返回的表结构
        console.log("========" + result.metaData);

        // console.log(JSON.parse(result));

        console.log(result.rows);
    });
});


function doRelease(connection) {
    connection.close(function (err) {
        if(err) {
            console.error(err.message)
        }
    })
}