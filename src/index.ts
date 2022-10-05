/* eslint-env detox/detox, jest */
import path from 'path'
import { device, expect } from 'detox'
import { describe as describeFn } from '@jest/globals'

let RUN_ONLY: string[] = []
let translations: Record<string, Record<string, string>> = {}

/**
 * Initializes the library.
 * @param runOnly - `string[]`– Optional. Names of the test files to filter in and run, ie: `['home', 'settings']`.
 * @param translations - `{ [context: string]: Record<string, string> }`– Object containing a language string and and its translations.
 * Defaults to `[]` which means running all test files.
 */
function init<
  TranslationsType extends Record<string, Record<string, string>> = Record<string, Record<string, string>>,
>({ runOnly = [], translations: translationsObj }: { runOnly?: string[]; translations?: TranslationsType }) {
  if (runOnly) RUN_ONLY = runOnly
  if (translationsObj) translations = translationsObj
}

/**
 * If this is a React Native app, reload the React Native JS bundle.
 * This action is much faster than device.launchApp(), and can be used if you just need to reset your React Native logic.
 */
function reloadApp() {
  return device.reloadReactNative()
}

/**
 * Taps on a given element.
 * @param { string } elementId - The ID of the element you want to tap.
 */
function tapElement(elementId: string) {
  return element(by.id(elementId)).tap()
}

/**
 * Taps on a given text.
 * @param { string } elementId - The ID of the text you want to tap.
 */
function tapText(elementId: string) {
  return element(by.text(elementId)).tap()
}

/**
 * Makes sure a given element has at least 75% visibility.
 * @param { string } elementId - The ID of the element you want to assert.
 */
function assertElementIsVisible(elementId: string) {
  return expect(element(by.id(elementId))).toBeVisible()
}

/**
 * Makes sure a given testID exist in the current view hierarchy.
 * @param { string } elementId - The ID of the element you want to assert.
 */
function assertElementExists(elementId: string) {
  return expect(element(by.id(elementId))).toExist()
}

/**
 * Makes sure a given testID does NOT exist in the current view hierarchy.
 * @param { string } elementId - The ID of the element you want to assert.
 */
function assertElementIsNotVisible(elementId: string) {
  return expect(element(by.id(elementId))).not.toBeVisible()
}

/**
 * Makes sure a given toggle as the expected value.
 * The element can be a switch or a checkbox.
 * @param { string } elementId - The ID of the toggle you want to assert.
 * @param { boolean } value - The value you expect to see.
 */
function assertToggleValue(elementId: string, value: boolean) {
  return expect(element(by.id(elementId))).toHaveToggleValue(value)
}

/**
 * Makes sure a given text has at least 75% visibility.
 * @param { string } text - The ID of the element you want to assert.
 */
function textIsVisible(text: string) {
  return expect(element(by.label(text))).toBeVisible()
}

/**
 * Makes sure a given element a specific text.
 * @param { string } elementId - The ID of the element you want to assert.
 */
function elementHasText(elementId: string, text: string) {
  return expect(element(by.id(elementId))).toHaveText(text)
}

/**
 * Clears a given text input.
 * @param { string } elementId - The ID of the text input you want to clear.
 */
function clearText(elementId: string) {
  return element(by.id(elementId)).clearText()
}

/**
 * Enters a given text (using the phone keyboard if open).
 * @param { string } elementId - The ID of the text input you want to type in.
 * @param { string } text - The text to type.
 */
function typeText(elementId: string, text: string) {
  return element(by.id(elementId)).typeText(text)
}

/**
 * Replaces the content of a given text input with a specific text.
 * This is much faster than typeText(), almost like you'd be copy/pasting the text.
 * @param { string } elementId - The ID of the text input you want to type in.
 * @param { string } text - The text to type.
 */
function replaceText(elementId: string, text: string) {
  return element(by.id(elementId)).replaceText(text)
}

/**
 * Submits a given text input.
 * @param { string } elementId - The ID of the text input you want to type in.
 */
function tapReturnKey(elementId: string) {
  return element(by.id(elementId)).tapReturnKey()
}

/**
 * Swipes a given element in a specific direction.
 * @param { string } elementId - The ID of the text input you want to type in.
 * @param { 'left' | 'right' | 'up' | 'down' } direction - The direction to swipe.
 * @param { number } offset - Optional. The distance to swipe.
 */
