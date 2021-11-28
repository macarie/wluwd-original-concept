export type Hook = {
  suite?: () => Promise<void>
  test?: () => Promise<void>
}
