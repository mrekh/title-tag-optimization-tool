"use strict" // For debuging purpose

let ss = SpreadsheetApp.getActiveSpreadsheet();
const inputSheet = ss.getSheetByName("Input");

// Output seeht
let outputSheetName = inputSheet.getRange("E5").getValue();
let outputSheet = ss.getSheetByName(outputSheetName);

// Phrase len
let pharseLen = inputSheet.getRange("E2").getValue();

// Custom menu
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Analyzing GSC data")
    .addItem("Make magic 🥳", "QUERYANALYZER")
    .addToUi();
}

// Convert input sheet data to objects
function converter(inputDataSheet) {
  let data = [];

  for (let i = 2;; i++) {
    if (inputDataSheet.getRange(`A${i}`).getValue() == 0) break;

    data[i - 2] = {
      query: inputDataSheet.getRange(`A${i}`).getValue(),
      click: inputDataSheet.getRange(`B${i}`).getValue(),
      impr: inputDataSheet.getRange(`C${i}`).getValue()
    };
  }
  return data;
}

let inputData = converter(inputSheet);

function queryToNWords(queries, n) {
  let phrases = [];
  let queriesArr = queries.map(e => e.query);

  for (let i = 0; i < queriesArr.length; i++) {
    let words = [];
    words.push(queriesArr[i].split(" "));
    words = words.flat();

    if (n === 1) {
      phrases.push(words); 
    } else if (words.length === n) {
      phrases.push(words.join(" "));
    } else if (words.length > n) {
      for (let t = 0; t < words.length - n; t++) {
        let phrase = "";
        for (let z = 0; z < n; z++) {
          phrase += words[t + z] + " ";
        }
        phrases.push(phrase.trim());
      }
    }
  }
  return phrases.flat();
}

// A for loop getting different queries length base on input "phrase length" value
function phrase(queries, len) {
  let phrases = [];
  for (let i = 1; i <= len; i++) {
    phrases.push(queryToNWords(queries, i));
  }
  return phrases.flat();
}

let words = phrase(inputData, pharseLen);

// Finding word occurrence in queries, and getting impr and click data of it
function wordsRepetition(words) {
  let uniqueWords = [...new Set(words)];
  let wordRepetition = [];
  // Finding how many times each word repeat in quaries
  function frequency(word) {
    let counter = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i] === word) counter++;
    }
    return counter;
  }
  // Calculate impr/click of the word
  function imprOrClick(type, word) {
    let value = 0;
    for (let i = 0; i < inputData.length; i++) {
      if (inputData[i].query.includes(word) === true) value += inputData[i][type];
    }
    return value;
  }

  // Calculate total impr/click of the URL
  function totalImprOrClick(type) {
    let value = 0;
    for (let i = 0; i < inputData.length; i++) {
      value += inputData[i][type];
    }
    return value;
  }
  
  let totalImpr = totalImprOrClick("impr");
  let totalClick = totalImprOrClick("click");
  let inputDataLen = inputData.length;


  for (let i = 0; i < uniqueWords.length; i++) {
    wordRepetition[i] = {
      word: uniqueWords[i],
      weight: (frequency(uniqueWords[i]) * imprOrClick("impr", uniqueWords[i]) * Math.pow(uniqueWords[i].length, 2)),
      freq: frequency(uniqueWords[i]),
      freqPercent: frequency(uniqueWords[i]) / inputDataLen,
      impr: imprOrClick("impr", uniqueWords[i]),
      imprPercent: imprOrClick("impr", uniqueWords[i]) / totalImpr,
      click: imprOrClick("click", uniqueWords[i]),
      clickPercent: imprOrClick("click", uniqueWords[i]) / totalClick,
      wordsInPhrase: uniqueWords[i].split(" ").length
    }
  }

  function weightSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]["weight"];
    }
    return sum;
  }

  let totalWeight = weightSum(wordRepetition);

  for (let i = 0; i < wordRepetition.length; i++) {
    wordRepetition[i]["weightPercent"] = wordRepetition[i]["weight"] / totalWeight;
  }

  return wordRepetition;
}

// Sorting queries based on their weight
let uniqueWords = wordsRepetition(words).sort((a, b) => {
  return b.weightPercent - a.weightPercent;
});;

// Creating an array for write in a xlsx file (Sheet)
function arrayMaker(arr) {
  let array = [];

  for (let i = 0; i < arr.length; i++) {
    let e = arr[i];
    array[i] = [e.word, e.weight, e.weightPercent, e.freq, e.freqPercent, e.impr, e.imprPercent, e.click, e.clickPercent, e.wordsInPhrase];
  }
  return array;
}

// Output data
let ws_data = arrayMaker(uniqueWords);

// Magic maker function
function QUERYANALYZER() {
  outputSheet.getRange(2, 1, uniqueWords.length, 10).setValues(ws_data);
}
