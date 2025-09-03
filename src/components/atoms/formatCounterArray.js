export const formatCounterArray = (arr) => {
    let result = [];
  
    if (arr.length > 0) {
      let start = arr[0];
      let end = arr[0];
      arr.forEach((counterNumber, index) => {
        end = (parseInt(counterNumber) + 1).toString();
        if (end !== arr[index + 1]) {
          if (start === counterNumber) {
            result.push(counterNumber);
          } else {
            result.push(`${start}-${counterNumber}`);
          }
          start = arr[index + 1];
        }
      });
    }
  
    return result.join(", ");
  };
  