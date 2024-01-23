import { useState, useEffect } from 'react'
import Select from 'react-select'
import React from 'react';
import BackgroundImage from './assets/card-bg.jpg';
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
    const staticLabels: ILabels = {
        math: 'Math',
        reading: 'Reading',
        writing: 'Writing',
        score: 'SAT Avg Scores',
        noDataDesc: 'No SAT data provided',
        website: 'Website',
        select: 'Select',
        map: 'Get Directions',
        header: 'NYC High School Search'
    };
    const highSchoolInformationAPI: string = 'https://data.cityofnewyork.us/resource/s3k6-pzi2.json';
    const highSchoolSATScoreAPI: string = 'https://data.cityofnewyork.us/resource/f9bf-2cp4.json';
    const [highSchoolData, setHighSchoolData] = useState <IHighSchoolData | any>([]);
    const [highSchoolSATData, setHighSchoolSATData] = useState<IHighSchoolSATData>([]);
    const [filteredData, setFilteredData] = useState < ISelectedSATData | boolean >(false);
    const [selectedData, setSelectedData] = useState < IHighSchoolData | any> ();
    const [chartData, setChartData] = useState<IChartData | any>({});

    const onChangeHandler = (target: IHighSchoolInformation) => {
        // Locate the selected school's SAT data
        const selectedSATData: ISelectedSATData = highSchoolSATData.filter((ele: { dbn: string }) => ele.dbn === target.value)[0];
        // Locate the selected school's basic information
        setSelectedData(highSchoolData.filter((ele: { dbn: string }) => ele.dbn === target.value)[0]);
        if (selectedSATData) { // If there is SAT data provided
            setFilteredData(selectedSATData);
            // build chart dataset
            setChartData({
                labels: [
                    staticLabels.math + ': ' + selectedSATData.sat_math_avg_score,
                    staticLabels.reading + ': ' + selectedSATData.sat_critical_reading_avg_score,
                    staticLabels.writing + ': ' + selectedSATData.sat_writing_avg_score
                ],
                datasets: [
                    {
                        label: staticLabels.score,
                        data: [
                            selectedSATData.sat_math_avg_score,
                            selectedSATData.sat_critical_reading_avg_score,
                            selectedSATData.sat_writing_avg_score
                        ],
                        backgroundColor: '#99EDC3',
                        borderColor: '#99EDC3',
                        borderWidth: 1
                    }
                ]
            });
        }
        else setFilteredData(false);
    };
    useEffect(() => {
        // Get high school informations
        fetch(highSchoolInformationAPI)
            .then(response => response.json())
            .then(data => {
                // add label and value props for Select
                data.map((ele: { label: string; school_name: string; value: string; dbn: string; }) => {
                    ele.label = ele.school_name;
                    ele.value = ele.dbn;
                    return ele;
                });
                setHighSchoolData(data);
            });
        // Get high school avg SAT scores
        fetch(highSchoolSATScoreAPI)
            .then(response => response.json())
            .then(data => {
                setHighSchoolSATData(data);
            });
    }, []);
    const BusinessCard: React.FC<IBusinessCard> = ({ labels, data }) => {
        // Trim location strings
        const location: string = data?.location?.split('(')[0].trim();
        const [isMapHover, setIsMapHover] = useState<boolean>(false);
        const [isWebsiteHover, setIsWebsiteHover] = useState<boolean>(false);
        const cardStyle: React.CSSProperties = {
            position: 'relative',
            margin: '0 auto',
            padding: '36px',
            width: '400px',
            height: '200px',
            marginTop: '30px',
            marginBottom: '30px',
            borderRadius: '20px',
            boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: '100% 100%',
            color: 'white',
            textShadow: '1px 1px black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'all 1s linear'
        }
        return (
            <div style={cardStyle} className="business-card">
                <div>
                    <div style={{ fontSize: '20px' }}>{data.school_name}</div>
                </div>
                <div>
                    {data?.phone_number && <div>{data.phone_number}</div>}
                    {location && <div>{location}</div>}
                    {data?.school_email && <div>{data.school_email}</div>}
                    <div style={{ textAlign: 'right', marginTop: '16px'}}>
                        {location &&
                            <a
                                style={{ marginRight: '16px', color: isMapHover ? 'cyan' : 'white' }}
                                href={`https://maps.google.com?q=${location}`}
                                onMouseEnter={() => setIsMapHover(true)}
                                onMouseLeave={() => setIsMapHover(false)}
                                target="blank">{labels.map}</a>}
                        {data?.website &&
                            <a
                                style={{ color: isWebsiteHover ? 'cyan' : 'white' }}
                                href={`http://${data.website}`}
                                onMouseEnter={() => setIsWebsiteHover(true)}
                                onMouseLeave={() => setIsWebsiteHover(false)}
                                target="blank">{labels.website}
                            </a>}
                    </div>
                </div>
            </div>
        )
    }
    const SATChart: React.FC<ISATChart> = ({ data }) => {
        return (
            <div style={{ width: '800px', margin: '0 auto' }}>
                <Bar data={data} />
            </div>
        )
    }
    const NYCHeader: React.FC<INYCHeader> = ({ labels }) => {
        return (
            <h1 style={{ textAlign: 'center' }}>{labels.header}</h1>
        )
    }
    const MainContainer: React.FC<IMainContainer> = ({ labels }) => {
        return (
            <div style={{ width: '800px', margin: '0 auto' }} className="main-container">
                <NYCHeader labels={labels} />
                <Select
                    value={selectedData}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder={labels.select}
                    isSearchable={true}
                    name="school-select"
                    options={highSchoolData}
                    onChange={onChangeHandler}
                />
                {selectedData &&
                    <BusinessCard
                        data={selectedData}
                        labels={labels}
                    />}
                {filteredData &&
                    <SATChart
                        data={chartData}
                    />}
                {selectedData && !filteredData &&
                    <div style={{ textAlign: 'center', fontSize: '30px' }}>
                        {labels.noDataDesc}
                    </div>}
            </div>
        );
    }
    return <MainContainer labels={staticLabels} />;
}

export default App;