export const checkboxData = (event) => {
  let result = "";
  if (event.target.checked) {
    result = event.target.value;
    console.log(result);
  } else {
  }
  return result;
};
