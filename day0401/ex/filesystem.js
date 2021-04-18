/*
내장 모듈중 filesystem 모듈을 사용해보자
파일 처리와 관련된 기능을 가지는 모듈이다
중요!!!!!
*/

var fs = require("fs");//모듈 가져오기

//원하는 파일의 내용을 읽어서 현재 프로그램으로 가져와보자!
var text = fs.readFileSync("./노트정리.html", "utf8");

console.log(text);

//파일 시스템 객체를 이용하여 읽어드린 내용을 비어있는 파일에 출력해보자
//(어느 파일에? , 어떤 내용을, 인코딩은, 완료된 시점에 무었을 할껀지?)
fs.writeFile("./empty.txt",text,"utf8",function(){
console.log("파일 쓰기 완료");
});