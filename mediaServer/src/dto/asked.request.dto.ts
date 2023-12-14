export class AskedRequestDto {
  type: string;
  content: string;
  questionId: string;

  constructor(type: string, content: string, questionId: string) {
    this.type = type;
    this.content = content;
    this.questionId = questionId;
  }
}
