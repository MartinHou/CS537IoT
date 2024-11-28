import React, { useState } from 'react';
import { Table, Button } from 'antd';
import './App.css';

function App() {
  const [nutritionData, setNutritionData] = useState<any>([]);

  // Request data
  var handleRefresh = function () {
    fetch('http://127.0.0.1:5001/load', {
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
  console.log(nutritionData);

  // Main table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Calories',
      dataIndex: 'total_nutrition',
      key: 'calories',
      render: (totalNutrition) => totalNutrition ? totalNutrition.calories : null,
    },
    {
      title: 'Sugar',
      dataIndex: 'total_nutrition',
      key: 'sugar',
      render: (totalNutrition) => totalNutrition ? totalNutrition.sugar : null,
    },
    {
      title: 'Protein',
      dataIndex: 'total_nutrition',
      key: 'protein',
      render: (totalNutrition) => totalNutrition ? totalNutrition.protein : null,
    },
    {
      title: 'Fat',
      dataIndex: 'total_nutrition',
      key: 'fat',
      render: (totalNutrition) => totalNutrition ? totalNutrition.fat : null,
    },
    {
      title: 'Carbohydrates',
      dataIndex: 'total_nutrition',
      key: 'carbohydrates',
      render: (totalNutrition) => totalNutrition ? totalNutrition.carbohydrates : null,
    },
    {
      title: 'Fiber',
      dataIndex: 'total_nutrition',
      key: 'fiber',
      render: (totalNutrition) => totalNutrition ? totalNutrition.fiber : null,
    },
    {
      title: 'Sodium',
      dataIndex: 'total_nutrition',
      key: 'sodium',
      render: (totalNutrition) => totalNutrition ? totalNutrition.sodium : null,
    },
    {
      title: 'Cholesterol',
      dataIndex: 'total_nutrition',
      key: 'cholesterol',
      render: (totalNutrition) => totalNutrition ? totalNutrition.cholesterol : null,
    },
  ];

  // Columns for consumed items
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

  // Columns for total nutrition
  const totalNutritionColumns = [
    { title: 'Calories', dataIndex: 'calories', key: 'calories' },
    { title: 'Sugar', dataIndex: 'sugar', key: 'sugar' },
    { title: 'Protein', dataIndex: 'protein', key: 'protein' },
    { title: 'Fat', dataIndex: 'fat', key: 'fat' },
    { title: 'Carbohydrates', dataIndex: 'carbohydrates', key: 'carbohydrates' },
    { title: 'Fiber', dataIndex: 'fiber', key: 'fiber' },
    { title: 'Sodium', dataIndex: 'sodium', key: 'sodium' },
    { title: 'Cholesterol', dataIndex: 'cholesterol', key: 'cholesterol' },
  ];

  // Render expanded row for consumed items
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lose Weight Everyday</h1>
        <Button onClick={handleRefresh} type="primary" style={{ marginBottom: 50 }}>
          Refresh Nutrition Data
        </Button>
        <Table
          columns={columns}
          dataSource={nutritionData}
          expandable={{ expandedRowRender }}
          rowKey="id"
          pagination={false}
          bordered
        />
      </header>
    </div>
  );
}

export default App;
