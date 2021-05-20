---
title: Jest, Supertest를 이용한 authentication 검사
date: 2021-05-20 15:58:00
categories:
    - Jest
    - Supertest
tags: [Jest, Supertest, Testing Framework]
---

Udemy에서 [The Complete Node.js Developer Course (3rd Edition) 강의](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/)을 들으며 배운 내용입니다.

---

> Jest와 Supertest를 이용해서 Authentication 검사 작업을 검사해보자.

<!-- more -->

[npmjs.com/package/supertest](https://www.npmjs.com/package/supertest)

# 사전 설정

(검사하기 편하도록 index.js를 app.js와 index.js로 쪼개놨는데 그 과정은 코드만 적고 설명은 생략한다.)

```js
// app.js
const express = require("express");
const morgan = require("morgan");

require("./db/mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

app.use(userRouter);
app.use(taskRouter);

module.exports = app;
```

```js
// index.js
const app = require("./app");
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`);
});
```

# 검사하기

우선 더미데이터 하나를 넣어주는 코드를 만들자.  
그리고 `beforeEach()`를 사용해서 테스트를 할 때마다 도큐먼트를 깨끗이 비워주는 코드를 작성하자.

```js
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");
require("dotenv").config();

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: "TestUser",
	email: "test@testuser.com",
	password: "pass1word1234!",
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
		},
	],
};

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});
```

이제 본격적으로 `signup`과 `signin`, `내 정보 보기`가 제대로 되는지 테스트해보자.

## signup 검사

`signup`과 관련해서 살펴봐야 하는 점은 다음과 같다.

-   제대로 데이터베이스에 로우가 들어가는지(null이면 안된다.)
-   입력한 대로 사용자정보가 제대로 들어갔는지.

```js
test("Should signup a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Haeseung",
			email: "asdf123@asdf1.com",
			password: "pass1word1234!",
		})
		.expect(201);

	// Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// Assertions about the response
	expect(response.body).toMatchObject({
		user: {
			name: "Haeseung",
			email: "asdf123@asdf1.com",
		},
		token: user.tokens[0].token,
	});
	expect(user.password).not.toBe("password1!");
});
```

expect(user).not.toBenull()을 눈여겨보자.  
그리고 object를 비교할 때에는 .toMatchObject({})를 쓴다는 점도 눈여겨 보자.

## signin 검사

`signin`과 관련해서 살펴봐야 하는 점은 다음과 같다.

-   로그인이 제대로 되는지
-   토큰은 제대로 발급 되는지

```js
test("Should login existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({ email: userOne.email, password: userOne.password })
		.expect(200);

	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});
```

## 내 정보 보기 검사

`내 정보 보기`와 관련해서 살펴봐야 하는 점은 다음과 같다.

-   헤더에 토큰을 넣어서 요청하는지

```js
test("Should get profile for user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});
```

set()을 사용하면 된다.
