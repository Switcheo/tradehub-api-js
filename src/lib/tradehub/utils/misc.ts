export const sortObject = (input: any): unknown => {
  if (typeof input !== "object") return input
  if (Array.isArray(input)) return input.map(sortObject)

  const output = {}
  Object.keys(input)
    .sort()
    .forEach((key) => output[key] = sortObject(input[key]))

  return output
}
