export const ensureArray = (data: any) => {
    return Array.isArray(data) ? data : [data]
  }
  