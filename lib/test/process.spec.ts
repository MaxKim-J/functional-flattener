import flattener from '../../lib'
import { Target } from '../types'

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
    user_friends: [
      { id: 12324, name: 'julie', favorite_animal: { id: 0, animal_name: 'tiger' } },
      { id: 11424, name: 'michael', favorite_animal: { id: 1, animal_name: 'lion' } },
      { id: 18924, name: 'shawn', favorite_animal: { id: 2, animal_name: 'monkey' } },
    ],
  },
}

const processPlan = (target:Target) => ({
  userId: (id:number) => id + 10000,
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
    const result = flattener(mockData).casing().process(processPlan).returnResult()
    expect(result).toEqual({
      userId: 22424,
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

  it('return an error if particular key does not exist in process plan parameter.', (done) => {
    expect(() => {
      const result = flattener(mockData).casing().process(processPlan).returnResult()
    }).toThrow()
    done()
  })
})
