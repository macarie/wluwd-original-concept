export type Test = {
  name: string
  skip?: boolean
  only?: boolean
  fn: () => AsyncGenerator<boolean, void>
}
