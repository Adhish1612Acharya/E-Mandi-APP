class expressError extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.msg = msg;
  }
}

export default expressError;
