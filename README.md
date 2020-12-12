# 🪒 functional-flattener

Modify JS object functionally and precisely

## About

`fucntional-flattener`는 JS의 `Array`가 `map`, `filter` 등의 `Array.prototype` 메서드를 이용하여 수정될 수 있는 것과 같은 원리로, **함수형 프로그래밍**을 통해 JS `Object`를 수정하기 위해 만들어졌습니다. JS `Object`를 개발자의 의도에 맞게 수정할 수 있도록 하는 몇 가지의 메소드들과, 함수형 프로그래밍에서 영감을 받은 메소드 체이닝을 지원합니다.

## Pros

### 1. Effective Data Adapting

#### Casing

- 서버와 클라이언트 앱의 구현 언어가 다른데 서버에서 따로 처리하지 않은 경우에 HTTP요청을 해서 받은 JSON 객체의 key값이 JS에서 주로 사용하는 카멜케이스가 아닌 다른 케이스일 경우가 있습니다(Django의 경우는 스네이크 케이스)
- Node기반 클라이언트에서 ESLint를 적용중이라면, 카멜케이스가 아닌 다른 케이스의 키를 참조하는 것 만으로도 에러가 발생합니다. 따라서 JSON 객체의 키를 일괄적으로 케이싱할 수 있는 도구가 필요합니다.
- `functional-flattener`는 객체의 모든 `key`를 일괄적으로 카멜, 스네이크 케이스로 casing하는 메소드를 지원합니다. 

#### Pre-Processing

- HTTP 요청을 통해 JSON 객체를 받았을 때 해당 객체를 클라이언트 앱에서 쓰기 좋도록 수정을 해야하는 상황이 있습니다.
- TravelFlan FE팀에서는 이렇게 서버로부터 응답받은 객체를 클라이언트의 `use-case`에 맞게 수정하는 순수함수를 `flattener` 라고 명명하고, 관습적으로 사용하고 있습니다.
- `functional-flattener`는 위에서 언급한 일괄적인 케이싱뿐만 아니라 객체를 효과적으로 수정할 수 있는 메소드들을 제공하며, 메소드 체이닝을 통해 객체가 수정되는 과정들을 효과적으로 적용할 수 있게 했습니다.

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

## API(v1.0.0~)

### 1. FlattenTarget Class
### 2. flattener

### 3. case()

### 4. changeKey()
### 5. process()

### 6. augment()

### 7. extract()
### 8. returnResult()

### Full Example

```tsx
import { flattener, Target } from './flattener'

const mockData = {
  user_id: 12424,
  user_name: 'max',
  user_age: 25,
  user_profile: {
    user_profile_text: 'I Love Zebra',
    user_favorite_animal: { id: 3, animal_name: 'vulture' },
    userProfileImage: {
      mobile: '/image/12424/mobile',
      desktop: '/image/12424/desktop',
    },
    user_friends: [
      { id: 12324, name: 'julie', favorite_animal: { id: 0, animal_name: 'tiger' } },
      { id: 11424, name: 'michael', favorite_animal: { id: 1, animal_name: 'lion' } },
      { id: 18924, name: 'shawn', favorite_animal: { id: 2, animal_name: 'monkey' } },
    ],
  },
}

const processPlan = (target:Target) => ({
  userId: (id:number) => id + 10000,
  userProfile: {
    userProfileText: (text:string) => `Hello! My name is ${target.userName}. ${text}`,
    userFriends: (friends:Friend[]) => friends.map(
      (friend:Friend) => ({ ...friend, name: `${friend.name} the ${friend.favoriteAnimal.animalName}` }),
    ),
  },
})

const augmentPlan = (target:Target) => ({
  isRecentSignUser: target.userId > 10000,
  isUserAdult: target.userAge > 19,
  userProfile: {
    userFriendsFavoriteAnimals: target.userProfile.userFriends.map(
      (friend:Friend) => friend.favoriteAnimal.animalName,
    ),
  },
})

const extractPlan = [
  'userId',
  'userProfile.userProfileImage.mobile',
]

const changePlan = {
  userAge: 'userCurrentAge',
  'userProfile:userCurrentProfile': {
    userProfileText: 'userIntroduce',
    'userFavoriteAnimal:userAnimal': {
      animalName: 'name',
    },
  },
}

const result = flattener(mockData).case({ to: 'camel' })
      .process(processPlan)
      .augment(augmentPlan)
      .extract(extractPlan)
      .returnResult()
```

## Q&A

### 객체 안의 배열은 어떻게 modify 하나요?

### process와 augment를 나눠놓은 이유

## ToDo

- README written in English
- More Detail error handling
- More test cases

## Contribution

