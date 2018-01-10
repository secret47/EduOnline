function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//分割数组
function sliceArray(array, subGroupLength) {
    var index = 0;
    var newArray = [];

    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }

    return newArray;
}

//去除前后的{}
function removeBlock(str) {
    if (str) {
        var reg = /^\{/gi;
        var reg2 = /\}$/gi;
        str = str.replace(reg, '');
        str = str.replace(reg2, '');
        return str;
    } else {
        return str;
    }
}

function isInArray(arr, value) {
    if (arr.indexOf && typeof (arr.indexOf) == 'function') {
        var index = arr.indexOf(value);
        if (index >= 0) {
            return true;
        }
    }
    return false;
}
module.exports = {
  sliceArray: formatTime,
  sliceArray: sliceArray,
  removeBlock: removeBlock,
  isInArray: isInArray
}
