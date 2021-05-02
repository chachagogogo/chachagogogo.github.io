---
title: Mongoose에서 validation 작업하기
date: 2021-05-03 00:30:26
categories:
  - MongoDB
tags: [Mongoose, MongoDB]
---

Udemy에서 [The Complete Node.js Developer Course (3rd Edition) 강의](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/)을 들으며 배운 내용입니다.

---

Mongoose에서 validation 작업은 schema에서 하면 된다.  
[SchemaType.prototype.validate()](https://mongoosejs.com/docs/api.html#schematype_SchemaType-validate)이라는 method, 그리고 [validator](https://www.npmjs.com/package/validator)라는 패키지를 이용한다.

공식문서에서 [Custom Validators](https://mongoosejs.com/docs/validation.html#custom-validators)라는 페이지의 예제 코드를 보면 얼추 감이 올 것이다.

아래는 Udemy 강의 코드 일부분이다.

```js
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error("Age must be a positive number");
			}
		},
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid");
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 7,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Password cannot contain 'password'");
			}
		},
	},
});
```
