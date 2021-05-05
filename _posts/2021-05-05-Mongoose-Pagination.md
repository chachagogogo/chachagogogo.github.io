---
title: Mongoose Pagination
date: 2021-05-05 15:30:00
categories:
  - MongoDB
tags: [Mongoose, MongoDB]
---

Udemy에서 [The Complete Node.js Developer Course (3rd Edition) 강의](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/)을 들으며 배운 내용입니다.

---

> 구글에서 'pagination'이라고 검색하면 About 99,600,000 results (0.54 seconds)라고 뜬다. 하지만 9천9백만 개의 검색결과가 한 페이지에 다 뜨지는 않는다. 한번에 다 띄우면 서버 입장에서는 부담이 되고, 사용자 입장에서는 불편하기 때문이다. 이를 해결하는 방법으로는 page 번호 누르기, load more 버튼 누르기, 무한 스크롤 등이 있다. 이 모두 백엔드에서는 pagination에 속한다.

<!-- more -->

```js
/* 
1. GET /tasks?completed=true
2. GET /tasks?limit=10&skip=0
       limit: 한 페이지에 보여줄 데이터 개수, skip: 몇 번째 페이지인지
3. GET /tasks?sortBy=createdAt:desc
*/
router.get("/tasks", auth, async (req, res) => {
	const match = {};
	const sort = {};

	if (req.query.completed) {
		match.completed = req.query.completed === "true";
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(":");
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
		// asc: 1, desc: -1
	}

	try {
		await req.user
			.populate({
				path: "tasks",
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		res.send(req.user.tasks);
	} catch (error) {
		res.status(500).send();
	}
});
```

- populate 메소드에서 객체를 인자로 넣어주면 된다.
- params의 value값 true, false는 string인 점에 유의.
- params의 value값이 숫자여도 데이터타입은 string이기 때문에 parseInt를 해줘야 한다.

[더 알아보기](https://mongoosejs.com/docs/populate.html#query-conditions)
