# functional-flattener

Modify JS object functionally and precisely

### 소개

1. 라이브러리가 해결하고자 하는 문제 :  서버와 클라이언트 앱의 구현 언어가 다른데 서버에서 따로 처리하지 않은 경우에 HTTP요청을 해서 받은 JSON 객체의 key값이 JS에서 주로 사용하는 카멜케이스가 아닌 다른 케이스일 경우가 있다(Django의 경우는 스네이크 케이스). 프론트엔드에서 ESLint를 적용중이라면, 카멜케이스가 아닌 다른 케이스의 키를 참조하는 것 만으로도 에러가 발생한다. 따라서 JSON 객체의 키를 일괄적으로 케이싱할 수 있는 도구가 필요하다.
2. 부가 기능 : HTTP 요청을 JSON을 받았을 때 해당 객체를 클라이언트 앱에서 쓰기 좋도록 수정을 해야하는 상황이 있다(Data Adapting). TravelFlan FE팀에서는 이렇게 서버로부터 응답받은 객체를 수정하는 순수함수를 `flattener` 라고 명명하고, 관습적으로 사용하고 있다. 이 라이브러리에서는 위에서 언급한 일괄적인 케이싱뿐만 아니라 객체를 효과적으로 수정할 수 있는 방법을 제공한다.
3. 함수형 : 명령형 프로그래밍으로 객체를 일일히 풀어헤쳐 새로운 객체를 만들어 리턴하는 식의 `imperative flattener`의 로직은 장황하고, 가독성에도 좋지 않다. 함수형 프로그래밍과 메서드 체이닝을 적용하면 객체 전체를 풀어헤칠 필요 없이 후가공이 필요한 프로퍼티에만 접근이 가능하다. 그래서 이 라이브러리의 이름과 구현하고자 하는 것은 결과적으로 `functional flattener`이다.

### API(v1.0.0~)

```tsx
const { flattenedUserInfo, flattenedUserFriend } = flattener(target:UserInfo)
  .casing({to:'camel'})
  .process({
    userName: (userNameArr:Array) => userNameArr.map(elem => elem + '님'),
    userId: (userId:number) => toString(userId),
    userFriend: {
        friendlyFriend: 
    }
  })
  .generate({
    userHobbyString: this.target.hobbies.join(',')
  })
  .seperate({
    flattenedUserInfo: [이거, 저거, 저거, 이거],
    flattenedUserFriend: [저거, 이거, 그거, 조거]
  })
  .returnResult()
```

1. flattner : flattnerTarget 객체를 만드는 팩토리 함수. flattnerTarget객체를 반환한다. 옵션으로 무언가를 넘기고 싶은데 옵션으로 쓸만한걸 모르겠다. 이하로 체이닝되는 각 메소드들은 새로운 flattenerTarget객체를 반환하기 때문에 계속 체이닝이 가능하다. 
2. casing : 전체 객체의 키를 순회하며 일괄적으로 케이싱을 하는 flattnerTarget 클래스의 메소드. 파스칼과 카멜케이스로의 변환을 지원한다. 
3. process: 케이싱한 후 객체를 후처리한다. 인자로 객체를 넘기는데 프로퍼티 이름은 케이싱된 결과와 똑같이 설정하고 해당 프로퍼티의 값을 인자로 받는 콜백함수를 넘기면 그 리턴값대로 처리된다.
    - 예외처리) 인자로 설정한 값의 타입이 맞지 않을 때 에러
4. generate : 기존의 키 프로퍼티를 바탕으로 새로운 인자를 객체에 추가한다.
5. seperate : 객체에 프로퍼티 이름을 배열로 전달하여 분리시킨다. 가장 상위의 프로퍼티에만 접근이 가능하다.
    - 예외처리) 상위 프로퍼티에 배열의 요소가 없을때 에러
6. returnResult : 프로세스된 프로퍼티를 반환한다. flattnerTarget의 멤버변수인 일반 자바스크립트 객체를 반환