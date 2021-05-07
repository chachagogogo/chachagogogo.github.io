---
title: Postman Bearer Token 설정하기
date: 2021-04-24 15:00:26
categories:
    - 개발 툴
tags: [Postman]
description: 포스트맨에서 일일이 token을 복사&붙여넣기 하기가 귀찮다면 이렇게 하세요!
---

Postman으로 작업하다 보면 귀찮을 때가 있다.  
바로 Bearer Token을 다른 리퀘스트에 복사 & 붙여넣기 할 때가 대표적이다.

예를 들어 `로그인 요청으로 받은 토큰으로 마이페이지 요청을 하는 경우`가 그렇다.
token 인증 방식은 다음에 설명하도록 하고,,,,  
(사실 authentication이 뭔지부터 설명해야 된다)

아무튼 일일이 토큰을 복사&붙여넣기 하는 작업을 반복하는 일은 매우 귀찮다.  
기왕이면 편하게 사용하는 방법에 대해 포스팅을 하고자 한다.

---

# 1. 콜렉션 만들어서 토큰 담을 변수 만들기

![Screen Shot 2021-04-24 at 2 14 17 PM](https://user-images.githubusercontent.com/73287554/115948294-5045b880-a508-11eb-8b41-f725ef8af9d0.png)

1.  `Collection`을 누른다.
2.  `Create new Collecton`을 누른다.
3.  `Auth`를 누른다.
4.  `Bearer Token`을 누른다. (상황에 맞게 고르면 된다. 나는 jwt를 쓸 거니깐 Bearer token을 골랐다.)
5.  토큰 변수명으로 적당한 이름을 입력한다. (나는 늘 \{\{authToken\}\}이라고 입력한다.)

이제 이 콜렉션에 새 리퀘스트를 포함시키는 작업을 하면 된다.

# 2. '로그인 컨트롤러'처럼 토큰 발급해주는 리퀘스트에서 자동화 코드 작성하기

![](https://user-images.githubusercontent.com/73287554/115948275-386e3480-a508-11eb-996d-ec97e3152adc.png)

세상의 모든 토큰 관련 컨트롤러는 둘로 나눌 수 있다. 하나는 토큰을 발급해주는 컨트롤러, 다른 하나는 토큰을 확인하는 컨트롤러.😂

쉽게 얘기하자면 사용자가 `로그인`을 하면 서버는 사용자에게 토큰을 건네주고, 사용자가 `마이페이지`처럼 개인화 된 페이지를 보려면 사용자로부터 토큰을 받아서 '당신이 바로 그 사람이군~!!!' 하고 검사를 해야 된다.

아.무.튼! 우리가 할 작업은 로그인 컨트롤러가 작동하면 생성되는 토큰을 authToken이라는 변수에 담아주는 일이다.

1. `Tests` 클릭하기
2. `response`를 보고 토큰이 어디에 있는지 확인
3. `Tests` 내에 코드 작성하기

```js
// pm은 postman의 약자이다

// status code가 201일 때에는 201로 써줘야 한다는 사실 주의!
if (pm.response.code === 200) {
	pm.environment.set("authToken", pm.response.json().token);
}
```

# 3. '마이페이지 컨트롤러'처럼 토큰 확인하는 리퀘스트에서 확인하기

![Screen Shot 2021-04-24 at 2 18 14 PM](https://user-images.githubusercontent.com/73287554/115948283-3efcac00-a508-11eb-878d-a9b5616c190e.png)
서버 입장에서는 사용자가 /users/me에 GET 요청을 보낼 때 로그인한 사용자마다 다른 정보를 보내줘야 한다. (너무나 당연한 말....)

제대로 되나 확인해보자.

1. `authorization을` 누른다.
2. `inherit auth from parent`를 누른다. (컬렉션에서 이미 authenticaton 방식을 Bearer Token으로 지정해줬기 때문에 inherit을 하면 당연히 Bearer Token으로 자동 선택된다.👍)
3. `send`를 누르면 토큰이 자동으로 적용된 모습을 확인할 수 있다. (사진이 짤렸네요...)
