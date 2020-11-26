import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Download({results, points, button}) {
  const splitedPoints = points.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);

  const pointsDataSet = {
    columns: ['X', 'Y'],
    data: splitedPoints
  }

  return (
    <ExcelFile element={button}>
      <ExcelSheet data={[results]} name="Results">
        <ExcelColumn label="Overal Stability Index" value="osi"/>
        <ExcelColumn label="Overal Stability Desviation" value="osd"/>
        <ExcelColumn label="Antero/Posterior Stability Index" value="api"/>
        <ExcelColumn label="Antero/Posterior Stability Desviation" value="apd"/>
        <ExcelColumn label="Medial/Lateral Stability Index" value="mli"/>
        <ExcelColumn label="Medial/Lateral Stability Desviation" value="mld"/>
        <ExcelColumn label="Zone Percentage A" value="zpA"/>
        <ExcelColumn label="Zone Percentage B" value="zpB"/>
        <ExcelColumn label="Zone Percentage C" value="zpC"/>
        <ExcelColumn label="Zone Percentage D" value="zpD"/>
        <ExcelColumn label="Quadrant Percentage I" value="qpI"/>
        <ExcelColumn label="Quadrant Percentage II" value="qpII"/>
        <ExcelColumn label="Quadrant Percentage III" value="qpIII"/>
        <ExcelColumn label="Quadrant Percentage IV" value="qpIV"/>

      </ExcelSheet>
      <ExcelSheet dataSet={[pointsDataSet]} name="Points" />
    </ExcelFile>
  );
}

export default Download
