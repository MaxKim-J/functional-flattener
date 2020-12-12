import flattener, { Target } from '../../lib'

interface Animal {
  id:number,
  animalName: string
}

interface Friend {
  id: number,
  name: string,
  favoriteAnimal: Animal
}

// Premise that target object already camel-cased
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

const processPlan = (target:Target) => ({
  userId: 1,
  userAge: (age:number) => `${age} years old`,
  userProfile: {
    userProfileText: (text:string) => `Hello! My name is ${target.userName}. ${text}`,
    userFriends: (friends:Friend[]) => friends.map(
      (friend:Friend) => ({ ...friend, name: `${friend.name} the ${friend.favoriteAnimal.animalName}` }),
    ),
  },
})

describe('FlattenTarget.process() method should', () => {
  it('return a modified object according to process plan parameter.', (done) => {
    const result = flattener(mockData).process(processPlan).returnResult()
    expect(result).toEqual({
      userId: 1,
      userName: 'max',
      userAge: '25 years old',
      userProfile: {
        userProfileText: 'Hello! My name is max. I Love Zebra',
        userFavoriteAnimal: { id: 3, animalName: 'vulture' },
        userFriends: [
          { id: 12324, name: 'julie the tiger', favoriteAnimal: { id: 0, animalName: 'tiger' } },
          { id: 11424, name: 'michael the lion', favoriteAnimal: { id: 1, animalName: 'lion' } },
          { id: 18924, name: 'shawn the monkey', favoriteAnimal: { id: 2, animalName: 'monkey' } },
        ],
      },
    })
    done()
  })
})
