---
title: Multer, Sharp로 파일 업로드하기
date: 2021-05-05 22:15:00
categories:
  - JS_Library
tags: [Multer, Sharp]
---

Udemy에서 [The Complete Node.js Developer Course (3rd Edition) 강의](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/)을 들으며 배운 내용입니다.

---

> Multer 라이브러리를 이용해서 아바타 사진을 프로필에 올리는 방법을 배웠다. 이를 응용해서 다양한 파일을 올릴 수 있을 것이다.

[Multer 더 알아보기](https://www.npmjs.com/package/multer)  
[Sharp 더 알아보기](https://www.npmjs.com/package/sharp)

<!-- more -->

아래와 같이 User 스키마에 avatar라는 프로퍼티를 만든다. 타입은 `버퍼`로 지정한다.

```js
const userSchema = new mongoose.Schema({
	// 윗 부분 생략
	avatar: {
		type: Buffer,
	},
});
```

---

multer 설정을 해준다.

- 파일 크기 제한은 `limits: { fileSize: 1_000_000 }`처럼 한다. 단위는 바이트이다. 1백 만 바이트 = 1메가 바이트. (Numeric Seperator는 정~말 좋다. 쓸 때마다 편리하다.)
- 파일 확장자 제한은 `fileFilter`를 사용한다. 주석 처리한 것처럼 `file.originalname.endsWith('.pdf')`로 해도 되고, 아니면 `file.originalname.match(/정규표현식/)`를 사용해서 정규표현식을 써도 된다.

```js
const upload = multer({
	limits: {
		fileSize: 1_000_000,
	},
	fileFilter(req, file, cb) {
		// if(!file.originalname.endsWith('.pdf'))
		// match는 정규표현식에 사용. 정규표현식은 // 내부에 써야 한다는 점 주의.
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Please upload an image file"));
		}
		cb(undefined, true);
	},
});

---

- 위에서 작성한 multer 설정을 middleware로 넣는다.
- `upload.single('avatar')`의 인자 avatar는 **key name**임을 기억해두자.
- sharp 라이브러리는 업로드되는 파일에 통일성을 부여해주는 라이브러리이다. 사진 크기, 확장자 등이 이에 해당된다.
- 사용자가 어떻게 resize할지는 프론트엔드쪽에서 해야 하는 작업이다.

router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	// 업로드시 에러메시지를 json 형식으로 깔끔히 출력하기 위한 함수.
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
```

---

- 프로필에서 avatar 사진을 지울 때에는 `undefined`를 할당하면 된다.
- binary 코드를 이미지로 렌더링하는 방법은 `res.set()`을 사용해서 처리한다.

```js
router.delete("/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}

		// Binary -> 이미지로 렌더링
		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send();
	}
});
```

# 포스트맨으로 작업하기

![image](https://user-images.githubusercontent.com/73287554/117146028-bc6cca00-adee-11eb-8064-982546d4adfb.png)

1. Body에서 `form-data`를 선택.
2. key에 정확한 이름을 적기. 마우스로 File 선택하기.
3. Value에 Select Files 누르고 파일 누르기.

(사진에서는 GET 요청으로 되어있지만 당연히 POST 요청을 해야 업로드가 된다.)
