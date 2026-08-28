export type TgenericErrorResponse = {
  statusCode: number,
  message: string,
  error: TerrorSourcres
}

export type TerrorSourcres = {
  path: string | number,
  message: string
}[]