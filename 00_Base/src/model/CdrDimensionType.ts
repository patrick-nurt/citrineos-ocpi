export enum CdrDimensionType {
  CURRENT = 'CURRENT',
  ENERGY = 'ENERGY',
  ENERGY_EXPORT = 'ENERGY_EXPORT',
  ENERGY_IMPORT = 'ENERGY_IMPORT',
  MAX_CURRENT = 'MAX_CURRENT',
  MIN_CURRENT = 'MIN_CURRENT',
  MAX_POWER = 'MAX_POWER',
  MIN_POWER = 'MIN_POWER',
  PARKING_TIME = 'PARKING_TIME',
  POWER = 'POWER',
  RESERVATION_TIME = 'RESERVATION_TIME',
  STATE_OF_CHARGE = 'STATE_OF_CHARGE',
  TIME = 'TIME',
}

// TODO handle mappings for unmapped CdrDimensionType (where possible):
// -- ENERGY_EXPORT
// -- MAX_CURRENT
// -- MIN_CURRENT
// -- MAX_POWER
// -- MIN_POWER
// -- PARKING_TIME
// -- RESERVATION_TIME