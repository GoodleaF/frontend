///////////  qa version /////////////
// const endPoint = process.env.DEV
//   ? "http://localhost:9001"
/////////////////////////////////////

/////////// live version ////////////
const endPoint = process.env.DEV
  ? "http://localhost:3104"
  : "http://127.0.0.1:3104";
/////////////////////////////////////

export { endPoint };
