# 🪒 functional-flattener

Modify JS object functionally and precisely

## About

`fucntional-flattener`는 JS의 `Array`가 `map`, `filter` 등의 `Array.prototype` 메서드를 이용하여 수정될 수 있는 것과 같은 원리로, **함수형 프로그래밍**을 통해 JS `Object`를 수정하기 위해 만들어졌습니다. JS `Object`를 개발자의 의도에 맞게 수정할 수 있도록 하는 몇 가지의 메소드들과, 함수형 프로그래밍에서 영감을 받은 메소드 체이닝을 지원합니다.

## Pros

### 1. Effective Data Adapting

#### Casing

- 서버와 클라이언트 앱의 구현 언어가 다른데 서버에서 따로 처리하지 않은 경우에 HTTP요청을 해서 받은 JSON 객체의 key값이 JS에서 주로 사용하는 카멜케이스가 아닌 다른 케이스일 경우가 있습니다(Django의 경우는 스네이크 케이스)
- Node기반 클라이언트에서 ESLint를 적용중이라면, 카멜케이스가 아닌 다른 케이스의 키를 참조하는 것 만으로도 에러가 발생합니다. 따라서 JSON 객체의 키를 일괄적으로 케이싱할 수 있는 도구가 필요합니다.
- `fucntional-flattener`는 객체의 모든 `key`를 일괄적으로 카멜, 스네이크 케이스로 casing하는 메소드를 지원합니다. 

#### Pre-Processing

- HTTP 요청을 통해 JSON 객체를 받았을 때 해당 객체를 클라이언트 앱에서 쓰기 좋도록 수정을 해야하는 상황이 있습니다.
- TravelFlan FE팀에서는 이렇게 서버로부터 응답받은 객체를 클라이언트의 `use-case`에 맞게 수정하는 순수함수를 `flattener` 라고 명명하고, 관습적으로 사용하고 있습니다.
- `fucntional-flattener`는 위에서 언급한 일괄적인 케이싱뿐만 아니라 객체를 효과적으로 수정할 수 있는 메소드들을 제공하며, 메소드 체이닝을 통해 객체가 수정되는 과정들을 효과적으로 적용할 수 있게 했습니다.

### 2. Economic Typing

```js
const mockData = {
  userId: 12424,
  userName: 'max',
  userAge: 25,
  userProfile: {
    userProfileText: 'I Love Zebra',
    userFavoriteAnimal: { id: 3, animalName: 'vulture' },
    userFriends: [
      { id: 12324, name: 'julie', favoriteAnimal: { id: 0, animalName: 'tiger' } },
      { id: 11424, name: 'michael', favoriteAnimal: { id: 1, animalName: 'lion' } },
      { id: 18924, name: 'shawn', favoriteAnimal: { id: 2, animalName: 'monkey' } },
    ],
  },
}

function flattener(data) {
  const { userId, userName, userAge, userProfile } = data

  const processedUserName = `Hi! I am ${userName}`
  const processedUserProfile = {
    ...userProfile,
    userFriends: userProfile.userFriends.map((freind) => {
      ...friend,
      name: `I am your friend name ${friend.name}.`
    })
  } 

  return {
    userId,
    userName : processedUserName,
    userAge,
    userProfile: processedUserProfile
  }
}

```

- 명령형 프로그래밍으로 객체를 일일히 풀어헤쳐 새로운 객체를 만들어 리턴하는 식의 `imperative flattener`의 로직은 장황하고, 가독성에도 좋지 않습니다. 
- 상황에 따라 전처리가 필요 없는 객체의 키와 프로퍼티를 타이핑할 수도 있고, 타이핑해야할 변수도 늘어날 수 있습니다.
- 함수형 프로그래밍과 메서드 체이닝을 적용하면 객체 전체를 풀어헤칠 필요 없이 전처리가 필요한 프로퍼티에만 접근이 가능합니다. 

## API(v1.0.1~)

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
5. separate : 객체에 프로퍼티 이름을 배열로 전달하여 분리시킨다. 가장 상위의 프로퍼티에만 접근이 가능하다.
    - 예외처리) 상위 프로퍼티에 배열의 요소가 없을때 에러
6. returnResult : 프로세스된 프로퍼티를 반환한다. flattnerTarget의 멤버변수인 일반 자바스크립트 객체를 반환

## Q&A

### 객체 안의 배열은 어떻게 modify 합니까

### 객체 안의 함수 property에 대한 process


## Contribution