function swipe(elementId: string, direction: 'left' | 'right' | 'up' | 'down', offset = 0) {
  if (offset) return element(by.id(elementId)).scroll(offset, direction)
  return element(by.id(elementId)).swipe(direction)
}

function waitForElement(elementId: string, timeOut = 5000) {
  return waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeOut)
}

/**
 * Used to scroll to a specific edge of a container (e.g. scroll to the bottom of a scrollview).
 *
 * @param { string } elementId - TestID for the element you want to scroll inside of
 * @param { 'left' | 'right' | 'top' | 'bottom' } edge - To what edge do you want to scroll
 */
function scrollTo(elementId: string, edge: 'left' | 'right' | 'top' | 'bottom') {
  return element(by.id(elementId)).scrollTo(edge)
}

/**
 * Used to enter text in a text input field.
 *
 * @param { string } elementId - The ID of the element you want to enter text in.
 * @param { string } inputText - The text you want to type.
 * @param { { doNotTapReturnKey: boolean } } options - Options to use.
 */
function addValueToInputField(elementId: string, inputText: string, options?: { doNotTapReturnKey: boolean }) {
  return async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(element(by.id(elementId))).toBeVisible()
    await element(by.id(elementId)).tap()
    await element(by.id(elementId)).clearText()
    await element(by.id(elementId)).typeText(inputText)
    if (!options?.doNotTapReturnKey) await element(by.id(elementId)).tapReturnKey()
  }
}

/**
 * Custom Jest describe() function that enables skipping some tests based on their filename.
 * @param { string } filename - The name of the file this function is being used in.
 * @example
 * ```
 * DetoxHelpers.describe(__filename)('📝 Test Suite Title', () => {
 *  // Your regular tests here
 * })
 * ```
 */
function describe(filename: string): typeof describeFn | typeof describeFn.skip {
  return !RUN_ONLY || RUN_ONLY.length === 0 || RUN_ONLY.includes(path.basename(filename, '.e2e.ts'))
    ? describeFn
    : describeFn.skip
}

/**
 * `sleepFor` allows you to pause your code execution for a given amount of time.
 * @param milliseconds - Amount of time in ms to wait before resuming with JavaScript call stack.
 */
function sleepFor(milliseconds: number) {
  return new Promise<void>(resolve => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve()
    }, milliseconds)
  })
}

/**
 * Returns the localized string based on the provided param.
 * @param { string } key - The key of the string you want to get.
 * @param { string } locale - The locale you want to get the string for.
 * @returns { string } The localized string.
 */
const getLocalizedString = <
  Translations extends Record<string, Record<string, string>>,
  Context extends keyof Translations = keyof Translations,
  Output extends Exclude<keyof Translations[Context], number | symbol> = Exclude<
    keyof Translations[Context],
    number | symbol
  >,
>(
  fn: (strings: Translations) => string,
  values: Record<string, string> = {},
): Output => {
  const parseStringForValues = (string: string) => {
    const regex = /\{\{([^}]+)\}\}/g
    const matches = string.match(regex)

    if (matches) {
      matches.forEach(match => {
        const key = match.replace(/\{\{|\}\}/g, '')
        const valueToReplace = values[key]

        if (valueToReplace) {
          string = string.replace(match, valueToReplace)
        }
      })
    }

    return string
  }

  const item = fn(translations as unknown as Translations)
  let variable = null
  let string = ''

  if (typeof item === 'object' && item[0]) {
    string = item[0]
    variable = item[1]
  } else if (typeof item === 'string') {
    string = item
  }

  return parseStringForValues(string)
    .replace(/({{|@@)(.+?)(@@|}})/g, variable ?? '__NO VARIABLE ARGUMENT PROVIDED__')
    .replace(/\*/g, '') as unknown as Output
}

export default {
  init,
  swipe,
  typeText,
  sleepFor,
  tapText,
  scrollTo,
  describe,
  clearText,
  reloadApp,
  tapElement,
  replaceText,
  tapReturnKey,
  textIsVisible,
  elementHasText,
  waitForElement,
  assertToggleValue,
  getLocalizedString,
  assertElementExists,
  addValueToInputField,
  assertElementIsVisible,
  assertElementIsNotVisible,
}
