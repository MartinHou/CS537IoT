import React, { useMemo, useState } from 'react';
import { Table, Button } from 'antd';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';
import './App.css';
import TextArea from "antd/es/input/TextArea";

const std_nutrition = [
	{ label: 'carbohydrates', value: 55.6, unit: 'g' },
	{ label: 'cholesterol', value: 0.07, unit: 'mg' },
	{ label: 'fat', value: 9.87, unit: 'g' },
	{ label: 'fiber', value: 6.22, unit: 'g' },
	{ label: 'protein', value: 16.67, unit: 'g' },
	{ label: 'sodium', value: 0.51, unit: 'mg' },
	{ label: 'sugar', value: 11.11, unit: 'g' },
];

const aggregateNutrition = (data: any[]) => {
	const aggregation = {};
	data.slice(0, 10).forEach(item => {
		Object.keys(item.total_nutrition).forEach(key => {
			if (std_nutrition.some(nutrition => nutrition.label === key)) {
				if (!aggregation[key]) {
					aggregation[key] = 0;
				}
				aggregation[key] += item.total_nutrition[key];
			}
		});
	});
	return std_nutrition.map(nutrition => ({
		label: nutrition.label,
		value: aggregation[nutrition.label] || 0,
		unit: nutrition.unit,
	}));
};

function App() {
	const [nutritionData, setNutritionData] = useState<any>([]);
	const [advice, setAdvice] = useState("");
	const chartData = useMemo(() => {
		return nutritionData.map(item => ({
			date: dayjs(item.date).valueOf(),
			calories: item.total_nutrition.calories,
		}));
	}, [nutritionData]);

	const aggregatedNutrition = useMemo(() => aggregateNutrition(nutritionData), [nutritionData]);

	const handleRefresh = function () {
		fetch('http://192.168.3.5:5001/load', {
			method: 'GET',
		})
			.then(function (response) {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(function (data) {
				setNutritionData(data);
			})
			.catch(function (error) {
				console.error('Error fetching data:', error);
			});
	};

	const columns = [
		{ title: 'Date', dataIndex: 'date', key: 'date' },
		{ title: 'Calories', dataIndex: 'total_nutrition', key: 'calories', render: totalNutrition => totalNutrition ? `${totalNutrition.calories} kcal` : null },
		{ title: 'Sugar', dataIndex: 'total_nutrition', key: 'sugar', render: totalNutrition => totalNutrition ? `${totalNutrition.sugar} g` : null },
		{ title: 'Protein', dataIndex: 'total_nutrition', key: 'protein', render: totalNutrition => totalNutrition ? `${totalNutrition.protein} g` : null },
		{ title: 'Fat', dataIndex: 'total_nutrition', key: 'fat', render: totalNutrition => totalNutrition ? `${totalNutrition.fat} g` : null },
		{ title: 'Carbohydrates', dataIndex: 'total_nutrition', key: 'carbohydrates', render: totalNutrition => totalNutrition ? `${totalNutrition.carbohydrates} g` : null },
		{ title: 'Fiber', dataIndex: 'total_nutrition', key: 'fiber', render: totalNutrition => totalNutrition ? `${totalNutrition.fiber} g` : null },
		{ title: 'Sodium', dataIndex: 'total_nutrition', key: 'sodium', render: totalNutrition => totalNutrition ? `${totalNutrition.sodium} mg` : null },
		{ title: 'Cholesterol', dataIndex: 'total_nutrition', key: 'cholesterol', render: totalNutrition => totalNutrition ? `${totalNutrition.cholesterol} mg` : null },
	];

	const consumedItemColumns = [
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Calories', dataIndex: 'calories', key: 'calories' },
		{ title: 'Sugar', dataIndex: 'sugar', key: 'sugar' },
		{ title: 'Protein', dataIndex: 'protein', key: 'protein' },
		{ title: 'Fat', dataIndex: 'fat', key: 'fat' },
		{ title: 'Carbohydrates', dataIndex: 'carbohydrates', key: 'carbohydrates' },
		{ title: 'Fiber', dataIndex: 'fiber', key: 'fiber' },
		{ title: 'Sodium', dataIndex: 'sodium', key: 'sodium' },
		{ title: 'Cholesterol', dataIndex: 'cholesterol', key: 'cholesterol' },
	];

	const expandedRowRender = (record: any) => {
		return (
			<Table
				columns={consumedItemColumns}
				dataSource={record.consumed_items}
				pagination={false}
				showHeader={true}
				size="small"
				rowKey="name"
			/>
		);
	};

	const handleAdvice = function () {
		fetch('http://192.168.3.5:5001/advice', {
			method: 'GET',
		})
			.then(function (response) {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.text();
			})
			.then(function (data) {
				setAdvice(data);
			})
			.catch(function (error) {
				console.error('Error fetching data:', error);
			});
	}
	console.log(advice)

	return (
		<div className="container">
			<h1>Lose Weight Everyday</h1>
			<Button onClick={handleRefresh} type="primary">
				Refresh Nutrition Data
			</Button>
			<br/>
			<Button onClick={handleAdvice} type="primary">
				Get Diet Advice
			</Button>
			{advice && (<TextArea value={advice} />)}

			{nutritionData.length > 0 && (
				<>
					<div className="chart-container">
						<LineChart
							xAxis={[
								{
									scaleType: 'point',
									dataKey: 'date',
									valueFormatter: (value: number) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
								},
							]}
							series={[
								{
									dataKey: 'calories',
								}
							]}
							dataset={chartData}
							height={400}
							width={800}

						/>
					</div>

					<div className="pie-charts-wrapper">
						<div className="pie-chart-container">
							<label>Suggested nutrition</label>
							<PieChart
								series={[
									{
										data: std_nutrition,
									},
								]}
								legend={{hidden: true}}
								height={200}
							/>
						</div>

						<div className="pie-chart-container">
							<label>Your last 10 meals' nutrition</label>
							<PieChart
								series={[
									{
										data: aggregatedNutrition,
									},
								]}
								height={200}
								legend={{hidden: true}}
							/>
						</div>
					</div>

					<div className="table-container">
						<Table
							columns={columns}
							dataSource={nutritionData}
							expandable={{ expandedRowRender }}
							rowKey="date"
							pagination={false}
							bordered
						/>
					</div>
				</>
			)}
		</div>
	);
}

export default App;
