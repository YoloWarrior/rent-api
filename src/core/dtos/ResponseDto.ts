export class ResponseDto<T> {
  data: T;
  error?: {
    message: string;
    status: number;
  };

  constructor(
    data?: T,
    error?: {
      message: string;
      status: number;
    },
  ) {
    this.data = data;
    this.error = error;
  }
}
