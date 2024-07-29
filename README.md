# _my-link-tree_

### [프로젝트 개요]

- #### '링크 트리 서비스' 를 위한 백엔드 구현

### [프로젝트 내용]

- #### 개발 스택은 NestJS 프레임워크 기반 인증 처리는 JWT를, 데이터 처리는 MongoDB를 사용함
- #### 일부 API는 JWT 토큰을 기반으로 API를 요청해야 함
- #### Swagger(http://localhost:3000/api-docs) 기반 API 관련 확인이 가능함

- #### API 구현 항목
  - ##### 사용자 로그인: [POST] /auth/login { userEmail, userPw }
  - ##### 사용자 등록: [POST] /users { userUrn, userEmail, userPw, userName, userDesc, userJob }
  - ##### 사용자 정보 수정: [PUT] /users/:userUrn { userEmail, userPw?, userName?, userDesc?, userJob? }
  - ##### 사용자 삭제: [DELETE] /users/:userUrn { userPw }
  - ##### 사용자 링크 정보 등록: [POST] /users/:userUrn/link { link, linkType, linkName }
  - ##### 사용자 링크 정보 수정: [PUT] /users/:userUrn/link { linkNum, link?, linkType?, linkName? }
  - ##### 사용자 링크 클릭: [POST] /users/:userUrn/link/:clickId
  - ##### 사용자 좋아요 클릭: [POST] /users/:userUrn/like { likeUrn }
  - ##### 사용자 비밀번호 재설정: [POST] /users/:userUrn/search { userEmail }
  - ##### 사용자 프로필 업로드: [POST] /users/:userUrn/upload { file }
  - ##### 이메일 중복 체크: [POST] /emails { userEmail }
  - ##### 이메일 인증 메일 발송: [POST] /emails/:userUrn { userEmail }
  - ##### 이메일 인증 처리: [POST] /emails/:userUrn/verify { verifyCode }
  - ##### 사용자 링크 조회: [GET] /posts/:userUrn
  - ##### 사용자 링크 댓글 등록: [POST] /posts/:userUrn/comments { whois, note }
  - ##### 사용자 링크 댓글 삭제: [DELETE] /posts/:userUrn/comments/:commentId
- #### DB 설계 항목

  - ##### users

    | Name       | Type    | Note   |
    | ---------- | ------- | ------ |
    | userEmail  | string  |        |
    | userPw     | string  |        |
    | userUrn    | string  |        |
    | userName   | string  |        |
    | userDesc   | string  |        |
    | userJob    | string  |        |
    | userPhoto  | string  | base64 |
    | userValid  | boolean |        |
    | verifyCode | string  |        |
    | createdAt  | date    |        |

  - ##### userlinks

    | Name      | Type   | Note |
    | --------- | ------ | ---- |
    | clickId   | string |      |
    | userUrn   | string |      |
    | link      | string |      |
    | linkNum   | number |      |
    | linkType  | string |      |
    | linkName  | string |      |
    | linkCnt   | number |      |
    | createdAt | date   |      |

  - ##### userlikes

    | Name      | Type    | Note |
    | --------- | ------- | ---- |
    | userUrn   | string  |      |
    | likeUrn   | string  |      |
    | likeFlag  | boolean |      |
    | createdAt | date    |      |

  - ##### comments
    | Name      | Type   | Note |
    | --------- | ------ | ---- |
    | commentId | string |      |
    | userUrn   | string |      |
    | whois     | string |      |
    | note      | string |      |
    | createdAt | date   |      |

### [프로젝트 빌드 & 테스트 & 실행 방법]

- #### npm i && npm start

### [프로젝트 향후 계획]

- #### Unit/E2E 테스트 처리 및 고도화 작업
