class ResourceUnavalableError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
export default ResourceUnavalableError;
