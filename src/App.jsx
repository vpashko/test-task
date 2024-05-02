import { fetchData } from './utils/fetchData';
import { getSelection } from './utils/getSelection';
import { useEffect, useState } from 'react';

import './App.css'
import BarChart from './components/charts/chart';
import Dropdown from './components/ui/dropdown';

const path2022 = '/payments_on_contracts_pharmacy_2022.csv';
const path2023 = '/payments_on_contracts_pharmacy_2023.csv';

//#region Dropdown options
const months = [
  { value: 1, label: 'Січень' },
  { value: 2, label: 'Лютий' },
  { value: 3, label: 'Березень' },
  { value: 4, label: 'Квітень' },
  { value: 5, label: 'Травень' },
  { value: 6, label: 'Червень' },
  { value: 7, label: 'Липень' },
  { value: 8, label: 'Серпень' },
  { value: 9, label: 'Вересень' },
  { value: 10, label: 'Жовтень' },
  { value: 11, label: 'Листопад' },
  { value: 12, label: 'Грудень' },
];

const years = [
  { value: 2022, label: '2022' },
  { value: 2023, label: '2023' },
];
//#endregion

function App() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState([1, 2022]);
  const [endDate, setEndDate] = useState([12, 2023]);

  useEffect(() => {
    fetchData({ path: path2022 })
      .then((data2022) => {
        fetchData({ path: path2023 }).then((data2023) => {
          setData(getSelection({ data: [...data2022, ...data2023], start: startDate, end: endDate })); 
        });
    });
  }, [startDate, endDate]);

  console.log(data);

  return (
    <div className="App">
      <div className="slection">
        <h1>Bar Chart</h1>

        <p>Оберіть початкову дату</p>
        <Dropdown 
        options={months} 
        onChange={(m) => {setStartDate([m, startDate[1]])}}
        selectedValue={startDate[0]}
        />
        <Dropdown 
          options={years} 
          onChange={(y) => {setStartDate([startDate[0], y])}}
          selectedValue={startDate[1]} 
        />

        <p>Оберіть кінцеву дату</p>
        <Dropdown 
          options={months} 
          onChange={(m) => {setEndDate([m, endDate[1]])}}
          selectedValue={endDate[0]}
        />
        <Dropdown 
          options={years} 
          onChange={(y) => {setEndDate([endDate[0], y])}}
          selectedValue={endDate[1]}
        />
      </div>

      {data && <BarChart initialData={data} />}

    </div>
  )
}

export default App