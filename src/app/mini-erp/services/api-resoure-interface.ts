export interface ApiResource<T> {

  /**
   * Get resouce
   */
  get(params: Object, success: (resources: T[]) => void, error: (e) => void);

  post(resource: T, success: (newResource: T) => void, error: (e) => void);

  put(resource: T, success: (newResource: T) => void, error: (e) => void);

  delete(id: string, success: (resp) => void, error: (e) => void);

}
