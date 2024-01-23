import { useState, useEffect } from 'react'
import Select from 'react-select'
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function App() {
  const [highSchoolData, setHighSchoolData] = useState([]);
    const [highSchoolSATData, setHighSchoolSATData] = useState([]);
    const [filteredData, setFilteredData] = useState(false);
    const [selectedData, setSelectedData] = useState(false);
    const [chartData, setChartData] = useState({});
    const staticLabels = {
        math: 'Phone',
        reading: 'Reading',
        writing: 'Writing',
        score: 'SAT Avg Scores',
        noDataDesc: 'No SAT data provided',
        website: 'Website',
        select: 'Select'
    };
    const onChangeHandler = target => {
        const selectedSATData = highSchoolSATData.filter((ele) => ele.dbn === target.value)[0];
        setSelectedData(highSchoolData.filter((ele) => ele.dbn === target.value)[0]);
        if (selectedSATData) {
            setFilteredData(selectedSATData);
            setChartData({
                labels: [
                    staticLabels.math + ': ' + selectedSATData.sat_math_avg_score,
                    staticLabels.reading + ': ' + selectedSATData.sat_critical_reading_avg_score,
                    staticLabels.writing + ': ' + selectedSATData.sat_writing_avg_score
                ],
                datasets: [
                    {
                        label: staticLabels.score,
                        data: [selectedSATData.sat_math_avg_score, selectedSATData.sat_critical_reading_avg_score, selectedSATData.sat_writing_avg_score],
                        backgroundColor: 'rgba(200, 99, 132, 0.2)',
                        borderColor: 'rgba(200, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
        else setFilteredData(false);
    };
    useEffect(() => {
        fetch("https://data.cityofnewyork.us/resource/s3k6-pzi2.json")
            .then(response => response.json())
            .then(data => {
                data.map(ele => {
                    ele.label = ele.school_name;
                    ele.value = ele.dbn;
                    return ele;
                });
                setHighSchoolData(data);
            });
        fetch("https://data.cityofnewyork.us/resource/f9bf-2cp4.json")
            .then(response => response.json())
            .then(data => {
                setHighSchoolSATData(data);
            });
    }, []);
    function BusinessCard({ labels, data }) {
        const location = data.location.split('(')[0].trim();
        return (
            <div className="business-card">
                <div>
                    <div style={{ fontSize: '20px' }}>{data.school_name}</div>
                </div>
                <div>
                    <div>{data.phone_number}</div>
                    <div>{location}</div>
                    <div>{data.school_email}</div>
                    <div style={{ textAlign: 'right' }}>
                        <a href={'http://' + data.website} target="blank">{labels.website}</a>
                    </div>
                </div>
            </div>
        )
    }
    function SATChart({ data }) {
        return (
            <div style={{ width: '800px', margin: '0 auto' }}>
                <Bar data={data} />
            </div>
        )
    }
    function MainContainer({ labels }) {
        return (
            <div style={{ width: '1024px' }} className="main-container" data-testid="main-container">
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder={labels.select}
                    isSearchable={true}
                    isClearable={true}
                    name="school-select"
                    options={highSchoolData}
                    onChange={onChangeHandler}
                />
                {selectedData && <BusinessCard
                    className="business-card"
                    data={selectedData}
                    labels={labels}
                />}
                {filteredData && <SATChart
                    data={chartData}
                />
                }
                {selectedData && !filteredData && <div style={{ textAlign: 'center', fontSize: '30px' }}>{labels.noDataDesc}</div>}
            </div>
        );
    }
    return <MainContainer labels={staticLabels} />;
}

export default App;