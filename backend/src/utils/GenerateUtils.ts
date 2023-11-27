export class GenerateUtils {
  MAX_NUMBER = 999999;

  generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * this.MAX_NUMBER + 1);
    return String(randomNumber).padStart(6, '0');
  }
}
