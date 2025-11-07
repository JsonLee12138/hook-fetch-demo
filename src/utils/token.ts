export class Token {
  static setAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  static get accessToken() {
    return localStorage.getItem('accessToken');
  }

  static removeAccessToken() {
    localStorage.removeItem('accessToken');
  }

  static setRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  static get refreshToken() {
    return localStorage.getItem('refreshToken');
  }

  static removeRefreshToken() {
    localStorage.removeItem('refreshToken');
  }
}
