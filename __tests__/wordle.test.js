
import { jest } from '@jest/globals'

//make a mock for the getWord and isWord functions inside the Worldle class (anytime those functions are called in a test, they result in 'APPLE' and "true")
const mockIsWord = jest.fn(() => true)
jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord
    }
})
//import the Wordle object and build letter function
const { Wordle, buildLetter } = await import('../src/wordle.js')

//test the letter object creation
describe('building a letter object', () => {
    test('returns a letter object', () => {
        const letterObject = buildLetter('Z', 'ABSENT')
        expect(letterObject).toEqual({letter: 'Z', status: 'ABSENT'})
    })
})

//test multiple things in the wordle class
describe('constructing a new Wordle game', () => {
    test(`sets maxGuesses to 6 if no argument is passed`, () => {
        const wordleObj = new Wordle
        expect(wordleObj.maxGuesses).toBe(6)
    })
    test(`sets maxGuess to the argument passed in`, () => {
        const wordleObj = new Wordle(3)
        expect(wordleObj.maxGuesses).toBe(3)
    })
    test(`sets guesses to an array of length equal to maxGuesses`, () => {
        const wordleObj = new Wordle(4)
        expect(wordleObj.guesses.length).toBe(4)
    })
    test(`sets currGuess to 0`, () => {
        const wordleObj = new Wordle
        expect(wordleObj.currGuess).toBe(0)
    })
    test(`sets "word" to a word from getWord`, () => {
        const wordleObj = new Wordle()
        expect(wordleObj.word).toBe('APPLE')
    })
})

describe('make sure guessing works correctly between CORRECT, PRESENT, and ABSENT', () => {
    test(`sets the status of a correct letter to CORRECT`, () => {
        const wordleObj = new Wordle()
        expect(wordleObj.buildGuessFromWord(wordleObj.word)[0].status).toBe("CORRECT")
    })
    test(`sets the status of a present letter to PRESENT`, () => {
        const wordleObj = new Wordle()
        expect(wordleObj.buildGuessFromWord('PEARS')[0].status).toBe("PRESENT")
    })
    test(`Test that it sets the status of an absent letter to ABSENT`, () => {
        const wordleObj = new Wordle()
        expect(wordleObj.buildGuessFromWord('XXXX')[0].status).toBe("ABSENT")
    })
})

describe('make sure the append guess function works correctly', () => {
    test('should throw an error if no more guesses are allowed', () => {
        const wordleObj = new Wordle(1)
        wordleObj.appendGuess('xxxxx')
        expect(() => {
                wordleObj.appendGuess('zzzzz')
        }).toThrow('No more guesses allowed')
    })
    test('should throw an error if no a guess is not a length of 5', () => {
        const wordleObj = new Wordle()
        expect(() => {
                wordleObj.appendGuess('abc')
        }).toThrow('Guess must be of length 5')
        expect(() => {
            wordleObj.appendGuess('abcdefghijk')
        }).toThrow('Guess must be of length 5')
    })
    test('should throw an error if the guess is not a real word', () =>  {
        const wordleObj = new Wordle()
        wordleObj.appendGuess('GUESS')
        expect(wordleObj.currGuess).toBe(1) 
    })
})

describe('make sure the isSoved function works correctly', () => {
    test('should show true if the guess is correct', () => {
        const wordleObj = new Wordle()
        wordleObj.appendGuess('APPLE')
        wordleObj.isSolved()
        expect(wordleObj.isSolved()).toBe(true)
    })
    test('should show false if the guess is incorrect', () => {
        const wordleObj = new Wordle()
        wordleObj.appendGuess('PEARS')
        wordleObj.isSolved()
        expect(wordleObj.isSolved()).toBe(false)
    })
})

describe('make sure the shouldEndGame function works correctly', () => {
    test('should treturn true if the guess is correct', () => {
        const wordleObj = new Wordle()
        wordleObj.appendGuess('APPLE')
        expect(wordleObj.shouldEndGame()).toBe(true)
    })
    test('should return true if the turns run out', () => {
        const wordleObj = new Wordle(1)
        wordleObj.appendGuess('PEARS')
        expect(wordleObj.shouldEndGame()).toBe(true)
    })
    test('should return false if no guess has been made', () => {
        const wordleObj = new Wordle()
        expect(wordleObj.shouldEndGame()).toBe(false)
    })
    test('should return false if there are still turns left', () => {
        const wordleObj = new Wordle()
        wordleObj.appendGuess('PEARS')
        expect(wordleObj.shouldEndGame()).toBe(false)
    })
})