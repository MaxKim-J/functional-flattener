import flattener, { Target } from '../../lib'

// Composing all methods in this test suites

interface Animal {
  id:number,
  animalName: string
}

interface Friend {
  id: number,
  name: string,
  favoriteAnimal: Animal
}

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

const nullMockData = {
  user_id: 34654,
  user_name: 'Max',
  user_level: 0,
  user_age: null,
  user_profile: {
    user_profile_text: null,
    user_favorite_animal: null,
    user_profile_image: {
      mobile: null,
      desktop: null,
    },
  },
  user_friends: [],
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

const removePlan = [
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

describe('Functional Flattener lib should', () => {
  it('return a modified object according to methods and plan', (done) => {
    const result = flattener(mockData).case({ to: 'camel' })
      .process(processPlan)
      .augment(augmentPlan)
      .remove(removePlan)
      .returnResult()

    expect(result).toEqual({
      userName: 'max',
      userAge: 25,
      isRecentSignUser: true,
      isUserAdult: true,
      userProfile: {
        userProfileText: 'Hello! My name is max. I Love Zebra',
        userFavoriteAnimal: { id: 3, animalName: 'vulture' },
        userFriendsFavoriteAnimals: ['tiger', 'lion', 'monkey'],
        userProfileImage: {
          desktop: '/image/12424/desktop',
        },
        userFriends: [
          { id: 12324, name: 'julie the tiger', favoriteAnimal: { id: 0, animalName: 'tiger' } },
          { id: 11424, name: 'michael the lion', favoriteAnimal: { id: 1, animalName: 'lion' } },
          { id: 18924, name: 'shawn the monkey', favoriteAnimal: { id: 2, animalName: 'monkey' } },
        ],
      },
    })
    done()
  })

  it('return a modified object according to methods and plan. (In case of Data Adapting)', (done) => {
    const result = flattener(mockData).case({ to: 'camel' })
      .process(processPlan)
      .augment(augmentPlan)
      .remove(removePlan)
      .changeKey(changePlan)
      .case({ to: 'snake' })
      .returnResult()
    expect(result).toEqual({
      user_name: 'max',
      user_current_age: 25,
      is_recent_sign_user: true,
      is_user_adult: true,
      user_current_profile: {
        user_introduce: 'Hello! My name is max. I Love Zebra',
        user_animal: { id: 3, name: 'vulture' },
        user_friends_favorite_animals: ['tiger', 'lion', 'monkey'],
        user_profile_image: {
          desktop: '/image/12424/desktop',
        },
        user_friends: [
          { id: 12324, name: 'julie the tiger', favorite_animal: { id: 0, animal_name: 'tiger' } },
          { id: 11424, name: 'michael the lion', favorite_animal: { id: 1, animal_name: 'lion' } },
          { id: 18924, name: 'shawn the monkey', favorite_animal: { id: 2, animal_name: 'monkey' } },
        ],
      },
    })
    done()
  })
})

describe('Null exception handle tests', () => {
  it('case() method should be operate expectedly when target object key value is null or undefined', (done) => {
    const result = flattener(nullMockData).case({ to: 'camel' }).returnResult()
    expect(result).toEqual({
      userId: 34654,
      userName: 'Max',
      userLevel: 0,
      userAge: null,
      userProfile: {
        userProfileText: null,
        userFavoriteAnimal: null,
        userProfileImage: {
          mobile: null,
          desktop: null,
        },
      },
      userFriends: [],
    })
    done()
  })

  it('changeKey() method should be operate expectedly when target object key value is null or undefined', (done) => {
    const result = flattener(nullMockData).case({ to: 'camel' }).changeKey({
      userLevel: 'userRank',
      userAge: 'userCurrentAge',
      'userProfile:userInfo': {
        userProfileText: 'userIntroduce',
        userFavoriteAnimal: 'userAnimal',
        userProfileImage: {
          mobile: 'mobileImage',
          desktop: 'desktopImage',
        },
      },
      userFriends: 'friendsOfUser',
    }).returnResult()
    expect(result).toEqual({
      userId: 34654,
      userName: 'Max',
      userRank: 0,
      userCurrentAge: null,
      userInfo: {
        userIntroduce: null,
        userAnimal: null,
        userProfileImage: {
          mobileImage: null,
          desktopImage: null,
        },
      },
      friendsOfUser: [],
    })
    done()
  })

  it('process() method should be operate expectedly when target object key value is null or undefined', (done) => {
    const result = flattener(nullMockData).case({ to: 'camel' }).process((target) => {
      const notNullUserAge = target.userAge || 0
      return {
        userId: target.userId - 10000,
        userAge: notNullUserAge + 100,
        userFriend: (friends:Friend[]) => friends.map((friend) => ({ ...friend, introduce: `Hi! My name is ${friend.name}.` })),
      }
    }).returnResult()
    expect(result).toEqual({
      userId: 24654,
      userName: 'Max',
      userLevel: 0,
      userAge: 100,
      userProfile: {
        userProfileText: null,
        userFavoriteAnimal: null,
        userProfileImage: {
          mobile: null,
          desktop: null,
        },
      },
      userFriends: [],
    })
    done()
  })

  it('augment() method should be operate expectedly when target object key value is null or undefined', (done) => {
    const result = flattener(nullMockData).case({ to: 'camel' }).augment((target) => {
      //* assure no null in plan parameter return object
      const { userProfileText } = target.userProfile
      const notNullUserAge = target.userAge || 25
      return {
        isRecentlySignUpUser: target.userId > 20000,
        isUserUnderAge: notNullUserAge < 19,
        userProfile: {
          userIntroduce: userProfileText ? `Hi. ${userProfileText}` : '',
        },
      }
    }).returnResult()
    expect(result).toEqual({
      userId: 34654,
      isRecentlySignUpUser: true,
      isUserUnderAge: false,
      userName: 'Max',
      userLevel: 0,
      userAge: null,
      userProfile: {
        userIntroduce: '',
        userProfileText: null,
        userFavoriteAnimal: null,
        userProfileImage: {
          mobile: null,
          desktop: null,
        },
      },
      userFriends: [],
    })
    done()
  })
})
