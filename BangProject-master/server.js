var http = require("http");
var express = require("express");
var static = require("serve-static");
var ejs = require("ejs");
var oracledb = require("oracledb");
var app = express();
var mymodule = require("./lib/mymodule.js");

var expressSessioin = require("express-session");

oracledb.autoCommit=true;
// oracledb.fetchArraySize=[oracledb.CLOB]; //json으로 전해지는 데이터를 string화

app.use(static(__dirname+"/static"));
app.use(express.urlencoded({
    extended:true
}));

app.use(expressSessioin({
    secret:"key secret",
    resave:true,
    saveUninitialized:true
}));

app.set("view engine","ejs"); 

const conStr={
    user:"bang",
    password:"bang",
    connectString:"localhost/XE"
};

/*------------------------------------------------
관리자
-----------------------------------------------*/

// 관리자 로그인 폼 요청
app.get("/admin/loginform",function(request,response){
    response.render("admin/login");
});

// 관리자 로그인 요청 처리
app.post("/admin/login",function(request,response){
    var master_id = request.body.master_id;
    var master_pass = request.body.master_pass;
    var sql= "select *from admin where master_id= :1 and master_pass= :2"; 

    oracledb.getConnection(conStr,function(err,con){
        if(err){
            console.log("실패",err);
        }else{
            con.execute(sql,[master_id,master_pass],function(error,result,fields){
                console.log("sql문",sql);
                if(error){
                    console.log("실패2",error);
                }else{
                    if(result.length<1){
                        console.log("로그인 실패");
                        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                        response.end(mymodule.getMsgBack("로그인 정보가 올바르지 않습니다"));
                    }else{
                        console.log("로그인 성공");
                        console.log(result.rows);
                        request.session.admin={
                            admin_id:result.rows[0].admin_id,
                            master_id:result.rows[0].master_id,
                            master_pass:result.rows[0].master_pass,
                            master_name:result.rows[0].master_name,
                            master_phone:result.rows[0].master_phone,
                            master_mail:result.rows[0].master_mail
                        };
                        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                        response.end(mymodule.getMsgUrl("로그인성공","/admin/main"));
                    }
                    con.close();
                }
            });
        }
    });
});

// 관리자모드 메인 화면 요청
app.get("/admin/main",function(request,response){
    checkAdminSession(request,response,"admin/main");
});



/*------------------------------------------------
사용자
-----------------------------------------------*/

// 사용자 회원가입
app.post("/bang/memberRegist",function(request,response){
    

});




/*--------------------------------------------------
세션 체크
----------------------------------------------*/ 
function checkAdminSession(request,response,url){
    if(request.session.admin){ //undefined가 아닌 경우에 
        response.render(url,{
            adminUser:request.session.admin
        });
    }else{
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(mymodule.getMsgBack("관리자 확인이 필요함"));
    }
}

var server = http.createServer(app);
server.listen(8989,function(){
    console.log("Server is running at 8989 Port....");
});