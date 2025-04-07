export function isStateCode(codeIbge: string): boolean {
  return codeIbge.length === 2;
}

export function isMunicipalityCode(codeIbge: string): boolean {
  return codeIbge.length === 7;
}
