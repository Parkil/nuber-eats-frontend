export const getCode = (): string =>  {
  return window.location.href.split('code=')[1];
}

export const getSearchTerm = (): string | undefined =>  {
  let str = window.location.href.split('term=')[1];
  return typeof(str) !== 'undefined' ? decodeURIComponent(str) : undefined;
}
