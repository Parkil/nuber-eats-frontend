export const getVerificationCode = (): string =>  {
  return window.location.href.split('code=')[1];
}