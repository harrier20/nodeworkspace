var http = require("http");

var md = require("./mymoduale.js");

var server = http.createServer(function(request, response){
//request :클라이언트의 요청 정보를 담고있는 객체
//response : 클라이언트에 응답할 정보를 담고있는 객체
response.end("hi~")
});

//네트워크 프로그램간 식별을 위한 있는 구분 고유값 1~1024 사이의 포트번호는 시스템이
//이미 사용중인 포트이므로 피해야한다
//또한 상용 프로그램이 이미 사용중인 포트도 피하자
/// oracle - 1521/mysql - 3306/mssql 1433
server.listen(7777,function(){
    console.log(md.getMsg());
});//서버 가동