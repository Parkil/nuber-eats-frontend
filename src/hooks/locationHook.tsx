export const getVerificationCode = (): string =>  {
  const [_, code] = window.location.href.split('code=');
  return code;
}