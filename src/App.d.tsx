interface ISelectedSATData {
    dbn: string;
    sat_math_avg_score: number;
    sat_critical_reading_avg_score: number;
    sat_writing_avg_score: number;
}
interface ILabels {
    [name: string]: string
}
interface IChartData {
    labels: any;
    datasets: any;
}
interface IHighSchoolInformation {
    dbn: string;
    school_name: string;
    phone_number: string;
    location: string;
    school_email: string;
    website: string;
    value: string;
    label: string;
}
type IHighSchoolData = Array<IHighSchoolInformation>;
type IHighSchoolSATData = Array<ISelectedSATData>;
type IBusinessCard = {
    labels: ILabels;
    data: any;
};
type ISATChart = {
    data: IChartData;
}
type IMainContainer = {
    labels: ILabels;
}
type INYCHeader = {
    labels: ILabels;
}
declare module "*.jpg";