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

const augmentPlan = (target:Target) => ({
  isRecentSignUser: target.userId > 10000,
  isUserAdult: target.userAge > 19,
  userProfile: {
    userFriendsFavoriteAnimals: target.userFriends.map(
      (friend:Friend) => friend.favoriteAnimal.animalName,
    ),
    userFriends: (friend:Friend) => {
      const { userProfile: { userFavoriteAnimal: { animalName: userAnimalName } } } = target
      return {
        ...friend,
        isSameFavoriteAnimal: friend.favoriteAnimal.animalName === userAnimalName,
      }
    },
  },
})

describe('FlattenTarget.augment() method should', () => {
  it('return a augmented object according to augment plan parameter.', (done) => {
    const result = flattener(mockData).augment(augmentPlan).returnResult()
    expect(result).toEqual({
      userId: 1,
      userName: 'max',
      userAge: '25 years old',
      isRecentSignUser: true,
      isUserAdult: true,
      userProfile: {
        userProfileText: 'Hello! My name is max. I Love Zebra',
        userFavoriteAnimal: { id: 3, animalName: 'vulture' },
        userFriendsFavoriteAnimals: ['tiger', 'lion', 'monkey'],
        userFriends: [
          {
            id: 12324,
            name: 'julie the tiger',
            favoriteAnimal: { id: 0, animalName: 'tiger' },
            isSameFavoriteAnimal: false,
          },
          {
            id: 11424,
            name: 'michael the lion',
            favoriteAnimal: { id: 1, animalName: 'lion' },
            isSameFavoriteAnimal: false,
          },
          {
            id: 18924,
            name: 'shawn the monkey',
            favoriteAnimal: { id: 2, animalName: 'monkey' },
            isSameFavoriteAnimal: false,
          },
        ],
      },
    })
    done()
  })
})
