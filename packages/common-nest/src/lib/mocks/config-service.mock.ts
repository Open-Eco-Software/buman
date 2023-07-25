export const mockConfigService = {
    internalConfig: {},
    isCacheEnabled: false,
    cache: {},
    _isCacheEnabled: false,
    get: jest.fn(),
    getOrThrow: jest.fn(),
    getFromCache: jest.fn(),
    getFromValidatedEnv: jest.fn(),
    getFromProcessEnv: jest.fn(),
    getFromInternalConfig: jest.fn(),
    setInCacheIfDefined: jest.fn(),
    isGetOptionsObject: jest.fn(),
};
