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
    userFriends: userProfile.userFriends.map((friend) => {
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

- flattening에 필요한 메소드를 제공하는 클래스입니다.
- 멤버변수로 인스턴스 생성시에 파라미터로 제공해야 하는 `Target Object`를 가지고 있습니다.
- 이 클래스의 모든 메소드들은 순수하게 새로운 FlattenTarget 클래스의 인스턴스를 리턴하기 때문에, 메소드 체이닝이 가능합니다. `returnResult()` 메소드를 사용해야만 일반 객체를 반환합니다.

### 2. flattener()

```ts
flattener({
  userId: 12424,
  userName: 'max',
  userAge: 25,
})//...다른 메소드들을 체이닝합니다. 
```

- FlattenTarget 인스턴스를 만들어 리턴하는 팩토리 함수입니다. 라이브러리를 이용해 객체를 변경하는 행위의 시작점이 되는 함수입니다.
- FlattenTarget 인스턴스를 리턴하기 때문에, 바로 FlattenTarget 클래스의 메소드들을 체이닝할 수 있습니다.
- 인자로 자바스크립트 객체를 받습니다.

### 3. case()

```ts
const result = flattener({
  user_id: 12424,
  user_name: 'Max',
  user_age: 25,
// casingOption은 camel과 snake를 지원합니다.
}).case({to:'camel'}).returnResult()

// Result will be { userId: 12424, userName: 'Max', userAge: 25 }
```

- case 메소드는 target 객체의 key를 일괄적으로 케이싱하는 메소드입니다.
- 인자로 casingOption 객체를 받습니다. 객체의 to 프로퍼티로 'camel' 혹은 'snake' 옵션을 주어 객체의 모든 키의 케이싱을 일괄적으로 바꿀 수 있습니다.
- 이미 객체의 key가 casingOption에서 명시된 케이싱이라면, 해당 key를 무시합니다.

### 4. changeKey()

```ts
const result = flattener({
  userId: 12424,
  userName: 'Max',
  userAge: 25,
  userProfile: {
    userIntroduce: 'Hi! My name is Max',
    userFavoriteAnimal: 'zebra',
  }
// changeKeyPlan의 key는 기존 target의 key, value는 새로운 key입니다.
// 객체 프로퍼티의 key를 바꾸고 싶을 경우, ':'을 이용합니다.
}).changeKey({
  userAge:'userCurrentName',
  'userProfile:userInfo': {
    userFavoriteAnimal: 'userAnimal'
  }
}).returnResult()

/* 
Result will be
{ 
  userId: 12424, 
  userName: 'Max', 
  userCurrentAge: 25,
  userInfo: {
    userIntroduce: 'Hi! My name is Max',
    userAnimal: 'zebra',
  }
}
*/
```

- 이미 존재하는 객체 프로퍼티의 key를, 메소드에 넘기는 `changeKeyPlan` 파라미터에 명시된 값으로 바꿉니다.
- `changeKeyPlan`은 객체이며 기본적으로는 교체할 target의 key를 plan의 key로, 새로운 key를 문자열 값으로 가집니다. 
- 다만 바뀌어야할 target의 특정 key가 객체를 값으로 가진다면, 문자열 값을 명시해줄 수 없기 때문에 콜론(`:`)을 사용하여 교체할 target의 키와 함께 새로운 키를 명시해줄 수 있습니다.
- TypeScript 사용시 `ChangeKeyPlan` 타입을 참조할 수 있습니다.

### 5. process()

```ts
const result = flattener({
  userId: 12424,
  userName: 'Max',
  userAge: 25,
  userProfile: {
    userIntroduce: 'I love zebra.',
    userFavoriteAnimal: 'zebra',
  }
}).process((target:Target) => ({
  userId: 10000,
  userAge: (age:number) => `${age} years old`,
  userProfile: {
    userIntroduce: (text:string) => `Hello! My name is ${target.userName}. ${text}`,
  },
})).returnResult()

/* 
Result will be
{ 
  userId: 10000 
  userName: 'Max', 
  userAge: '25 years old',
  userProfile: {
    userIntroduce: 'Hello! My name is Max. I love zebra.',
    userFavoriteAnimal: 'zebra',
  }
}
*/
```

- 이미 존재하는 객체 프로퍼티들의 값을 메소드에 넘기는 `processPlan` 파라미터에 명시된 값으로 가공하거나, 명시된 함수를 실행한 값으로 가공하는 메소드입니다. 
- `processPlan` 파라미터는 target object를 인자로 받는 함수입니다. 이 함수가 리턴하는 객체의 프로퍼티들은 target object를 참조할 수 있습니다.
- `processPlan`함수가 리턴하는 객체 프로퍼티의 값으로는 **기존 target 객체 프로퍼티가 가진 값을 인자로 하는 콜백 함수** 또는 **특정 값**을 명시할 수 있습니다. 콜백 함수일때는 기존 target 객체 프로퍼티의 값에 콜백 함수를 적용해 가공한 값으로 바뀌며, 특정 값일때는 target의 값에 overwrite됩니다.
- `processPlan` 객체 프로퍼티의 key로는 target object에 이미 존재하는 key만 명시할 수 있습니다. 그렇지 않은 key는 무시합니다.
- `target object`에 이미 존재하는 프로퍼티만 process할 수 있기 때문에 객체에 새로운 프로퍼티를 추가하고 싶다면 `augment` 메소드를 사용해야 합니다.
- `process` 메소드에서 여러 객체 프로퍼티들의 변화는 서로 **독립적**입니다. `processPlan`객체의 값으로 넘긴 콜백 함수는 이미 process된 객체의 프로퍼티를 참조하지 않고 원래 target 객체의 프로퍼티의 값만을 참조합니다.

### 6. augment()

```ts
const result = flattener({
  userId: 12424,
  userName: 'Max',
  userAge: 25,
  userProfile: {
    userProfileText: 'My Name is Max.',
    userFavoriteAnimal: 'zebra',
  }
}).augment((target:Target) => {
  const { userProfileText, userFavoriteAnimal } = target.userProfile
  return {
    isUserAdult: target.userAge > 19
    userProfile: {
      userIntroduce: `${userProfileText} My favorite animal is ${userFavoriteAnimal}.`,
    }
  },
}).returnResult()

/*
Result will be
{ 
  userId: 10000 
  userName: 'Max', 
  userAge: 25,
  isUserAdult: true,
  userProfile: {
    userProfileText: 'My Name is Max.',
    userFavoriteAnimal: 'zebra',
    userIntroduce: 'My name is Max. My favorite animal is zebra.',
  }
}
*/
```

- target 객체에 새로운 프로퍼티를 삽입하여 객체를 증강시키는 메소드입니다.
- `augmentPlan` 파라미터는 target object를 인자로 받는 함수입니다. 이 함수가 리턴하는 객체의 프로퍼티들은 target object를 참조할 수 있습니다.
- `augmentPlan` 객체의 값은 함수를 가질 수 없습니다. target 객체에 새롭게 추가되는 프로퍼티는 특정 값이거나, target object만을 참조하여 만들어져야 합니다.
- `augmentPlan` 객체에는 기존 `target object`에는 없는 새로운 key 값만 포함하는 것을 권장합니다. `augment()` 메소드가 **증강**에 초점을 맞추고 있어서 그렇습니다. plan 객체에 기존 key값을 사용해 새로운 값을 넘겨주는 방식으로 객체를 수정할 수는 있지만, 이는 이미 '가공'에 좀 더 초점이 맞춰져 있는 `process()` 메서드에서도 가능한 동작입니다.

### 7. extract()

```ts
const result = flattener({
  userId: 12424,
  userName: 'Max',
  userAge: 25,
  userProfile: {
    userProfileText: 'My Name is Max.',
    userFavoriteAnimal: 'zebra',
    userImage : {
      mobile: '/image/12424/mobile',
      desktop: '/image/12424/desktop',
    }
  }
}).extract([
  'userId',
  'userProfile.userProfileText',
  'userProfile.userProfileImage.mobile',
]).returnResult()

/*
Result will be
{ 
  userName: 'Max', 
  userAge: 25,
  userProfile: {
    userProfileText: 'My Name is Max.',
    userFavoriteAnimal: 'zebra',
    userImage : {
      desktop: '/image/12424/desktop',
    }
  }
}
*/
```

- target 객체의 프로퍼티를 삭제하여 객체를 축소시키는 메소드입니다.
- `extractPlan`은 문자열로 이루어진 배열이며, 도트 연산자(`.`)를 통해 제거할 객체의 프로퍼티를 표현합니다.

### 8. returnResult()

- 위 다른 메소드들의 예시에서 볼 수 있듯, `returnResult()` 메소드는 `FlattenTarget` 인스턴스에서 변경이 끝난 `target object`를 반환합니다. 
- 자바스크립트 변수에 변경이 완료된 객체를 담을 때는 꼭 이 메소드를 사용해 `FlattenTarget` 인스턴스에서 일반 자바스크립트 객체인 `target object`를 반환해야 합니다.
- `flatten()` 함수가 객체의 수정을 시작하는 진입점이라면, `returnResult()`는 수정을 마무리하는 메소드입니다.

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

1. Add `FlattenTarget.prototype.modify()` : This method can modify target object according to modify plan. `Modify()` will be a superset method of process, changeKey, augment and extract method. It will be going to operate those method`s modification all at once.
2. Add `README.md` written in English
3. Add More Detail error handling
4. Add More test cases

## Contribution

