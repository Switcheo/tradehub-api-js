export const sortObject = (input: any): unknown => {
  if (typeof input !== "object") return input
  if (Array.isArray(input)) return input.map(sortObject)

  const output = {}
  Object.keys(input)
    .sort()
    .forEach((key) => output[key] = sortObject(input[key]))

  return output
}

export const stripHexPrefix = (input: string) => {
  return input?.slice(0, 2) === "0x" ? input.slice(2) : input;
};

export const appendHexPrefix = (input: string) => {
  return input?.slice(0, 2) === "0x" ? input : `0x${input}`;
};
