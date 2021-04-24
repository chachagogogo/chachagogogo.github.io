---
title: Postman Bearer Token 설정하기
date: 2021-04-24 15:00:26
categories:
  - 개발 툴
tags: [Postman]
description: 일일이 token을 복사&붙여넣기 하기가 귀찮다면 이렇게 하세요!
---

![](https://mblogthumb-phinf.pstatic.net/20131017_256/yeji4152_13819711197723XDCp_PNG/moon_031.png?type=w210)

## 안녕하세요 개발을 좋아하시는 여러분들~~~

Postman으로 작업하다 보면 귀찮을 때가 있죠!!!

바로 Bearer Token을 다른 리퀘스트에 복.사.&.붙.여.넣.기 할 때가 대표적인데요?!

예를 들어 로그인 요청으로 받은 토큰으로 마이페이지 요청을 하는 경우가 그렇습니다~~~

token 인증 방식은 다음에 설명하도록 하고,,,,  
(사실 authentication이 뭔지부터 설명해야 돼서 난감...)  
![](https://mblogthumb-phinf.pstatic.net/20131017_58/yeji4152_1381971122819foVXr_PNG/moon_041.png?type=w210)

아무튼 일일이 토큰을 복사&붙여넣기 하는 작업을 반복하는 일은 매우 귀찮잖아요???!!?!?!?!?!  
![](https://user-images.githubusercontent.com/73287554/115912700-9d933d00-a4aa-11eb-9a0b-3ac01047542c.png)  
(으휴 귀찮아~~)  
기왕이면 편하게 사용하는 방법을 알려드리겠습니다~~~

![](https://mblogthumb-phinf.pstatic.net/20131017_230/yeji4152_1381971121233HqVag_PNG/moon_036.png?type=w210)  
같이 고고~~~~

# 1. 콜렉션 만들어서 토큰 담을 변수 만들기

![Screen Shot 2021-04-24 at 2 14 17 PM](https://user-images.githubusercontent.com/73287554/115948294-5045b880-a508-11eb-8b41-f725ef8af9d0.png)

1.  `Collection`을 누른다.
2.  `Create new Collecton`을 누른다.
3.  `Auth`를 누른다.
4.  `Bearer Token`을 누른다. (상황에 맞게 고르시면 됩니다~~~,,, 저는 jwt를 쓸 거니깐 Bearer token을 고른 거예용~~~)
5.  토큰 변수명으로 적당한 이름을 입력한다. (저는 늘 \{\{authToken\}\}이라고 입력한답니다~!!)

## 이제 이 콜렉션에 새 리퀘스트를 포함시키러 갈까용??!?!! 고고씽~!!!!

# 2. '로그인 컨트롤러'처럼 토큰 발급해주는 리퀘스트에서 자동화 코드 작성하기

![](https://user-images.githubusercontent.com/73287554/115948275-386e3480-a508-11eb-996d-ec97e3152adc.png)

## "세상의 모든 토큰 관련 컨트롤러는 둘로 나눌 수 있어. 하나는 토큰을 발급해주는 컨트롤러, 다른 하나는 토큰을 확인하는 컨트롤러"

쉽게 얘기하자면 사용자가 `로그인`을 하면 서버는 사용자에게 토큰을 건네주고, 사용자가 `마이페이지`처럼 개인화 된 페이지를 보려면 사용자로부터 토큰을 받아서 '당신이 바로 그 사람이군~!!!' 하고 검사를 해야 돼용.

아.무.튼! 우리가 할 작업은 로그인 컨트롤러가 작동하면 생성되는 토큰을 authToken이라는 변수에 담아주는 일이랍니다.

1. `Tests` 클릭하기
2. `response`를 보고 토큰이 어디에 있는지 확인
3. `Tests` 내에 코드 작성하기

```js
// pm은 postman의 약자랍니다~

// status code가 201일 때에는 201로 써줘야 한다는 사실 주의하세요!
if (pm.response.code === 200) {
	pm.environment.set("authToken", pm.response.json().token);
}
```

# 3. '마이페이지 컨트롤러'처럼 토큰 확인하는 리퀘스트에서 확인하기

![Screen Shot 2021-04-24 at 2 18 14 PM](https://user-images.githubusercontent.com/73287554/115948283-3efcac00-a508-11eb-878d-a9b5616c190e.png)
서버 입장에서는 사용자가 /users/me에 GET 요청을 보낼 때 로그인한 사용자마다 다른 정보를 보내줘야겠죠~~?
(너무나 당연한 걸 묻는 저란 인간,,,,)
제대로 되나 확인해볼까요???

1. `authorization을` 누른다.
2. `inherit auth from parent`를 누른다. (컬렉션에서 이미 authenticaton 방식을 Bearer Token으로 지정해줬기 때문에 inherit을 하면 당연히 Bearer Token으로 자동 선택되는 거랍니다~~! 간편하죠???)
3. `send`를 누르면 토큰이 자동으로 적용된 모습을 뙇!!!!하고 보실 수 있을 거예요,,,!(사진이 짤렸네요 뎨둉🙏)

## 어때요?? 어렵지 않죠????

![](https://mblogthumb-phinf.pstatic.net/20131017_111/yeji4152_1381971112317OC92E_PNG/moon_002.png?type=w210)

## 그럼 모두 해피코딩~~
