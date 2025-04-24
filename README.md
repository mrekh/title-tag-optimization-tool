# Google Search Console (GSC) Ngram Weigher (an Apps Script)

This Google Apps Script processes query, click, and impression data exported from Google Search Console to identify and weigh important n-gram phrases.

## Purpose

The script takes a list of search queries along with their associated clicks and impressions. It breaks down these queries into phrases (n-grams) of varying lengths (from 1 word up to a specified maximum). It then calculates a weight for each unique phrase based on its frequency, the total impressions of queries containing it, and its character length. The results are sorted by this calculated weight, helping to identify the most impactful phrases driving visibility and traffic.

## Setup

1.  **Google Sheet:** Create a new Google Sheet or use an existing one.
2.  **Input Sheet:**
    *   Rename a sheet to `Input` (case-sensitive).
    *   Paste your GSC data into this sheet:
        *   **Column A:** Query
        *   **Column B:** Clicks
        *   **Column C:** Impressions
    *   *(Optional but recommended)* Use Row 1 for headers (e.g., "Query", "Clicks", "Impressions"). Data should start from Row 2.
    *   **Cell E2:** Enter the maximum phrase length (n-gram size) you want to analyze (e.g., `3` to analyze 1-word, 2-word, and 3-word phrases).
    *   **Cell E5:** Enter the desired name for the sheet where the results will be written (e.g., `Output`).
3.  **Output Sheet:**
    *   Create another sheet in the same spreadsheet.
    *   Rename it to match the name you entered in cell `E5` of the `Input` sheet (e.g., `Output`).
4.  **Apps Script:**
    *   Open the Script editor from your Google Sheet (`Tools` > `Script editor`).
    *   Copy the contents of `code.gs` and paste them into the editor, replacing any default code.
    *   Save the script project (give it a name like "GSC Query Analyzer").

## How to Use

1.  Ensure your `Input` sheet is populated with data and the configuration cells (E2, E5) are set correctly.
2.  Make sure an empty sheet exists with the name specified in cell `E5`.
3.  Reload the Google Sheet (or open it for the first time after adding the script). A new custom menu named "GSC Analyzer" should appear.
4.  Click `GSC Analyzer` > `Analyze Queries 🚀`.
5.  The script will run. It might ask for authorization the first time. Review the permissions and grant them if you trust the script.
6.  Upon completion, a pop-up message will confirm success, and the results will be populated in your designated output sheet, sorted by `Weight %`.

## Output Columns

The output sheet will contain the following columns:

*   **Phrase:** The unique n-gram phrase identified.
*   **Weight:** The calculated raw weight score (`frequency * impressions * character_length^2`).
*   **Weight %:** The phrase's weight relative to the total weight of all phrases.
*   **Frequency:** How many times the phrase appeared across all generated n-grams.
*   **Frequency %:** The phrase's frequency relative to the total count of all generated phrases.
*   **Impressions:** The sum of impressions for all original queries that contain this phrase.
*   **Impressions %:** The phrase's impressions relative to the total impressions of all input queries.
*   **Clicks:** The sum of clicks for all original queries that contain this phrase.
*   **Clicks %:** The phrase's clicks relative to the total clicks of all input queries.
*   **Words in Phrase:** The number of words in the phrase (the 'n' in n-gram).

## Notes

*   Execution time depends on the volume of input data and the maximum phrase length. Large datasets might approach Google Apps Script execution time limits.
*   The script clears the output sheet before writing new results.
