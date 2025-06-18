import dayjs from "dayjs";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear); // dayjs com o plugin de trimestre

export const dayJs = dayjs()
export const currentYear = dayjs().year();
export const currentQuarter = dayjs().quarter(); // Q1, Q2, Q3, Q4