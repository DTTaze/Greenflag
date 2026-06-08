const { cacheThrough } = require("../../src/helpers/cacheHelper");
const { getCache, setCache } = require("../../src/utils/cache");

// Mock cache utility functions
jest.mock("../../src/utils/cache", () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
}));

describe("CacheHelper Unit Tests", () => {
  const mockKey = "test:key";
  const mockTTL = 3600;
  let fetchFn;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchFn = jest.fn();
  });

  it("should return cached data and not call fetchFn if cache hit", async () => {
    const cachedData = { message: "cached!" };
    getCache.mockResolvedValue(cachedData);

    const result = await cacheThrough(mockKey, fetchFn, mockTTL);

    expect(getCache).toHaveBeenCalledWith(mockKey);
    expect(fetchFn).not.toHaveBeenCalled();
    expect(setCache).not.toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it("should call fetchFn and setCache if cache miss", async () => {
    const freshData = { message: "fresh!" };
    getCache.mockResolvedValue(null);
    fetchFn.mockResolvedValue(freshData);

    const result = await cacheThrough(mockKey, fetchFn, mockTTL);

    expect(getCache).toHaveBeenCalledWith(mockKey);
    expect(fetchFn).toHaveBeenCalled();
    expect(setCache).toHaveBeenCalledWith(mockKey, freshData, mockTTL);
    expect(result).toEqual(freshData);
  });

  it("should not call setCache if fetchFn returns null/undefined on cache miss", async () => {
    getCache.mockResolvedValue(null);
    fetchFn.mockResolvedValue(null);

    const result = await cacheThrough(mockKey, fetchFn, mockTTL);

    expect(getCache).toHaveBeenCalledWith(mockKey);
    expect(fetchFn).toHaveBeenCalled();
    expect(setCache).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
